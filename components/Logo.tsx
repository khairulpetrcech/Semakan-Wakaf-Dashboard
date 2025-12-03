import React, { useState } from 'react';

export const Logo: React.FC = () => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center py-6">
      {/* 
        PENTING: 
        Pastikan fail 'logo.png' ada di dalam folder 'public'.
        Jika gambar tak jumpa, ia akan revert ke logo SVG (fallback).
      */}
      
      {!imageError ? (
        <img 
          src="https://i.postimg.cc/SNHND56s/logo.png" 
          alt="Logo Assalam Care Malaysia" 
          className="w-32 h-32 object-contain mb-3 drop-shadow-md"
          onError={() => setImageError(true)}
        />
      ) : (
        // FALLBACK LOGO (Jika logo.png tiada)
        <div className="relative w-32 h-32 mb-3 drop-shadow-md flex items-center justify-center">
           <svg viewBox="0 0 200 200" className="w-full h-full fill-[#01394f]">
            <path d="M100 0 L122 38 L165 38 L144 75 L165 112 L122 112 L100 150 L78 112 L35 112 L56 75 L35 38 L78 38 Z" fill="#01394f" stroke="white" strokeWidth="3"/>
            <rect x="60" y="70" width="80" height="60" fill="#f8fafc" rx="2" />
            <circle cx="100" cy="60" r="15" fill="#f8fafc" />
            <path d="M100 60 L100 45 M92 52 L108 52" stroke="#01394f" strokeWidth="2" />
            <path d="M85 130 L85 100 L115 100 L115 130" fill="#9ca3af" />
            <path d="M70 130 L130 130 L130 135 L70 135 Z" fill="#e5e7eb" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center pt-8">
             <span className="text-[#01394f] font-bold text-xl bg-white/80 px-2 rounded">As Salam</span>
          </div>
        </div>
      )}
      
      <h1 className="text-3xl md:text-4xl font-bold text-[#01394f] tracking-tight text-center">
        Assalam Care Malaysia
      </h1>
      <p className="text-[#01394f] font-medium text-sm md:text-base uppercase tracking-widest mt-1 opacity-80">
        Semakan Status Wakaf Al-Quran
      </p>
    </div>
  );
};