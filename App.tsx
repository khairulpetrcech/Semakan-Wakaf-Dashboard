import React, { useState } from 'react';
import { Logo } from './components/Logo';
import { HeaderBanner } from './components/HeaderBanner';
import { ResultCard } from './components/ResultCard';
import { WakafRecord, SearchType } from './types';
import { searchWakafRecord } from './services/dataService';
import { generateThankYouMessage } from './services/geminiService';
import { Search, Loader2, ExternalLink, ArrowLeft, Phone, FileText } from 'lucide-react';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('phone');
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState<WakafRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aiMessage, setAiMessage] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setRecord(null);
    setAiMessage('');

    try {
      const result = await searchWakafRecord(query, searchType);
      
      if (result) {
        setRecord(result);
        setLoading(false);
        
        // Generate AI message immediately after finding record
        setLoadingAi(true);
        try {
          const msg = await generateThankYouMessage(result);
          setAiMessage(msg);
        } catch (e) {
          console.error("AI Error", e);
          setAiMessage(`Terima kasih Tuan/Puan ${result.donorName}. Wakaf anda amat kami hargai.`);
        }
        setLoadingAi(false);
      } else {
        setLoading(false);
        setError('Tiada Rekod Ditemui. Wakaf Anda Masih Dalam Proses. Akan Diselesaikan dalam 1-3 Bulan. Terima Kasih');
      }
    } catch (err) {
      setLoading(false);
      setError('Masalah sambungan. Sila cuba sebentar lagi.');
      console.error(err);
    }
  };

  const resetSearch = () => {
    setRecord(null);
    setQuery('');
    setError(null);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-800 flex flex-col">
      
      <HeaderBanner />

      <div className="flex-grow w-full max-w-4xl mx-auto px-4 py-8 pb-32">
        
        {/* Logo Section - Only show if not showing result to save space on result view */}
        <div className="transition-all duration-500">
           <Logo />
        </div>

        {/* --- SEARCH SCREEN --- */}
        {!record && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 border-t-8 border-[#01394f]">
              <h2 className="text-center text-2xl font-bold text-[#01394f] mb-2">
                Sistem Semakan Wakaf
              </h2>
              <p className="text-center text-gray-500 mb-8 text-lg">
                Sila masukkan maklumat untuk menyemak status:
              </p>
              
              {/* Big Toggle Buttons */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button 
                  type="button"
                  onClick={() => setSearchType('phone')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                    searchType === 'phone' 
                      ? 'bg-sky-50 border-[#01394f] text-[#01394f] shadow-inner ring-2 ring-sky-100' 
                      : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50 hover:border-[#01394f]/30'
                  }`}
                >
                  <Phone size={32} className="mb-2"/>
                  <span className="font-bold text-lg">No. Telefon</span>
                </button>
                
                <button 
                  type="button"
                  onClick={() => setSearchType('invoice')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                    searchType === 'invoice' 
                      ? 'bg-sky-50 border-[#01394f] text-[#01394f] shadow-inner ring-2 ring-sky-100' 
                      : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50 hover:border-[#01394f]/30'
                  }`}
                >
                  <FileText size={32} className="mb-2"/>
                  <span className="font-bold text-lg">No. Invois</span>
                </button>
              </div>

              <form onSubmit={handleSearch} className="flex flex-col gap-6">
                <div className="relative">
                  <input
                    type={searchType === 'phone' ? 'tel' : 'text'}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={searchType === 'phone' ? 'Contoh: 0123456789' : 'Contoh: INV-2024-001'}
                    className="w-full p-5 text-2xl bg-white border-2 border-gray-300 rounded-2xl focus:border-[#01394f] focus:ring-4 focus:ring-sky-100 outline-none transition-all text-center placeholder-gray-400 text-gray-800 shadow-sm"
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[#01394f] opacity-50">
                     {searchType === 'phone' ? <Phone size={24}/> : <FileText size={24}/>}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#01394f] hover:bg-[#014f6d] text-white text-xl font-bold py-5 rounded-2xl shadow-xl hover:shadow-2xl active:transform active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed mt-2 border-b-4 border-[#002233]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={28} /> Sedang Mencari...
                    </>
                  ) : (
                    <>
                      <Search size={28} /> SEMAK STATUS
                    </>
                  )}
                </button>
              </form>

              {error && (
                <div className="mt-8 p-6 bg-amber-50 text-amber-900 rounded-2xl text-center border border-amber-200 shadow-inner animate-fade-in">
                  <p className="font-bold text-lg leading-relaxed">{error}</p>
                </div>
              )}
            </div>
            
            <div className="mt-8 text-center px-6">
               <p className="text-gray-400 text-sm italic">
                 * Pastikan anda menggunakan nombor telefon yang sama semasa buat wakaf.
               </p>
            </div>
          </div>
        )}

        {/* --- RESULT SCREEN --- */}
        {record && (
          <div className="animate-fade-in">
             <button 
               onClick={resetSearch}
               className="mb-6 bg-white px-6 py-3 rounded-full shadow-md text-[#01394f] hover:bg-sky-50 flex items-center gap-2 transition-all font-bold border border-gray-200 group"
             >
               <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/> Cari Semula
             </button>
             
             <ResultCard 
               record={record} 
               aiMessage={aiMessage} 
               loadingMessage={loadingAi} 
             />
          </div>
        )}

        <div className="text-center mt-16 text-gray-400 text-sm font-medium">
          &copy; {new Date().getFullYear()} Assalam Care Malaysia. Hak Cipta Terpelihara.
        </div>
      </div>

      {/* --- STICKY BOTTOM CTA (Always visible on result) --- */}
      {record && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 shadow-[0_-8px_20px_-5px_rgba(0,0,0,0.1)]">
          <div className="max-w-3xl mx-auto">
            <a 
              href="https://assalamcare.com/order/form/blastwhatsapp" 
              target="_blank"
              rel="noreferrer"
              className="block w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white text-center py-4 px-6 rounded-xl shadow-lg transform transition-transform active:scale-95 border-b-4 border-amber-700"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="bg-white/20 p-2 rounded-full animate-pulse">
                   <ExternalLink size={24} className="text-white" />
                </div>
                <div className="text-left">
                  <span className="block text-lg md:text-xl font-bold leading-none drop-shadow-sm uppercase tracking-wide">Ingin Wakaf Al-Quran Lagi?</span>
                  <span className="block text-xs md:text-sm text-yellow-50 font-medium mt-1">Klik butang ini untuk ke Assalam Care Malaysia</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;