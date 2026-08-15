/**
 * =========================================================================
 * FORMULA-AI 2026 GRAND PRIX - GOOGLE APPS SCRIPT BACKEND ENGINE (V11)
 * =========================================================================
 */

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("REGISTRATIONS") || ss.getSheets()[0];
    var lastRow = sheet.getLastRow();
    
    if (lastRow <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify({ "result": "success", "data": [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var maxCols = Math.max(sheet.getLastColumn(), 1);
    var colCount = Math.min(maxCols, 25);
    var allData = sheet.getRange(2, 1, lastRow - 1, colCount).getValues();
    var registrations = [];

    for (var i = 0; i < allData.length; i++) {
      var row = allData[i];
      if (!row[0]) continue;

      registrations.push({
        id: row[0] ? row[0].toString() : "",
        submittedAt: row[1] ? row[1].toString() : "",
        fullName: row[2] ? row[2].toString() : "",
        email: row[3] ? row[3].toString() : "",
        phone: row[4] ? row[4].toString() : "",
        organization: row[5] ? row[5].toString() : "",
        year: row[6] ? row[6].toString() : "",
        department: row[7] ? row[7].toString() : "",
        teamName: row[8] ? row[8].toString() : "",
        teamSizeCount: row[9] ? Number(row[9]) : 1,
        teamMembers: row[10] ? row[10].toString().split(", ") : [],
        championship: row[11] ? row[11].toString() : "",
        category: row[12] ? row[12].toString() : "",
        utrNumber: row[13] ? row[13].toString() : "",
        paymentAmount: row[14] ? Number(row[14]) : 0,
        paymentStatus: row[15] ? row[15].toString() : "PENDING",
        status: row[16] ? row[16].toString() : "SUBMITTED",
        driverNumber: row[17] ? row[17].toString() : "",
        emailStatus: row[18] ? row[18].toString() : "SENT",
        driver2Name: row[19] ? row[19].toString() : "",
        driver2Phone: row[20] ? row[20].toString() : "",
        driver3Name: row[21] ? row[21].toString() : "",
        driver3Phone: row[22] ? row[22].toString() : "",
        driver4Name: row[23] ? row[23].toString() : "",
        driver4Phone: row[24] ? row[24].toString() : ""
      });
    }

    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "data": registrations }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("REGISTRATIONS") || ss.getSheets()[0];
    
    if (sheet.getMaxColumns() < 25) {
      sheet.insertColumnsAfter(sheet.getMaxColumns(), 25 - sheet.getMaxColumns());
    }

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
        "REGISTRATION STATUS",
        "DRIVER NUMBER",
        "EMAIL STATUS",
        "DRIVER 2 NAME",
        "DRIVER 2 PHONE",
        "DRIVER 3 NAME",
        "DRIVER 3 PHONE",
        "DRIVER 4 NAME",
        "DRIVER 4 PHONE"
      ]);
      sheet.getRange(1, 1, 1, 25).setFontWeight("bold").setBackground("#111115").setFontColor("#00D2BE");
    }

    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch(pErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

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

    var membersList = [fullName];
    if (data.driver2Name) membersList.push(data.driver2Name);
    if (data.driver3Name) membersList.push(data.driver3Name);
    if (data.driver4Name) membersList.push(data.driver4Name);

    var teamMembers = (data.teamMembers && data.teamMembers.length > 0) ? (Array.isArray(data.teamMembers) ? data.teamMembers.join(", ") : data.teamMembers.toString()) : membersList.join(", ");
    var championship = data.championship || "";
    var category = data.category || "";
    var utrNumber = (data.utrNumber || "").toString().trim();
    var paymentAmount = data.paymentAmount || 0;
    var paymentStatus = data.paymentStatus || "PENDING";
    var status = data.status || "SUBMITTED";
    var driverNumber = data.driverNumber || "";
    var emailStatus = data.emailStatus || "SENT";
    var driver2Name = data.driver2Name || "";
    var driver2Phone = data.driver2Phone || "";
    var driver3Name = data.driver3Name || "";
    var driver3Phone = data.driver3Phone || "";
    var driver4Name = data.driver4Name || "";
    var driver4Phone = data.driver4Phone || "";

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
      status,
      driverNumber,
      emailStatus,
      driver2Name,
      driver2Phone,
      driver3Name,
      driver3Phone,
      driver4Name,
      driver4Phone
    ];

    var existingRowIndex = -1;
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      var colCheck = Math.min(sheet.getLastColumn(), 25);
      var allData = sheet.getRange(2, 1, lastRow - 1, colCheck).getValues();
      var targetId = entryId.toUpperCase();
      var targetEmail = email.toLowerCase();
      var targetUtr = utrNumber.toUpperCase();

      for (var i = 0; i < allData.length; i++) {
        var rowId = allData[i][0] ? allData[i][0].toString().trim().toUpperCase() : "";
        var rowEmail = allData[i][3] ? allData[i][3].toString().trim().toLowerCase() : "";
        var rowUtr = allData[i][13] ? allData[i][13].toString().trim().toUpperCase() : "";

        if (rowId === targetId || (targetEmail !== "" && rowEmail === targetEmail && targetUtr !== "" && rowUtr === targetUtr)) {
          existingRowIndex = i + 2;
          break;
        }
      }
    }

    if (existingRowIndex > -1) {
      sheet.getRange(existingRowIndex, 1, 1, rowValues.length).setValues([rowValues]);
    } else {
      sheet.appendRow(rowValues);
    }

    var champUpper = (championship || "").toUpperCase();
    var catUpper = (category || "").toUpperCase();

    var hasTechEvent = champUpper.indexOf("ENGINEERING") !== -1 || 
                       catUpper.indexOf("MONACO") !== -1 || 
                       catUpper.indexOf("LE MANS") !== -1 || 
                       catUpper.indexOf("SILVERSTONE") !== -1 || 
                       catUpper.indexOf("TELEMETRY") !== -1 || 
                       catUpper.indexOf("CODE") !== -1 || 
                       catUpper.indexOf("WEB") !== -1 || 
                       catUpper.indexOf("DEBUGGING") !== -1 || 
                       catUpper.indexOf("TYPING") !== -1;

    var hasNonTechEvent = champUpper.indexOf("DAYTONA") !== -1 || 
                          champUpper.indexOf("PODIUM") !== -1 || 
                          champUpper.indexOf("TURBO") !== -1 || 
                          champUpper.indexOf("COMBO") !== -1 || 
                          catUpper.indexOf("DAYTONA") !== -1 || 
                          catUpper.indexOf("PODIUM") !== -1 || 
                          catUpper.indexOf("TURBO") !== -1 || 
                          catUpper.indexOf("RADIO") !== -1 || 
                          catUpper.indexOf("SIMULATOR") !== -1 || 
                          catUpper.indexOf("PIT STOP") !== -1 || 
                          catUpper.indexOf("SPEEDWAY") !== -1 || 
                          catUpper.indexOf("BGMI") !== -1 || 
                          catUpper.indexOf("CHARADES") !== -1 || 
                          catUpper.indexOf("MEMORY") !== -1 || 
                          catUpper.indexOf("TREASURE") !== -1;

    var whatsappGroupHtml = 
      "<div style='background-color: #111115; border: 2px solid #25D366; padding: 16px; border-radius: 12px; margin-top: 15px; text-align: center; font-family: Arial, sans-serif;'>" +
        "<div style='color: #25D366; font-size: 13px; font-weight: bold; margin-bottom: 12px;'>💬 OFFICIAL WHATSAPP GROUP JOIN LINKS</div>";

    if (hasTechEvent) {
      whatsappGroupHtml += 
        "<div style='margin-bottom: 8px;'>" +
          "<a href='https://chat.whatsapp.com/GiCGA7Z5EJ6FLjGyQ5PPc2?s=cl&p=a&mlu=0' target='_blank' style='display: block; background-color: #00D2BE; color: #000000; padding: 11px 14px; border-radius: 8px; font-size: 12px; font-weight: bold; text-decoration: none; text-transform: uppercase;'>" +
            "💻 JOIN TECHNICAL EVENTS WHATSAPP GROUP →" +
          "</a>" +
        "</div>";
    } else {
      whatsappGroupHtml += 
        "<div style='margin-bottom: 8px;'>" +
          "<a href='https://chat.whatsapp.com/K7KyJMt6ThZ5mHv0Jly1T7?s=cl&p=a&mlu=0' target='_blank' style='display: block; background-color: #F5A623; color: #000000; padding: 11px 14px; border-radius: 8px; font-size: 12px; font-weight: bold; text-decoration: none; text-transform: uppercase;'>" +
            "🎨 JOIN NON-TECHNICAL EVENTS WHATSAPP GROUP →" +
          "</a>" +
        "</div>";
    }

    whatsappGroupHtml += 
      "<div>" +
        "<a href='https://chat.whatsapp.com/IRR2ETjbcY38Lk4Eucw2b0' target='_blank' style='display: block; background-color: #25D366; color: #FFFFFF; padding: 12px 14px; border-radius: 8px; font-size: 13px; font-weight: bold; text-decoration: none; text-transform: uppercase;'>" +
          "🌐 JOIN OVERALL FORMULA-AI COMMUNITY GROUP →" +
        "</a>" +
      "</div>" +
    "</div>";

    if (email && email.indexOf("@") !== -1) {
      try {
        var subject = status === "APPROVED" 
          ? "🎉 [FORMULA-AI 2026] GRID CONFIRMED - Driver E-Pass & QR Code (ID: " + entryId + ")"
          : "🏁 [FORMULA-AI 2026] Thank You For Registering - Entry ID: " + entryId;

        var htmlBody = 
          "<div style='font-family: Arial, sans-serif; background-color: #08080A; color: #FFFFFF; padding: 25px; border-radius: 16px; border: 2px solid #00D2BE; max-width: 600px; margin: 0 auto;'>" +
            "<div style='text-align: center; border-bottom: 2px solid #22222a; padding-bottom: 15px; margin-bottom: 20px;'>" +
              "<h1 style='color: #E10600; margin: 0; font-size: 24px; letter-spacing: 2px;'>🏎️ FORMULA-AI 2026 GRAND PRIX</h1>" +
              "<p style='color: #00D2BE; font-size: 13px; font-weight: bold; margin-top: 5px;'>MONZA CIRCUIT RACE CONTROL TELEMETRY</p>" +
            "</div>" +

            "<div style='font-size: 15px; line-height: 1.6; border-bottom: 1px solid #22222a; padding-bottom: 15px; margin-bottom: 15px;'>" +
              "<p style='margin-top: 0;'>Dear <strong>" + fullName + "</strong>,</p>" +
              "<p style='color: #00D2BE; font-size: 16px; font-weight: bold; margin: 10px 0;'>✨ THANK YOU FOR REGISTERING FOR FORMULA-AI 2026! ✨</p>" +
              "<p style='color: #CCCCCC; font-size: 13px; margin: 5px 0;'>We are thrilled to welcome you and your team to the Monza National Circuit Grid! Your registration request has been successfully recorded under Entry ID: <strong style='color: #F5A623;'>" + entryId + "</strong>.</p>" +
              "<p style='color: #8A8A93; font-size: 13px; margin-top: 8px;'>Current Registration Status: <strong style='color: #00D2BE; font-size: 14px;'>" + status + "</strong>.</p>" +
            "</div>" +

            "<!-- EMBEDDED OFFICIAL E-PASS & WHATSAPP CARD -->" +
            "<div style='background-color: #111115; border: 2px solid #00D2BE; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0;'>" +
              "<div style='color: #8A8A93; font-size: 11px; font-weight: bold; letter-spacing: 1px;'>OFFICIAL DRIVER QR E-PASS</div>" +
              "<div style='font-size: 22px; font-weight: bold; color: #FFFFFF; margin: 5px 0;'>" + entryId + "</div>" +
              
              "<div style='margin: 15px 0; text-align: center;'>" +
                "<img src='https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=" + encodeURIComponent(entryId) + "' alt='Formula AI Driver QR Code' style='width: 160px; height: 160px; border: 4px solid #FFFFFF; border-radius: 8px;' />" +
              "</div>" +

              "<div style='color: #00D2BE; font-size: 12px; font-weight: bold; margin-bottom: 12px;'>SCAN AT MONZA VENUE TURNSTILE GATE</div>" +
              
              "<div style='margin-bottom: 15px;'>" +
                "<a href='https://aitsevent.vercel.app/?view=E_PASS&id=" + entryId + "' target='_blank' style='display: inline-block; background-color: #E10600; color: #FFFFFF; padding: 12px 20px; border-radius: 8px; font-size: 13px; font-weight: bold; text-decoration: none; text-transform: uppercase; shadow: 0 0 10px #E10600;'>" +
                  "🎫 VIEW &amp; DOWNLOAD DIGITAL DRIVER E-PASS →" +
                "</a>" +
              "</div>" +

              "<!-- WHATSAPP LINKS EMBEDDED INSIDE E-PASS CARD -->" +
              whatsappGroupHtml +
            "</div>" +

            "<div style='font-size: 12px; font-weight: bold; color: #E10600; margin-bottom: 8px; font-family: monospace;'>📋 REGISTRATION SUMMARY</div>" +
            "<table style='width: 100%; color: #FFFFFF; font-size: 13px; border-collapse: collapse; margin: 10px 0; font-family: monospace;'>" +
              "<tr><td style='padding: 8px; border-bottom: 1px solid #22222a; color: #8A8A93;'>ENTRY ID:</td><td style='padding: 8px; border-bottom: 1px solid #22222a; color: #00D2BE; font-weight: bold;'>" + entryId + "</td></tr>" +
              "<tr><td style='padding: 8px; border-bottom: 1px solid #22222a; color: #8A8A93;'>TEAM CALLSIGN:</td><td style='padding: 8px; border-bottom: 1px solid #22222a;'>" + teamName + "</td></tr>" +
              "<tr><td style='padding: 8px; border-bottom: 1px solid #22222a; color: #8A8A93;'>REGISTERED MEMBERS:</td><td style='padding: 8px; border-bottom: 1px solid #22222a;'>" + teamMembers + "</td></tr>" +
              "<tr><td style='padding: 8px; border-bottom: 1px solid #22222a; color: #8A8A93;'>CHAMPIONSHIP TRACK:</td><td style='padding: 8px; border-bottom: 1px solid #22222a; color: #F5A623;'>" + championship + "</td></tr>" +
              "<tr><td style='padding: 8px; border-bottom: 1px solid #22222a; color: #8A8A93;'>CATEGORY / EVENT:</td><td style='padding: 8px; border-bottom: 1px solid #22222a;'>" + category + "</td></tr>" +
              "<tr><td style='padding: 8px; border-bottom: 1px solid #22222a; color: #8A8A93;'>12-DIGIT UTR REF:</td><td style='padding: 8px; border-bottom: 1px solid #22222a; color: #F5A623;'>" + utrNumber + "</td></tr>" +
              "<tr><td style='padding: 8px; border-bottom: 1px solid #22222a; color: #8A8A93;'>TOTAL ENTRY DEPOSIT:</td><td style='padding: 8px; border-bottom: 1px solid #22222a; color: #00D2BE; font-weight: bold;'>₹" + paymentAmount + "</td></tr>" +
            "</table>" +

            "<div style='background-color: #111115; border: 1px solid #22222a; padding: 15px; border-radius: 10px; margin-top: 20px; font-size: 12px; text-align: left;'>" +
              "<div style='color: #F5A623; font-weight: bold; margin-bottom: 6px;'>📞 NEED ASSISTANCE? STUDENT COORDINATORS CONTACT:</div>" +
              "<div style='color: #CCCCCC; margin-bottom: 4px;'>⚙️ <strong>Technical Coordinators:</strong> B Sarath Kumar (8074244332) · S M Zunaid (88970 02082)</div>" +
              "<div style='color: #CCCCCC;'>🎨 <strong>Non-Technical Coordinators:</strong> B Poojan Sai (79893 72489) · S Rajkumar (63003 45719) · M Muwaz (81258 91502)</div>" +
            "</div>" +

            "<div style='text-align: center; margin-top: 25px; padding-top: 15px; border-top: 1px solid #22222a;'>" +
              "<p style='font-size: 13px; color: #FFFFFF; font-weight: bold; margin: 0;'>Warm Regards &amp; Best of Luck!</p>" +
              "<p style='font-size: 11px; color: #8A8A93; margin-top: 5px;'>Race Control Team · Formula-AI 2026 National Championship</p>" +
            "</div>" +
          "</div>";

        try {
          MailApp.sendEmail({
            to: email,
            subject: subject,
            htmlBody: htmlBody
          });
        } catch (mailErr) {
          Logger.log("MailApp Error, attempting GmailApp fallback: " + mailErr);
          GmailApp.sendEmail(email, subject, "", {
            htmlBody: htmlBody
          });
        }
      } catch (emailErr) {
        Logger.log("Email dispatch failed: " + emailErr);
      }
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
