// Semakan Wakaf Dashboard - Google Apps Script
// V17 - Multi Spreadsheet
//
// Cara guna:
// 1. Isi SPREADSHEET_IDS dengan ID semua Google Sheet.
// 2. Paste keseluruhan fail ini ke Apps Script sebagai Code.gs.
// 3. Deploy > New deployment > Web app.
// 4. Execute as: Me. Who has access: Anyone.

var SPREADSHEET_IDS = [
  "19P2NaEwYSz7dve7JJsZ0rcYFcWLZ2bUOVlLJjOFzCG0",
  "1vREDeozS-UHhvmY-TrBFUjitJKVT1vILJU4b6whmzao"
];

function doGet(e) {
  // --- KONFIGURASI LAJUR DATA PEWAKAF ---
  // A=0, B=1, C=2, D=3, E=4, F=5, G=6, H=7, I=8, J=9
  var COL_KOD_BORANG = 1; // B
  var COL_INVOIS = 2; // C
  var COL_NAMA = 3; // D
  var COL_PHONE = 4; // E
  var COL_JUMLAH = 5; // F
  var COL_TARIKH = 6; // G
  var COL_NOTA = 7; // H
  var COL_INSTITUSI = 8; // I
  var COL_MEDIA = 9; // J

  // --- KONFIGURASI LAJUR DATA PENGHANTARAN (GLOBAL PER SHEET) ---
  // K=10, L=11
  var COL_GLOBAL_INSTITUSI_NAME = 10; // K
  var COL_GLOBAL_TARIKH_HANTAR = 11; // L

  var params = e.parameter;
  var type = params.type;
  var query = params.q;

  if (!type || !query) {
    return jsonResponse({ found: false, error: "Parameter tidak lengkap" });
  }

  var foundRecords = [];
  var searchQ = String(query).trim().toLowerCase();
  var cleanQueryPhone = searchQ.replace(/[^0-9]/g, "");
  var cleanQueryInvoice = searchQ.replace(/[^a-z0-9]/g, "");

  // Loop setiap fail spreadsheet.
  for (var f = 0; f < SPREADSHEET_IDS.length; f++) {
    var ss;
    try {
      ss = SpreadsheetApp.openById(SPREADSHEET_IDS[f]);
    } catch (err) {
      continue;
    }

    var sheets = ss.getSheets();
    var ssName = ss.getName();

    // Loop setiap tab dalam spreadsheet.
    for (var s = 0; s < sheets.length; s++) {
      var sheet = sheets[s];
      var data = sheet.getDataRange().getDisplayValues();

      var sheetGlobalMedia = "";
      var globalDeliveryInst = "";
      var globalDeliveryDate = "";

      if (data.length > 1) {
        sheetGlobalMedia = String(data[1][COL_MEDIA] || "").trim();
        globalDeliveryInst = String(data[1][COL_GLOBAL_INSTITUSI_NAME] || "").trim();
        globalDeliveryDate = String(data[1][COL_GLOBAL_TARIKH_HANTAR] || "").trim();
      }

      for (var i = 1; i < data.length; i++) {
        var row = data[i];
        if (row.length < 3) continue;

        var rowInvoice = String(row[COL_INVOIS] || "").trim().toLowerCase();
        var rowKodRaw = String(row[COL_KOD_BORANG] || "").trim().toLowerCase();
        var rowName = String(row[COL_NAMA] || "").trim().toLowerCase();
        var rowPhoneRaw = String(row[COL_PHONE] || "");
        var rowPhoneClean = rowPhoneRaw.replace(/[^0-9]/g, "");
        var match = false;

        if (type === "invoice") {
          var cleanRowInvoice = rowInvoice.replace(/[^a-z0-9]/g, "");
          var cleanRowKod = rowKodRaw.replace(/[^a-z0-9]/g, "");

          if (cleanRowInvoice === cleanQueryInvoice || cleanRowKod === cleanQueryInvoice) {
            match = true;
          } else if (cleanQueryInvoice.length > 3) {
            if (cleanRowInvoice.indexOf(cleanQueryInvoice) > -1) match = true;
            else if (cleanRowKod.indexOf(cleanQueryInvoice) > -1) match = true;
          }
        } else if (type === "phone") {
          if (cleanQueryPhone.length > 5) {
            if (rowPhoneClean.indexOf(cleanQueryPhone) > -1) match = true;
            else if (rowName.replace(/[^0-9]/g, "").indexOf(cleanQueryPhone) > -1) match = true;
            else if (rowKodRaw.replace(/[^0-9]/g, "").indexOf(cleanQueryPhone) > -1) match = true;
          }
        }

        if (match) {
          var rowSpecificMedia = String(row[COL_MEDIA] || "").trim();
          var finalMedia = sheetGlobalMedia;

          if (rowSpecificMedia && rowSpecificMedia !== sheetGlobalMedia) {
            if (finalMedia) finalMedia += "," + rowSpecificMedia;
            else finalMedia = rowSpecificMedia;
          }

          foundRecords.push({
            id: ssName + "::" + sheet.getName() + "-" + (i + 1),
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
            timestamp: parseDateMy(row[COL_TARIKH]).getTime()
          });
        }
      }
    }
  }

  if (foundRecords.length > 0) {
    foundRecords.sort(function(a, b) {
      return b.timestamp - a.timestamp;
    });

    var latestRecord = foundRecords[0];
    delete latestRecord.timestamp;
    return jsonResponse({ found: true, data: latestRecord });
  }

  return jsonResponse({ found: false, message: "Rekod tidak dijumpai" });
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function parseDateMy(dateStr) {
  if (!dateStr) return new Date(0);

  var parts = dateStr.split(/[^0-9]/);
  if (parts.length < 3) return new Date(0);

  var day = parseInt(parts[0], 10) || 1;
  var month = (parseInt(parts[1], 10) || 1) - 1;
  var year = parseInt(parts[2], 10) || 1970;
  var hour = parts.length > 3 ? parseInt(parts[3], 10) : 0;
  var min = parts.length > 4 ? parseInt(parts[4], 10) : 0;

  return new Date(year, month, day, hour, min);
}

function processMediaLinks(mediaString) {
  if (!mediaString) return [];

  var links = mediaString.split(",");
  var mediaArray = [];

  for (var k = 0; k < links.length; k++) {
    var url = links[k].trim();

    if (url) {
      var type = "image";

      if (url.indexOf("t.me/") > -1 || url.indexOf("telegram.me/") > -1) {
        type = "telegram";
      } else if (url.match(/\.(mp4|mov|webm)$/i)) {
        type = "video";
      }

      mediaArray.push({ type: type, url: url });
    }
  }

  return mediaArray;
}
