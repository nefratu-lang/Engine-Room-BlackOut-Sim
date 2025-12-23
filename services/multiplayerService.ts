
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
    // Do NOT clear listeners here, as the UI component stays mounted
  }

  // Initialize as Host
  createSession(username: string): Promise<string> {
    this.disconnect(); // Clean up any previous state

    return new Promise((resolve, reject) => {
      this.isHost = true;
      // Prefix ID to make it identifiable on public server
      const uniqueId = 'naval-sim-' + Math.random().toString(36).substring(2, 7);
      
      try {
        // Cast Peer to any to bypass strict constructor checks during build
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
    this.disconnect(); // Clean up any previous state

    return new Promise((resolve, reject) => {
      this.isHost = false;
      
      try {
        // Generate a random ID for the client to ensure unique connection
        const clientId = 'cadet-' + Math.random().toString(36).substring(2, 7);
        // Cast Peer to any to bypass strict constructor checks during build
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
        
        // Connect to host
        const conn = this.peer.connect(sessionId, { reliable: true });
        
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
      
      // If Host receives data, broadcast it to others (Mesh/Star topology)
      if (this.isHost) {
        this.broadcast(event, conn.peer); // Don't send back to sender
        this.notifyListeners(event);
      } else {
        // If Client receives data, just process it
        this.notifyListeners(event);
      }
    });

    (conn as any).on('close', () => {
      this.connections = this.connections.filter(c => c.peer !== conn.peer);
    });
  }

  // Send message
  send(event: MultiplayerEvent) {
    if (this.isHost) {
      // Host sends to everyone
      this.broadcast(event);
      // Host also processes its own events locally instantly
      // (This logic is usually handled in the UI, but ensuring listeners get it is good practice if architecture demands)
    } else if (this.hostConnection) {
      // Client sends to Host
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
