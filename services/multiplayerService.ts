import { Peer, DataConnection } from 'peerjs';
import { MultiplayerEvent } from '../types';

// STUN servers are required for WebRTC to work across NATs/Firewalls
const PEER_CONFIG = {
  debug: 1,
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:global.stun.twilio.com:3478' }
    ]
  }
};

class MultiplayerService {
  private peer: Peer | null = null;
  private connections: DataConnection[] = []; // List of connected peers (if host)
  private hostConnection: DataConnection | null = null; // Connection to host (if client)
  private listeners: ((event: MultiplayerEvent) => void)[] = [];
  private isHost: boolean = false;
  private myId: string = '';

  disconnect() {
    this.connections.forEach(c => c.close());
    if (this.hostConnection) this.hostConnection.close();
    if (this.peer) {
        this.peer.destroy();
    }
    this.peer = null;
    this.connections = [];
    this.hostConnection = null;
    this.isHost = false;
  }

  // Initialize as Host
  createSession(username: string): Promise<string> {
    this.disconnect();

    return new Promise((resolve, reject) => {
      this.isHost = true;
      const uniqueId = 'naval-sim-' + Math.random().toString(36).substring(2, 7);
      
      try {
        // @ts-ignore
        this.peer = new (Peer as any)(uniqueId, PEER_CONFIG);
      } catch (e) {
        reject(e);
        return;
      }

      const timeout = setTimeout(() => {
        if (this.peer) this.peer.destroy();
        reject(new Error("Connection to signaling server timed out."));
      }, 10000);

      (this.peer as any).on('open', (id: string) => {
        clearTimeout(timeout);
        this.myId = id;
        resolve(id);
      });

      (this.peer as any).on('connection', (conn: DataConnection) => {
        this.connections.push(conn);
        this.setupConnectionEvents(conn);
      });

      (this.peer as any).on('error', (err: any) => {
        clearTimeout(timeout);
        console.error('PeerJS Host Error:', err);
        reject(err);
      });
    });
  }

  // Initialize as Client
  joinSession(username: string, sessionId: string): Promise<void> {
    this.disconnect();

    return new Promise((resolve, reject) => {
      this.isHost = false;
      
      if (!sessionId) {
        reject(new Error("Session ID is required"));
        return;
      }

      try {
        const clientId = 'cadet-' + Math.random().toString(36).substring(2, 7);
        // @ts-ignore
        this.peer = new (Peer as any)(clientId, PEER_CONFIG); 
      } catch (e) {
        reject(e);
        return;
      }

      const timeout = setTimeout(() => {
        if (this.peer) this.peer.destroy();
        reject(new Error("Connection to signaling server timed out."));
      }, 10000);

      (this.peer as any).on('open', (id: string) => {
        clearTimeout(timeout);
        this.myId = id;
        if (!this.peer) return;
        
        // sessionId string olarak zorlandı
        const conn = (this.peer as any).connect(sessionId, { reliable: true });
        
        (conn as any).on('open', () => {
          this.hostConnection = conn;
          this.setupConnectionEvents(conn);
          resolve();
        });
        
        (conn as any).on('error', (err: any) => {
            console.error('Connection Error:', err);
            reject(err);
        });
      });

      (this.peer as any).on('error', (err: any) => {
         clearTimeout(timeout);
         console.error('PeerJS Client Error:', err);
         reject(err);
      });
    });
  }

  private setupConnectionEvents(conn: DataConnection) {
    (conn as any).on('data', (data: any) => {
      const event = data as MultiplayerEvent;
      
      if (this.isHost) {
        this.broadcast(event, conn.peer);
        this.notifyListeners(event);
      } else {
        this.notifyListeners(event);
      }
    });

    (conn as any).on('close', () => {
      this.connections = this.connections.filter(c => c.peer !== conn.peer);
    });
  }

  send(event: MultiplayerEvent) {
    if (this.isHost) {
      this.broadcast(event);
    } else if (this.hostConnection) {
      this.hostConnection.send(event);
    }
  }

  private broadcast(event: MultiplayerEvent, excludePeerId?: string) {
    this.connections.forEach(conn => {
      if (conn.peer !== excludePeerId) {
        conn.send(event);
      }
    });
  }

  private notifyListeners(event: MultiplayerEvent) {
    this.listeners.forEach(fn => fn(event));
  }

  subscribe(callback: (event: MultiplayerEvent) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(fn => fn !== callback);
    };
  }
}

export const multiplayerService = new MultiplayerService();
