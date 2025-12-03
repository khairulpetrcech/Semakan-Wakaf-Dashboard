import { WakafRecord, MediaItem } from '../types';

// ---------------------------------------------------------------------------
// ARAHAN PENTING UNTUK DEPLOYMENT GOOGLE APPS SCRIPT (V13 - DIRECT CELL READING):
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
  var COL_INSTITUSI  = 8; // I (Institusi Individual - jika ada)
  var COL_MEDIA      = 9; // J (Link Telegram GLOBAL/Individual)

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
  var result = null;
  var searchQ = String(query).trim().toLowerCase();
  var cleanQueryPhone = searchQ.replace(/[^0-9]/g, '');

  // LOOP SETIAP SHEET
  for (var s = 0; s < sheets.length; s++) {
    var sheet = sheets[s];
    var data = sheet.getDataRange().getDisplayValues();
    
    // --- 1. BACA GLOBAL METADATA DARI ROW 2 (Index 1) ---
    var sheetGlobalMedia = "";
    var globalDeliveryInst = "";
    var globalDeliveryDate = "";

    if (data.length > 1) {
       // Media Global di Column J, Row 2
       sheetGlobalMedia = String(data[1][COL_MEDIA] || "").trim();
       
       // Status Penghantaran Global di Column K & L, Row 2
       globalDeliveryInst = String(data[1][COL_GLOBAL_INSTITUSI_NAME] || "").trim();
       globalDeliveryDate = String(data[1][COL_GLOBAL_TARIKH_HANTAR] || "").trim();
    }

    // --- 2. CARI DATA PEWAKAF ---
    // Mula dari i=1 (Row 2) kerana header Row 1.
    // Walaupun Row 2 ada Global Data, ia mungkin juga mengandungi data pewakaf pertama, jadi kita scan dari situ.
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      // Skip baris kosong
      if (row.length < 3) continue; 

      var rowInvoice = String(row[COL_INVOIS] || "").trim().toLowerCase();
      var rowName    = String(row[COL_NAMA] || "").trim().toLowerCase();
      var rowPhoneRaw = String(row[COL_PHONE] || "");
      var rowPhoneClean = rowPhoneRaw.replace(/[^0-9]/g, '');
      var rowKod = String(row[COL_KOD_BORANG] || "").toLowerCase();

      var match = false;

      if (type === 'invoice') {
        if (rowInvoice === searchQ) match = true;
      } 
      else if (type === 'phone') {
        if (cleanQueryPhone.length > 5) {
           if (rowPhoneClean.includes(cleanQueryPhone)) match = true;
           else if (rowName.replace(/[^0-9]/g, '').includes(cleanQueryPhone)) match = true;
           else if (rowKod.replace(/[^0-9]/g, '').includes(cleanQueryPhone)) match = true;
        }
      }

      if (match) {
        // Logik Media: Gabung Media Row + Media Global
        var rowSpecificMedia = String(row[COL_MEDIA] || "").trim();
        var finalMedia = sheetGlobalMedia;
        
        // Elak duplikasi jika media row sama dengan global
        if (rowSpecificMedia && rowSpecificMedia !== sheetGlobalMedia) {
          if (finalMedia) finalMedia += "," + rowSpecificMedia;
          else finalMedia = rowSpecificMedia;
        }

        result = {
          id: sheet.getName() + '-' + (i + 1),
          invoiceNo: row[COL_INVOIS],
          phoneNo: row[COL_PHONE], 
          donorName: row[COL_NAMA],
          amount: row[COL_JUMLAH],
          date: row[COL_TARIKH],
          notes: row[COL_NOTA],
          institutionName: row[COL_INSTITUSI],
          media: processMediaLinks(finalMedia),
          // Ambil terus dari variable global sheet tadi
          deliveryInstitution: globalDeliveryInst, 
          deliveryDate: globalDeliveryDate
        };
        break; // Jumpa match, berhenti loop baris
      }
    }
    if (result) break; // Jumpa match, berhenti loop sheet
  }

  if (result) {
    return ContentService.createTextOutput(JSON.stringify({ found: true, data: result })).setMimeType(ContentService.MimeType.JSON);
  } else {
    return ContentService.createTextOutput(JSON.stringify({ found: false, message: "Rekod tidak dijumpai" })).setMimeType(ContentService.MimeType.JSON);
  }
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
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxOmop7JVPNqZW492Q6EdwfExoRQ4UYlkxey-lAtkbY35ztH0KYFYo1wE-0NB94YBx3/exec';

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

// --- MOCK DATA ---
const searchMockData = async (query: string, type: 'invoice' | 'phone'): Promise<WakafRecord | null> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const MOCK_DATABASE: WakafRecord[] = [
    {
      id: 'Sheet1-1',
      invoiceNo: '106747',
      donorName: 'Mohammad Pauzi Bin An Wahab',
      phoneNo: '0123456789',
      amount: '100',
      date: '27/10/2025 20:41',
      notes: '',
      institutionName: 'tahfiz ulu albab',
      // MOCK DATA: Simulasi data dari Column K Row 2 & Column L Row 2
      deliveryInstitution: "Maahad Tahfiz Ulu Albab (Data dari Col K Row 2)",
      deliveryDate: "15/11/2025",
      media: processMediaLinksClientSide('https://t.me/assalamcaremalaysia/3') 
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
      deliveryInstitution: "Rumah Anak Yatim Damai (Data dari Col K Row 2)",
      deliveryDate: "01/12/2025",
      media: processMediaLinksClientSide('https://t.me/assalamcaremalaysia/5, https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=1000')
    }
  ];

  const q = query.toLowerCase().trim();

  return MOCK_DATABASE.find(r => {
    if (type === 'invoice') {
      return r.invoiceNo.toLowerCase() === q;
    } else {
      return r.phoneNo.includes(q) || r.donorName.toLowerCase().includes(q);
    }
  }) || null;
};
