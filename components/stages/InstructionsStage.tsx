import React from 'react';

interface Props {
  onComplete: () => void;
}

export const InstructionsStage: React.FC<Props> = ({ onComplete }) => {
  return (
    <div className="h-full w-full bg-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black opacity-80"></div>
      
      <div className="z-10 max-w-2xl w-full bg-slate-800/90 border border-slate-600 p-8 rounded-lg shadow-2xl backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6 border-b border-slate-600 pb-4">
          <h1 className="text-3xl font-bold text-white tracking-wide">GÖREV BRİFİNGİ</h1>
          <span className="bg-red-900/50 text-red-400 text-xs px-2 py-1 border border-red-500 rounded animate-pulse">
            GİZLİLİK DERECESİ: YÜKSEK
          </span>
        </div>

        <div className="space-y-6 text-slate-300 font-sans leading-relaxed">
          <div>
            <h3 className="text-cyan-400 font-bold uppercase text-sm mb-1">Senaryo</h3>
            <p>
              Gemide tam "Blackout" (Kararma) durumu yaşanmaktadır. Ana makine dairesinde acil durum jeneratörü devre dışı kaldı. Gemi şu anda ışıksız ve güçsüz durumda.
            </p>
          </div>

          <div>
            <h3 className="text-cyan-400 font-bold uppercase text-sm mb-1">Görevler</h3>
            <ul className="list-disc list-inside space-y-1 text-sm ml-2">
              <li>Makine dairesine gir ve arızalı parçayı tespit et.</li>
              <li>Teknik manueli kullanarak doğru basınç değerlerini bul.</li>
              <li>Sistemi yeniden başlatmak için doğru başlatma sırasını (Start-up Sequence) uygula.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-cyan-400 font-bold uppercase text-sm mb-1">Protokoller</h3>
            <ul className="list-disc list-inside space-y-1 text-sm ml-2">
              <li><span className="text-yellow-500">Süre Sınırı:</span> Elektriği geri getirmek için sadece 10 dakikanız var.</li>
              <li><span className="text-yellow-500">Yardım:</span> Takıldığınız yerde "Ask Chief" butonunu kullanarak Baş Mühendisten ipucu alabilirsiniz.</li>
              <li><span className="text-yellow-500">Çoklu Oyuncu:</span> Arkadaşlarınızla aynı odaya bağlanarak görevi birlikte çözebilirsiniz.</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            onClick={onComplete}
            className="group relative px-6 py-3 bg-cyan-700 hover:bg-cyan-600 text-white font-bold rounded overflow-hidden transition-all border border-cyan-500"
          >
            <span className="relative z-10">ANLAŞILDI / BAŞLA</span>
            <div className="absolute inset-0 h-full w-full bg-cyan-400 opacity-20 group-hover:animate-ping"></div>
          </button>
        </div>
      </div>
    </div>
  );
};
