import { WakafRecord } from "../types";

// Konfigurasi API DeepSeek
// Dapatkan API Key dari: https://platform.deepseek.com/
const API_URL = "https://api.deepseek.com/chat/completions";
// Jika DeepSeek down, boleh tukar ke OpenRouter: "https://openrouter.ai/api/v1/chat/completions"
// Model: "deepseek/deepseek-chat"

export const generateThankYouMessage = async (record: WakafRecord): Promise<string> => {
  // Ambil API Key dari .env (Vercel/Vite)
  // Pastikan anda set VITE_API_KEY dalam setting Vercel atau fail .env
  const apiKey = import.meta.env.VITE_API_KEY;

  if (!apiKey) {
    console.warn("VITE_API_KEY tiada. Sila setkan di .env atau Vercel Environment Variables.");
    return fallbackMessage(record.donorName);
  }

  try {
    const prompt = `
      Situasi: Anda adalah wakil rasmi dari AssalamCare.
      Tugasan: Tulis satu mesej penghargaan PENDEK kepada pewakaf Al-Quran (Mesti bawah 50 patah perkataan).
      
      Data Pewakaf:
      - Nama: ${record.donorName}
      - Jumlah Wakaf: RM ${record.amount} (PENTING: Ini adalah nilai wang Ringgit Malaysia, BUKAN bilangan naskhah buku)
      - Niat/Nota: ${record.notes}
      
      Arahan Penting:
      1. JANGAN sebut perkataan "naskhah" atau "buku". Sebut "wakaf" atau "nilai RM" sahaja.
      2. Gunakan perkataan "wakaf" dan bukannya "sumbangan".
      3. Mesej mestilah ringkas, padat, menyentuh hati, dan ada doa.
      4. Bahasa Melayu yang sopan.
      5. Terus tulis mesej tanpa tajuk/intro.
    `;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat", 
        messages: [
          {
            role: "system",
            content: "Anda adalah pembantu AI yang sopan dan profesional untuk AssalamCare Malaysia."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("DeepSeek API Error:", errorData);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content?.trim();

    return message || fallbackMessage(record.donorName);

  } catch (error) {
    console.error("Error generating message with AI:", error);
    return fallbackMessage(record.donorName);
  }
};

const fallbackMessage = (name: string): string => {
  return `Alhamdulillah, terima kasih Tuan/Puan ${name}. Kami mendoakan agar wakaf ini diterima Allah SWT dan menjadi amal jariah yang pahalanya mengalir berterusan.`;
};