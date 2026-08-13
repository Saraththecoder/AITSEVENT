/**
 * =========================================================================
 * FORMULA-AI 2026 GRAND PRIX - GOOGLE APPS SCRIPT BACKEND ENGINE (V4 - ULTRA DEDUPLICATION)
 * =========================================================================
 * Updates in V4:
 * 1. Ultra-Strict Deduplication: Scans ID, Email, and UTR across entire sheet.
 *    If ANY matching entry exists, it OVERWRITES that exact row instead of appending duplicates!
 * 2. Inline Image Blob (cid:qrCodeBlob): Embedded QR Code image for 100% Gmail inline display.
 * =========================================================================
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Create Header Row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "ENTRY ID",
        "SUBMITTED AT",
        "CAPTAIN FULL NAME",
        "EMAIL ADDRESS",
        "PHONE NUMBER",
        "ORGANIZATION / COLLEGE",
        "YEAR",
        "DEPARTMENT",
        "TEAM NAME",
        "TEAM SIZE",
        "TEAM MEMBERS LIST",
        "CHAMPIONSHIP TRACK",
        "EVENT CATEGORY",
        "12-DIGIT UTR NUMBER",
        "AMOUNT PAYABLE (INR)",
        "PAYMENT STATUS",
        "REGISTRATION STATUS"
      ]);
      sheet.getRange(1, 1, 1, 17).setFontWeight("bold").setBackground("#111115").setFontColor("#00D2BE");
    }

    var data = JSON.parse(e.postData.contents);

    var entryId = (data.id || data.entryId || "FA26-" + Math.floor(10000 + Math.random() * 90000)).toString().trim();
    var submittedAt = data.submittedAt || new Date().toISOString();
    var fullName = data.fullName || "";
    var email = (data.email || "").toString().trim();
    var phone = data.phone || "";
    var organization = data.organization || "";
    var year = data.year || "";
    var department = data.department || "";
    var teamName = data.teamName || "";
    var teamSize = data.teamSizeCount || 1;
    var teamMembers = (data.teamMembers || []).join(", ");
    var championship = data.championship || "";
    var category = data.category || "";
    var utrNumber = (data.utrNumber || "").toString().trim();
    var paymentAmount = data.paymentAmount || 0;
    var paymentStatus = data.paymentStatus || "PENDING";
    var status = data.status || "SUBMITTED";

    var rowValues = [
      entryId,
      submittedAt,
      fullName,
      email,
      phone,
      organization,
      year,
      department,
      teamName,
      teamSize,
      teamMembers,
      championship,
      category,
      utrNumber,
      paymentAmount,
      paymentStatus,
      status
    ];

    // ULTRA-STRICT DEDUPLICATION CHECK:
    // Scans whole sheet for matching Entry ID OR (Email AND UTR)
    var existingRowIndex = -1;
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      var allData = sheet.getRange(2, 1, lastRow - 1, 17).getValues();
      var targetId = entryId.toUpperCase();
      var targetEmail = email.toLowerCase();
      var targetUtr = utrNumber.toUpperCase();

      for (var i = 0; i < allData.length; i++) {
        var rowId = allData[i][0] ? allData[i][0].toString().trim().toUpperCase() : "";
        var rowEmail = allData[i][3] ? allData[i][3].toString().trim().toLowerCase() : "";
        var rowUtr = allData[i][13] ? allData[i][13].toString().trim().toUpperCase() : "";

        // Match by Entry ID OR by Email + UTR combination
        if (rowId === targetId || (targetEmail !== "" && rowEmail === targetEmail && targetUtr !== "" && rowUtr === targetUtr)) {
          existingRowIndex = i + 2; // Rows are 1-indexed, header is row 1
          break;
        }
      }
    }

    if (existingRowIndex > -1) {
      // OVERWRITE EXISTING ROW (Guarantees 0 duplicate rows!)
      sheet.getRange(existingRowIndex, 1, 1, rowValues.length).setValues([rowValues]);
    } else {
      // APPEND NEW ROW
      sheet.appendRow(rowValues);
    }

    // Fetch QR Code Blob Image directly via Apps Script UrlFetchApp
    var qrBlob = null;
    try {
      var qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + encodeURIComponent(entryId);
      qrBlob = UrlFetchApp.fetch(qrUrl).getBlob().setName("qrcode.png");
    } catch (qrErr) {
      Logger.log("QR Fetch Error: " + qrErr);
    }

    // Send Automated HTML Email with Embedded Inline QR Code Image
    if (email && email.indexOf("@") !== -1) {
      var subject = status === "APPROVED" 
        ? "✅ [FORMULA-AI 2026] GRID CONFIRMED - Driver E-Pass & QR Code (ID: " + entryId + ")"
        : "🏁 [FORMULA-AI 2026] Registration Received - Entry ID: " + entryId;

      var htmlBody = 
        "<div style='font-family: Arial, sans-serif; background-color: #08080A; color: #FFFFFF; padding: 25px; border-radius: 16px; border: 2px solid #00D2BE; max-width: 600px; margin: 0 auto;'>" +
          "<div style='text-align: center; border-bottom: 2px solid #22222a; pb-15px; margin-bottom: 20px;'>" +
            "<h1 style='color: #E10600; margin: 0; font-size: 24px; letter-spacing: 2px;'>🏎️ FORMULA-AI 2026 GRAND PRIX</h1>" +
            "<p style='color: #00D2BE; font-size: 13px; font-weight: bold; margin-top: 5px;'>MONZA CIRCUIT RACE CONTROL TELEMETRY</p>" +
          "</div>" +

          "<p style='font-size: 15px;'>Dear <strong>" + fullName + "</strong>,</p>" +
          "<p style='color: #8A8A93; font-size: 13px;'>Your registration status has been updated to: <strong style='color: #00D2BE;'>" + status + "</strong>.</p>" +

          "<!-- EMBEDDED E-PASS QR CODE CARD -->" +
          "<div style='background-color: #111115; border: 2px solid #00D2BE; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0;'>" +
            "<div style='color: #8A8A93; font-size: 11px; font-weight: bold; letter-spacing: 1px;'>OFFICIAL DRIVER QR PASS</div>" +
            "<div style='font-size: 22px; font-weight: bold; color: #FFFFFF; margin: 5px 0;'>" + entryId + "</div>" +
            
            "<div style='margin: 15px 0; text-align: center;'>" +
              (qrBlob 
                ? "<img src='cid:qrCodeBlob' alt='Formula AI Driver QR Code' style='width: 160px; height: 160px; border: 4px solid #FFFFFF; border-radius: 8px;' />" 
                : "<img src='https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=" + encodeURIComponent(entryId) + "' alt='Formula AI Driver QR Code' style='width: 160px; height: 160px; border: 4px solid #FFFFFF; border-radius: 8px;' />"
              ) +
            "</div>" +

            "<div style='color: #00D2BE; font-size: 12px; font-weight: bold;'>SCAN AT MONZA VENUE TURNSTILE GATE</div>" +
          "</div>" +

          "<table style='width: 100%; color: #FFFFFF; font-size: 13px; border-collapse: collapse; margin: 15px 0;'>" +
            "<tr><td style='padding: 8px; border-bottom: 1px solid #22222a; color: #8A8A93;'>ENTRY ID:</td><td style='padding: 8px; border-bottom: 1px solid #22222a; color: #00D2BE; font-weight: bold;'>" + entryId + "</td></tr>" +
            "<tr><td style='padding: 8px; border-bottom: 1px solid #22222a; color: #8A8A93;'>TEAM CALLSIGN:</td><td style='padding: 8px; border-bottom: 1px solid #22222a;'>" + teamName + "</td></tr>" +
            "<tr><td style='padding: 8px; border-bottom: 1px solid #22222a; color: #8A8A93;'>REGISTERED MEMBERS:</td><td style='padding: 8px; border-bottom: 1px solid #22222a;'>" + teamMembers + "</td></tr>" +
            "<tr><td style='padding: 8px; border-bottom: 1px solid #22222a; color: #8A8A93;'>CHAMPIONSHIP TRACK:</td><td style='padding: 8px; border-bottom: 1px solid #22222a; color: #F5A623;'>" + championship + "</td></tr>" +
            "<tr><td style='padding: 8px; border-bottom: 1px solid #22222a; color: #8A8A93;'>CATEGORY:</td><td style='padding: 8px; border-bottom: 1px solid #22222a;'>" + category + "</td></tr>" +
            "<tr><td style='padding: 8px; border-bottom: 1px solid #22222a; color: #8A8A93;'>UTR REF NUMBER:</td><td style='padding: 8px; border-bottom: 1px solid #22222a; color: #F5A623;'>" + utrNumber + "</td></tr>" +
            "<tr><td style='padding: 8px; border-bottom: 1px solid #22222a; color: #8A8A93;'>TOTAL ENTRY DEPOSIT:</td><td style='padding: 8px; border-bottom: 1px solid #22222a; color: #00D2BE; font-weight: bold;'>₹" + paymentAmount + "</td></tr>" +
          "</table>" +

          "<p style='font-size: 11px; color: #8A8A93; text-align: center; margin-top: 20px; border-t: 1px solid #22222a; pt-15px;'>" +
            "Monza Circuit Race Control · Formula-AI 2026 National Championship" +
          "</p>" +
        "</div>";

      var emailOptions = {
        to: email,
        subject: subject,
        htmlBody: htmlBody
      };

      if (qrBlob) {
        emailOptions.inlineImages = {
          qrCodeBlob: qrBlob
        };
      }

      MailApp.sendEmail(emailOptions);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "id": entryId, "updated": existingRowIndex > -1 }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}
