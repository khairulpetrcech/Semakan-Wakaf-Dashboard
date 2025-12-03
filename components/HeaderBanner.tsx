import React from 'react';
import { CheckCircle } from 'lucide-react';

export const HeaderBanner: React.FC = () => {
  return (
    <div className="w-full bg-[#01394f] text-white relative overflow-hidden shadow-2xl">
      {/* Background Image Overlay Simulation */}
      <div className="absolute inset-0 opacity-30">
        <img 
          src="https://i.postimg.cc/c1cVrFM5/poster-bg.png" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative max-w-5xl mx-auto px-4 py-8 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left/Center Text Content */}
        <div className="text-center md:text-left z-10 w-full md:w-2/3">
          <h2 className="text-yellow-400 font-bold text-3xl md:text-5xl leading-tight mb-2 drop-shadow-md tracking-tight">
            LEBIH 80,000
          </h2>
          <h3 className="text-white font-bold text-xl md:text-2xl tracking-wide mb-6 uppercase">
            Pilih Kami Untuk Wakaf
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sky-50 text-sm md:text-base font-medium">
            <div className="flex items-center gap-2 justify-center md:justify-start bg-[#002233]/50 p-2 rounded-lg backdrop-blur-sm border border-sky-700/30">
              <CheckCircle size={18} className="text-yellow-400 flex-shrink-0" /> 
              <span>0% Caj Pengurusan</span>
            </div>
            <div className="flex items-center gap-2 justify-center md:justify-start bg-[#002233]/50 p-2 rounded-lg backdrop-blur-sm border border-sky-700/30">
              <CheckCircle size={18} className="text-yellow-400 flex-shrink-0" /> 
              <span>0% Komisen Diambil</span>
            </div>
            <div className="flex items-center gap-2 justify-center md:justify-start bg-[#002233]/50 p-2 rounded-lg backdrop-blur-sm border border-sky-700/30">
              <CheckCircle size={18} className="text-yellow-400 flex-shrink-0" /> 
              <span>Tiada Pihak Ketiga</span>
            </div>
            <div className="flex items-center gap-2 justify-center md:justify-start bg-[#002233]/50 p-2 rounded-lg backdrop-blur-sm border border-sky-700/30">
              <CheckCircle size={18} className="text-yellow-400 flex-shrink-0" /> 
              <span>Bukti Gambar & Video</span>
            </div>
          </div>
          
          <div className="mt-6 inline-block bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/20">
             <p className="text-xs md:text-sm font-mono text-sky-100 flex items-center gap-2">
               <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
               Bukti Terima Al-Quran: t.me/assalamcaremalaysia
             </p>
          </div>
        </div>

        {/* Right Side - Representative Image (Simulated collage) */}
        <div className="hidden md:block w-1/3 relative h-48">
           <div className="absolute inset-0 bg-gradient-to-l from-[#01394f]/0 to-[#01394f] z-10"></div>
           <img 
            src="https://i.postimg.cc/SNHND56s/logo.png" 
            className="rounded-xl border-4 border-yellow-500/50 shadow-lg transform rotate-3 hover:rotate-0 transition-all duration-500 object-cover h-full w-full"
            alt="Anak-anak tahfiz"
           />
        </div>
      </div>
      
      {/* Decorative Gold Stripe at Bottom */}
      <div className="h-2 w-full bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600"></div>
    </div>
  );
};