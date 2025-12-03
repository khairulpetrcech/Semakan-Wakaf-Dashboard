import React from 'react';
import { WakafRecord } from '../types';
import { Heart, MapPin, Calendar, DollarSign, MessageSquare, Image as ImageIcon, Video, Star, FileText, Send, Truck } from 'lucide-react';

interface ResultCardProps {
  record: WakafRecord;
  aiMessage: string;
  loadingMessage: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({ record, aiMessage, loadingMessage }) => {
  
  // Check if notes exist and are not just whitespace
  const hasNotes = record.notes && record.notes.trim().length > 0;

  // Helper to get Telegram Embed URL
  const getTelegramEmbedUrl = (url: string) => {
    // Force embed mode for Telegram links
    // Format required: https://t.me/channel/123?embed=1
    try {
      // Remove trailing slashes
      let cleanUrl = url.replace(/\/$/, "");
      
      // If already has params
      if (cleanUrl.includes('?')) {
        return `${cleanUrl}&embed=1&mode=tme`;
      } else {
        return `${cleanUrl}?embed=1&mode=tme`;
      }
    } catch (e) {
      return url;
    }
  };

  return (
    <div className="w-full animate-fade-in pb-24">
      
      {/* HEADER: NAMA PEWAKAF */}
      <div className="bg-[#01394f] text-white rounded-t-3xl p-8 text-center shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400"></div>
        <p className="text-sky-200 text-sm font-bold uppercase tracking-widest mb-2">Rekod Wakaf Dijumpai</p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-wide">{record.donorName}</h1>
      </div>

      {/* MESEJ KHAS (AI GENERATED) */}
      <div className="bg-white border-l-8 border-r-8 border-[#01394f] p-6 md:p-10 shadow-xl mb-8 relative">
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-[#01394f] p-3 rounded-full shadow-md border-4 border-white">
           <Heart size={32} fill="currentColor" />
        </div>

        <div className="flex flex-col items-center text-center mt-4">
          <h2 className="text-2xl font-bold text-[#01394f] mb-6">
            Sekalung Penghargaan
          </h2>

          {loadingMessage ? (
            <div className="w-full max-w-xl animate-pulse space-y-4">
              <div className="h-4 bg-slate-100 rounded w-full"></div>
              <div className="h-4 bg-slate-100 rounded w-5/6 mx-auto"></div>
              <div className="h-4 bg-slate-100 rounded w-4/6 mx-auto"></div>
            </div>
          ) : (
            <div className="bg-sky-50/50 p-8 rounded-2xl border border-sky-100 relative">
              <Star className="absolute top-4 left-4 text-yellow-400 opacity-40" size={20} fill="currentColor" />
              <Star className="absolute bottom-4 right-4 text-yellow-400 opacity-40" size={20} fill="currentColor" />
              <p className="text-xl md:text-2xl text-[#01394f] leading-relaxed italic font-medium">
                "{aiMessage}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* BUTIRAN WAKAF */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-gray-100">
        <div className="bg-slate-50 px-8 py-5 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-700 flex items-center gap-3">
            <div className="bg-sky-100 p-2 rounded-lg text-[#01394f]">
               <DollarSign size={20} /> 
            </div>
            Butiran Wakaf
          </h3>
          <span className="text-xs bg-[#01394f] text-white px-3 py-1 rounded-full font-bold">SAH</span>
        </div>

        <div className="p-6 md:p-8 grid gap-6 md:grid-cols-2">
          
          {/* Jumlah (Full Width) */}
          <div className="md:col-span-2 bg-white border-2 border-slate-100 p-5 rounded-2xl hover:border-[#01394f]/30 transition-colors shadow-sm group text-center">
            <p className="text-xs text-gray-400 font-bold uppercase mb-2 tracking-wider">Jumlah Wakaf</p>
            <p className="text-5xl font-bold text-[#01394f] group-hover:text-[#014f6d] transition-colors">
              RM {record.amount}
            </p>
          </div>

          {/* Nota - Only show if exists */}
          {hasNotes && (
            <div className="md:col-span-2 bg-amber-50/50 border-2 border-amber-100 p-6 rounded-2xl">
               <p className="text-xs text-amber-600 font-bold uppercase mb-2 tracking-wider flex items-center gap-1">
                 <MessageSquare size={14}/> Niat / Nota Tambahan
               </p>
               <p className="text-xl text-gray-800 italic font-medium">"{record.notes}"</p>
            </div>
          )}
          
          {/* Tarikh & No Invois */}
          <div className="md:col-span-2 flex flex-wrap justify-center gap-6 text-gray-500 text-sm border-t border-gray-100 pt-6">
             <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
               <Calendar size={16} className="text-[#01394f]"/> 
               <span className="font-semibold">{record.date}</span>
             </div>
             <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
               <FileText size={16} className="text-[#01394f]"/> 
               <span className="font-mono font-semibold">#{record.invoiceNo}</span>
             </div>
          </div>
        </div>
      </div>

      {/* MEDIA GALLERY */}
      {record.media && record.media.length > 0 ? (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-gray-100">
           <div className="bg-[#01394f] px-8 py-5 text-white">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <ImageIcon className="text-yellow-400" /> Bukti Gambar & Video
            </h3>
          </div>
          <div className="p-6 md:p-8 bg-slate-50">
            
            <p className="mb-8 text-gray-700 font-medium text-lg leading-relaxed text-center italic max-w-3xl mx-auto">
              Alhamdulillah, tahniah <span className="font-bold text-[#01394f]">{record.donorName}</span> wakaf cik telah selesai! di bawah bukti gambar dan video Al-Quran telah sampai kepada institusi penerima.
            </p>

            {/* NEW: STATUS PENGHANTARAN */}
            {(record.deliveryInstitution || record.deliveryDate) && (
              <div className="max-w-2xl mx-auto mb-10 bg-gradient-to-br from-white to-emerald-50 rounded-xl p-6 border border-emerald-100 shadow-sm relative overflow-hidden text-center md:text-left">
                 <div className="flex flex-col md:flex-row gap-6 items-center md:items-start relative z-10">
                    <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                       <Truck size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-emerald-800 font-bold text-sm uppercase tracking-wider mb-3">
                        Status Penghantaran
                      </h4>
                      
                      <div className="space-y-2">
                        {record.deliveryInstitution && (
                          <div>
                            <p className="text-xs text-emerald-600/80 font-semibold uppercase mb-1">Institusi Penerima</p>
                            <p className="text-lg md:text-xl font-bold text-gray-800 leading-tight">{record.deliveryInstitution}</p>
                          </div>
                        )}
                        
                        {record.deliveryDate && (
                          <div className="mt-2">
                            <p className="text-xs text-emerald-600/80 font-semibold uppercase mb-1">Tarikh Serahan</p>
                            <p className="text-lg md:text-xl font-bold text-gray-800">{record.deliveryDate}</p>
                          </div>
                        )}
                      </div>
                    </div>
                 </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {record.media.map((item, idx) => (
                <div key={idx} className="bg-white p-2 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-shadow flex flex-col overflow-hidden">
                   
                   {/* TELEGRAM EMBED LOGIC */}
                   {item.type === 'telegram' ? (
                     <div className="w-full flex flex-col h-full">
                        <div className="relative w-full overflow-hidden rounded-xl border border-gray-200 bg-white" style={{ minHeight: '400px' }}>
                          <iframe 
                            src={getTelegramEmbedUrl(item.url)} 
                            className="w-full h-full absolute inset-0 border-0"
                            title={`Telegram Post ${idx}`}
                            loading="lazy"
                          ></iframe>
                        </div>
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="mt-3 w-full flex items-center justify-center gap-2 py-3 bg-[#229ED9]/10 text-[#229ED9] rounded-xl font-bold hover:bg-[#229ED9]/20 transition-colors"
                        >
                          <Send size={18}/> Buka di Telegram
                        </a>
                     </div>
                   ) : item.type === 'video' ? (
                      <video controls className="w-full h-64 object-cover rounded-xl bg-black">
                        <source src={item.url} type="video/mp4" />
                        Browser anda tidak menyokong video.
                      </video>
                   ) : (
                      <img 
                        src={item.url} 
                        alt={`Bukti ${idx + 1}`} 
                        className="w-full h-auto max-h-[500px] object-cover rounded-xl bg-gray-100"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Gambar+Tidak+Dapat+Dipaparkan';
                        }}
                      />
                   )}
                   
                   {/* CAPTION (Skip for Telegram as it has its own) */}
                   {item.type !== 'telegram' && (
                     <div className="mt-4 px-2 pb-2 text-center">
                       <p className="font-bold text-[#01394f] text-lg">{item.caption || `Bukti Media #${idx+1}`}</p>
                     </div>
                   )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-3xl p-10 text-center text-gray-400 border-2 border-dashed border-gray-200">
          <ImageIcon className="mx-auto mb-3 opacity-30" size={48}/>
          <p className="text-lg font-medium">Tiada media bukti dimuat naik buat masa ini.</p>
        </div>
      )}
    </div>
  );
};