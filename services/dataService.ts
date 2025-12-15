import { WakafRecord, MediaItem } from '../types';

// ---------------------------------------------------------------------------
// ARAHAN PENTING UNTUK DEPLOYMENT GOOGLE APPS SCRIPT (V16 - LATEST RECORD PRIORITY):
// 1. Buka Google Sheet > Extensions > Apps Script.
// 2. Padam kod lama sepenuhnya.
// 3. COPY & PASTE kod di bawah ini.
// 4. PENTING: Klik butang 'Deploy' (Biru) > 'New deployment'.
// 5. Pastikan 'Who has access' = 'Anyone'.
// 6. Klik 'Deploy'. 

/*
function doGet(e) {
  // --- KONFIGURASI LAJUR DATA PEWAKAF ---
  // A=0, B=1, C=2, D=3, E=4, F=5, G=6, H=7, I=8, J=9
  var COL_KOD_BORANG = 1; // B
  var COL_INVOIS     = 2; // C
  var COL_NAMA       = 3; // D
  var COL_PHONE      = 4; // E
  var COL_JUMLAH     = 5; // F 
  var COL_TARIKH     = 6; // G
  var COL_NOTA       = 7; // H
  var COL_INSTITUSI  = 8; // I 
  var COL_MEDIA      = 9; // J 

  // --- KONFIGURASI LAJUR DATA PENGHANTARAN (GLOBAL PER SHEET) ---
  // K=10, L=11
  var COL_GLOBAL_INSTITUSI_NAME = 10; // K
  var COL_GLOBAL_TARIKH_HANTAR  = 11; // L

  var params = e.parameter;
  var type = params.type; 
  var query = params.q;
  
  if (!type || !query) {
    return ContentService.createTextOutput(JSON.stringify({ found: false, error: "Parameter tidak lengkap" })).setMimeType(ContentService.MimeType.JSON);
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets(); 
  
  // Array untuk simpan semua rekod yang jumpa
  var foundRecords = [];
  
  var searchQ = String(query).trim().toLowerCase();
  var cleanQueryPhone = searchQ.replace(/[^0-9]/g, '');
  var cleanQueryInvoice = searchQ.replace(/[^a-z0-9]/g, '');

  // LOOP SETIAP SHEET
  for (var s = 0; s < sheets.length; s++) {
    var sheet = sheets[s];
    var data = sheet.getDataRange().getDisplayValues();
    
    // --- 1. BACA GLOBAL METADATA DARI ROW 2 ---
    var sheetGlobalMedia = "";
    var globalDeliveryInst = "";
    var globalDeliveryDate = "";

    if (data.length > 1) {
       sheetGlobalMedia = String(data[1][COL_MEDIA] || "").trim();
       globalDeliveryInst = String(data[1][COL_GLOBAL_INSTITUSI_NAME] || "").trim();
       globalDeliveryDate = String(data[1][COL_GLOBAL_TARIKH_HANTAR] || "").trim();
    }

    // --- 2. CARI DATA PEWAKAF ---
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (row.length < 3) continue; 

      var rowInvoice = String(row[COL_INVOIS] || "").trim().toLowerCase();
      var rowKodRaw  = String(row[COL_KOD_BORANG] || "").trim().toLowerCase();
      var rowName    = String(row[COL_NAMA] || "").trim().toLowerCase();
      var rowPhoneRaw = String(row[COL_PHONE] || "");
      var rowPhoneClean = rowPhoneRaw.replace(/[^0-9]/g, '');

      var match = false;

      if (type === 'invoice') {
        var cleanRowInvoice = rowInvoice.replace(/[^a-z0-9]/g, '');
        var cleanRowKod = rowKodRaw.replace(/[^a-z0-9]/g, '');

        if (cleanRowInvoice === cleanQueryInvoice || cleanRowKod === cleanQueryInvoice) {
           match = true;
        } else if (cleanQueryInvoice.length > 3) {
           if (cleanRowInvoice.indexOf(cleanQueryInvoice) > -1) match = true;
           else if (cleanRowKod.indexOf(cleanQueryInvoice) > -1) match = true;
        }
      } 
      else if (type === 'phone') {
        if (cleanQueryPhone.length > 5) {
           if (rowPhoneClean.includes(cleanQueryPhone)) match = true;
           else if (rowName.replace(/[^0-9]/g, '').includes(cleanQueryPhone)) match = true;
           else if (rowKodRaw.replace(/[^0-9]/g, '').includes(cleanQueryPhone)) match = true;
        }
      }

      if (match) {
        var rowSpecificMedia = String(row[COL_MEDIA] || "").trim();
        var finalMedia = sheetGlobalMedia;
        if (rowSpecificMedia && rowSpecificMedia !== sheetGlobalMedia) {
          if (finalMedia) finalMedia += "," + rowSpecificMedia;
          else finalMedia = rowSpecificMedia;
        }

        // Simpan dalam array (belum return lagi)
        foundRecords.push({
          id: sheet.getName() + '-' + (i + 1),
          invoiceNo: row[COL_INVOIS] || row[COL_KOD_BORANG], 
          phoneNo: row[COL_PHONE], 
          donorName: row[COL_NAMA],
          amount: row[COL_JUMLAH],
          date: row[COL_TARIKH],
          notes: row[COL_NOTA],
          institutionName: row[COL_INSTITUSI],
          media: processMediaLinks(finalMedia),
          deliveryInstitution: globalDeliveryInst, 
          deliveryDate: globalDeliveryDate,
          // Tambah timestamp untuk sorting
          timestamp: parseDateMy(row[COL_TARIKH]).getTime()
        });
      }
    }
  }

  // LOGIK PENTING: Jika ada lebih dari satu rekod, cari yang paling LATEST
  if (foundRecords.length > 0) {
    // Sort descending (Terbaru di atas)
    foundRecords.sort(function(a, b) {
      return b.timestamp - a.timestamp;
    });

    // Ambil yang paling atas (Latest)
    var latestRecord = foundRecords[0];

    // Buang field timestamp sebelum hantar ke frontend
    delete latestRecord.timestamp;

    return ContentService.createTextOutput(JSON.stringify({ found: true, data: latestRecord })).setMimeType(ContentService.MimeType.JSON);
  } else {
    return ContentService.createTextOutput(JSON.stringify({ found: false, message: "Rekod tidak dijumpai" })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Helper untuk parse tarikh format Malaysia (DD/MM/YYYY HH:mm)
function parseDateMy(dateStr) {
  if (!dateStr) return new Date(0);
  // Split by non-digit characters
  var parts = dateStr.split(/[^0-9]/);
  
  // Perlukan sekurang-kurangnya Day, Month, Year
  if (parts.length < 3) return new Date(0);
  
  var day = parseInt(parts[0], 10) || 1;
  var month = (parseInt(parts[1], 10) || 1) - 1; // JS month 0-11
  var year = parseInt(parts[2], 10) || 1970;
  var hour = parts.length > 3 ? parseInt(parts[3], 10) : 0;
  var min = parts.length > 4 ? parseInt(parts[4], 10) : 0;
  
  return new Date(year, month, day, hour, min);
}

function processMediaLinks(mediaString) {
  if (!mediaString) return [];
  var links = mediaString.split(',');
  var mediaArray = [];
  for (var k = 0; k < links.length; k++) {
    var url = links[k].trim();
    if (url) {
      var type = 'image';
      if (url.indexOf('t.me/') > -1 || url.indexOf('telegram.me/') > -1) {
        type = 'telegram';
      } else if (url.match(/\.(mp4|mov|webm)$/i)) {
        type = 'video';
      }
      mediaArray.push({ type: type, url: url });
    }
  }
  return mediaArray;
}
*/
// ---------------------------------------------------------------------------

// ⚠️ PASTE 'WEB APP URL' ANDA DI SINI (Mesti berakhir dengan /exec)
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz1SEbD_Luk7vCSNZT1LUQDLAVivvrPp6PETXKbhtkjR6nS8NefB0Jki-l3xj66EJ_K/exec';

// --- CLIENT SIDE HELPERS ---
const processMediaLinksClientSide = (mediaString: string): MediaItem[] => {
  if (!mediaString) return [];
  const links = mediaString.split(',');
  const mediaArray: MediaItem[] = [];
  
  for (let k = 0; k < links.length; k++) {
    const url = links[k].trim();
    if (url) {
      let type: 'image' | 'video' | 'telegram' = 'image';
      
      if (url.includes('t.me/') || url.includes('telegram.me/')) {
        type = 'telegram';
      } else if (url.match(/\.(mp4|mov|webm)$/i)) {
        type = 'video';
      }

      mediaArray.push({ type, url });
    }
  }
  return mediaArray;
};

// Helper date parser untuk Client Side (Mock Data)
const parseDateString = (dateStr: string): Date => {
  const parts = dateStr.split(/[^0-9]/);
  if (parts.length < 3) return new Date(0);
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  const hour = parts.length > 3 ? parseInt(parts[3], 10) : 0;
  const min = parts.length > 4 ? parseInt(parts[4], 10) : 0;
  return new Date(year, month, day, hour, min);
};

export const searchWakafRecord = async (query: string, type: 'invoice' | 'phone'): Promise<WakafRecord | null> => {
  
  if (GOOGLE_SCRIPT_URL.includes('PLACEHOLDER') || !GOOGLE_SCRIPT_URL.includes('/exec')) {
     console.warn("⚠️ URL Script salah. Guna Mock Data.");
     return searchMockData(query, type);
  }

  try {
    const timestamp = new Date().getTime();
    const url = `${GOOGLE_SCRIPT_URL}?type=${type}&q=${encodeURIComponent(query)}&_=${timestamp}`;

    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
    });

    if (!response.ok) throw new Error("Gagal menyambung ke Google Script");

    const result = await response.json();

    if (result.error) throw new Error(result.error);

    if (result.found && result.data) {
      const record = result.data;
      if (Array.isArray(record.media)) {
        record.media = record.media.map((m: any) => {
          if ((m.url.includes('t.me/') || m.url.includes('telegram.me/')) && m.type !== 'telegram') {
            m.type = 'telegram';
          }
          return m;
        });
      }
      return record as WakafRecord;
    }
    
    return null;

  } catch (error: any) {
    console.error("Error fetching data:", error);
    return searchMockData(query, type);
  }
};

// --- MOCK DATA UPDATED (RETURNS LATEST) ---
const searchMockData = async (query: string, type: 'invoice' | 'phone'): Promise<WakafRecord | null> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const MOCK_DATABASE: WakafRecord[] = [
    {
      id: 'Sheet1-1',
      invoiceNo: '106747',
      donorName: 'Mohammad Pauzi (Transaksi Lama)',
      phoneNo: '0123456789',
      amount: '50',
      date: '27/10/2024 10:00', // Tarikh Lama
      notes: 'Wakaf bulan lepas',
      institutionName: 'tahfiz ulu albab',
      deliveryInstitution: "Maahad Tahfiz Ulu Albab",
      deliveryDate: "15/11/2024",
      media: processMediaLinksClientSide('https://t.me/assalamcaremalaysia/3') 
    },
    {
      id: 'Sheet1-3',
      invoiceNo: '106999',
      donorName: 'Mohammad Pauzi Bin An Wahab (TERKINI)',
      phoneNo: '0123456789',
      amount: '100',
      date: '27/10/2025 20:41', // Tarikh Baru (Sepatutnya ini yang keluar)
      notes: 'Wakaf terkini',
      institutionName: 'tahfiz ulu albab',
      deliveryInstitution: "Maahad Tahfiz Ulu Albab",
      deliveryDate: "01/12/2025",
      media: processMediaLinksClientSide('https://t.me/assalamcaremalaysia/4') 
    },
    {
      id: 'Sheet1-2',
      invoiceNo: 'INV-TEST-01',
      donorName: 'Hajah Aminah',
      phoneNo: '0198765432',
      amount: '350',
      date: '28/10/2025 10:00',
      notes: 'Wakaf untuk arwah suami',
      institutionName: 'Maahad Tahfiz Integrasi',
      deliveryInstitution: "Rumah Anak Yatim Damai",
      deliveryDate: "01/12/2025",
      media: processMediaLinksClientSide('https://t.me/assalamcaremalaysia/5, https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=1000')
    }
  ];

  const q = query.toLowerCase().trim();

  // 1. Cari semua yang match
  const matches = MOCK_DATABASE.filter(r => {
    if (type === 'invoice') {
      const cleanQ = q.replace(/[^a-z0-9]/g, '');
      const cleanInv = r.invoiceNo.replace(/[^a-z0-9]/g, '');
      return cleanInv.includes(cleanQ);
    } else {
      return r.phoneNo.includes(q) || r.donorName.toLowerCase().includes(q);
    }
  });

  // 2. Jika ada match, sort ikut tarikh (Latest first)
  if (matches.length > 0) {
    matches.sort((a, b) => {
      const dateA = parseDateString(a.date).getTime();
      const dateB = parseDateString(b.date).getTime();
      return dateB - dateA; // Descending
    });
    return matches[0]; // Return yang paling latest
  }

  return null;
};