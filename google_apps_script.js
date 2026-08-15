/**
 * =========================================================================
 * FORMULA-AI 2026 GRAND PRIX - GOOGLE APPS SCRIPT BACKEND ENGINE (V13 - HARDENED)
 * =========================================================================
 * Changes from V12:
 *  - lock.tryLock() return value is checked; request fails fast if lock not acquired
 *  - all user-supplied strings are HTML-escaped before being placed in the email
 *  - entryId generation checks for collisions against existing rows
 *  - numeric fields (teamSizeCount, paymentAmount) are sanitized with Number()/isNaN
 *  - basic email format validation before attempting to send
 *  - emailStatus is updated to reflect actual send success/failure and written back to the row
 *  - WhatsApp links & coordinator contacts pulled into CONFIG for easy maintenance
 *  - status / paymentStatus / driverNumber are now admin-only fields, gated
 *    behind a secret token so the public form endpoint can't be used to
 *    self-approve a registration or forge a payment status
 *
 * ONE-TIME SETUP REQUIRED:
 *  Run this once from the script editor (Run > setAdminSecret, after editing
 *  the value below), or set it manually under Project Settings > Script
 *  Properties > ADMIN_SECRET. Keep this value private - anyone who has it
 *  can approve registrations and set payment status via the API.
 * =========================================================================
 */

function setAdminSecret() {
  // EDIT THE VALUE BELOW, then run this function once from the script editor.
  PropertiesService.getScriptProperties().setProperty("ADMIN_SECRET", "REPLACE_WITH_A_LONG_RANDOM_SECRET");
  Logger.log("Admin secret has been set.");
}

var CONFIG = {
  SHEET_NAME: "REGISTRATIONS",
  MAX_COLS: 25,
  // Fields only an authenticated (admin) request is allowed to set/change.
  // Public form submissions can never flip these, even on an "update" match.
  ADMIN_ONLY_FIELDS: ["status", "paymentStatus", "driverNumber"],
  WHATSAPP: {
    TECH: "https://chat.whatsapp.com/GiCGA7Z5EJ6FLjGyQ5PPc2?s=cl&p=a&mlu=0",
    NON_TECH: "https://chat.whatsapp.com/K7KyJMt6ThZ5mHv0Jly1T7?s=cl&p=a&mlu=0",
    COMMUNITY: "https://chat.whatsapp.com/IRR2ETjbcY38Lk4Eucw2b0"
  },
  EPASS_BASE_URL: "https://aitsevent.vercel.app/?view=E_PASS&id=",
  COORDINATORS: {
    technical: "B Sarath Kumar (8074244332) · S M Zunaid (88970 02082)",
    nonTechnical: "B Poojan Sai (79893 72489) · S Rajkumar (63003 45719) · M Muwaz (81258 91502)"
  }
};

var HEADERS = [
  "ENTRY ID", "SUBMITTED AT", "CAPTAIN FULL NAME", "EMAIL ADDRESS", "PHONE NUMBER",
  "ORGANIZATION / COLLEGE", "YEAR", "DEPARTMENT", "TEAM NAME", "TEAM SIZE",
  "TEAM MEMBERS LIST", "CHAMPIONSHIP TRACK", "EVENT CATEGORY", "12-DIGIT UTR NUMBER",
  "AMOUNT PAYABLE (INR)", "PAYMENT STATUS", "REGISTRATION STATUS", "DRIVER NUMBER",
  "EMAIL STATUS", "DRIVER 2 NAME", "DRIVER 2 PHONE", "DRIVER 3 NAME", "DRIVER 3 PHONE",
  "DRIVER 4 NAME", "DRIVER 4 PHONE"
];

// -------------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------------

function escapeHtml_(value) {
  if (value === null || value === undefined) return "";
  return value
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isValidEmail_(email) {
  // Basic RFC-5322-ish check, good enough to filter obviously malformed input
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function toSafeNumber_(value, fallback) {
  var n = Number(value);
  return isNaN(n) ? fallback : n;
}

function getOrCreateSheet_(ss) {
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME) || ss.getSheets()[0];

  var currentCols = sheet.getMaxColumns();
  if (currentCols < CONFIG.MAX_COLS) {
    sheet.insertColumnsAfter(Math.max(currentCols, 1), CONFIG.MAX_COLS - currentCols);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight("bold")
      .setBackground("#111115")
      .setFontColor("#00D2BE");
  }

  return sheet;
}

function parseRequestBody_(e) {
  var data = {};
  if (e && e.postData && e.postData.contents) {
    var rawStr = e.postData.contents.toString();
    try {
      data = JSON.parse(rawStr);
    } catch (jsonErr) {
      if (e.parameter && Object.keys(e.parameter).length > 0) {
        data = e.parameter;
      } else {
        data = {};
        var pairs = rawStr.split('&');
        for (var p = 0; p < pairs.length; p++) {
          var kv = pairs[p].split('=');
          if (kv.length === 2) {
            data[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1].replace(/\+/g, ' '));
          }
        }
      }
    }
  } else if (e && e.parameter) {
    data = e.parameter;
  }
  return data;
}

/**
 * Admin secret lives in Script Properties, NOT hardcoded in source.
 * Set it once via: Project Settings > Script Properties > ADMIN_SECRET
 * or programmatically: PropertiesService.getScriptProperties().setProperty('ADMIN_SECRET', '...')
 */
function isAuthenticatedAdmin_(data) {
  var configuredSecret = PropertiesService.getScriptProperties().getProperty("ADMIN_SECRET");
  if (!configuredSecret) {
    // No secret configured yet -> admin-only fields are locked down for everyone.
    // This fails closed rather than open.
    return false;
  }
  var providedSecret = (data.adminSecret || data.secret || "").toString();
  return providedSecret !== "" && providedSecret === configuredSecret;
}

function generateUniqueEntryId_(existingIds) {
  var id;
  var attempts = 0;
  do {
    id = "FA26-" + Math.floor(10000 + Math.random() * 90000);
    attempts++;
  } while (existingIds.indexOf(id.toUpperCase()) !== -1 && attempts < 20);
  return id;
}

function buildWhatsappHtml_(hasTechEvent) {
  var html =
    "<div style='background-color: #111115; border: 2px solid #25D366; padding: 16px; border-radius: 12px; margin-top: 15px; text-align: center; font-family: Arial, sans-serif;'>" +
    "<div style='color: #25D366; font-size: 13px; font-weight: bold; margin-bottom: 12px;'>💬 OFFICIAL WHATSAPP GROUP JOIN LINKS</div>";

  if (hasTechEvent) {
    html +=
      "<div style='margin-bottom: 8px;'>" +
      "<a href='" + CONFIG.WHATSAPP.TECH + "' target='_blank' style='display: block; background-color: #00D2BE; color: #000000; padding: 11px 14px; border-radius: 8px; font-size: 12px; font-weight: bold; text-decoration: none; text-transform: uppercase;'>" +
      "💻 JOIN TECHNICAL EVENTS WHATSAPP GROUP →" +
      "</a>" +
      "</div>";
  } else {
    html +=
      "<div style='margin-bottom: 8px;'>" +
      "<a href='" + CONFIG.WHATSAPP.NON_TECH + "' target='_blank' style='display: block; background-color: #F5A623; color: #000000; padding: 11px 14px; border-radius: 8px; font-size: 12px; font-weight: bold; text-decoration: none; text-transform: uppercase;'>" +
      "🎨 JOIN NON-TECHNICAL EVENTS WHATSAPP GROUP →" +
      "</a>" +
      "</div>";
  }

  html +=
    "<div>" +
    "<a href='" + CONFIG.WHATSAPP.COMMUNITY + "' target='_blank' style='display: block; background-color: #25D366; color: #FFFFFF; padding: 12px 14px; border-radius: 8px; font-size: 13px; font-weight: bold; text-decoration: none; text-transform: uppercase;'>" +
    "🌐 JOIN OVERALL FORMULA-AI COMMUNITY GROUP →" +
    "</a>" +
    "</div>" +
    "</div>";

  return html;
}

function buildEmailHtml_(fields) {
  var whatsappHtml = buildWhatsappHtml_(fields.hasTechEvent);

  var subject = fields.status === "APPROVED"
    ? "🎉 [FORMULA-AI 2026] GRID CONFIRMED - Driver E-Pass & QR Code (ID: " + fields.entryId + ")"
    : "🏁 [FORMULA-AI 2026] Thank You For Registering - Entry ID: " + fields.entryId;

  var htmlBody =
    "<div style='font-family: Arial, sans-serif; background-color: #08080A; color: #FFFFFF; padding: 25px; border-radius: 16px; border: 2px solid #00D2BE; max-width: 600px; margin: 0 auto;'>" +
    "<div style='text-align: center; border-bottom: 2px solid #22222a; padding-bottom: 15px; margin-bottom: 20px;'>" +
    "<h1 style='color: #E10600; margin: 0; font-size: 24px; letter-spacing: 2px;'>🏎️ FORMULA-AI 2026 GRAND PRIX</h1>" +
    "<p style='color: #00D2BE; font-size: 13px; font-weight: bold; margin-top: 5px;'>MONZA CIRCUIT RACE CONTROL TELEMETRY</p>" +
    "</div>" +

    "<div style='font-size: 15px; line-height: 1.6; border-bottom: 1px solid #22222a; padding-bottom: 15px; margin-bottom: 15px;'>" +
    "<p style='margin-top: 0;'>Dear <strong>" + escapeHtml_(fields.fullName) + "</strong>,</p>" +
    "<p style='color: #00D2BE; font-size: 16px; font-weight: bold; margin: 10px 0;'>✨ THANK YOU FOR REGISTERING FOR FORMULA-AI 2026! ✨</p>" +
    "<p style='color: #CCCCCC; font-size: 13px; margin: 5px 0;'>We are thrilled to welcome you and your team to the Monza National Circuit Grid! Your registration request has been successfully recorded under Entry ID: <strong style='color: #F5A623;'>" + escapeHtml_(fields.entryId) + "</strong>.</p>" +
    "<p style='color: #8A8A93; font-size: 13px; margin-top: 8px;'>Current Registration Status: <strong style='color: #00D2BE; font-size: 14px;'>" + escapeHtml_(fields.status) + "</strong>.</p>" +
    "</div>" +

    "<div style='background-color: #111115; border: 2px solid #00D2BE; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0;'>" +
    "<div style='color: #8A8A93; font-size: 11px; font-weight: bold; letter-spacing: 1px;'>OFFICIAL DRIVER QR E-PASS</div>" +
    "<div style='font-size: 22px; font-weight: bold; color: #FFFFFF; margin: 5px 0;'>" + escapeHtml_(fields.entryId) + "</div>" +

    "<div style='margin: 15px 0; text-align: center;'>" +
    "<img src='https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=" + encodeURIComponent(fields.entryId) + "' alt='Formula AI Driver QR Code' style='width: 160px; height: 160px; border: 4px solid #FFFFFF; border-radius: 8px;' />" +
    "</div>" +

    "<div style='color: #00D2BE; font-size: 12px; font-weight: bold; margin-bottom: 12px;'>SCAN AT MONZA VENUE TURNSTILE GATE</div>" +

    "<div style='margin-bottom: 15px;'>" +
    "<a href='" + CONFIG.EPASS_BASE_URL + encodeURIComponent(fields.entryId) + "' target='_blank' style='display: inline-block; background-color: #E10600; color: #FFFFFF; padding: 12px 20px; border-radius: 8px; font-size: 13px; font-weight: bold; text-decoration: none; text-transform: uppercase;'>" +
    "🎫 VIEW &amp; DOWNLOAD DIGITAL DRIVER E-PASS →" +
    "</a>" +
    "</div>" +

    whatsappHtml +
    "</div>" +

    "<div style='font-size: 12px; font-weight: bold; color: #E10600; margin-bottom: 8px; font-family: monospace;'>📋 REGISTRATION SUMMARY</div>" +
    "<table style='width: 100%; color: #FFFFFF; font-size: 13px; border-collapse: collapse; margin: 10px 0; font-family: monospace;'>" +
    "<tr><td style='padding: 8px; border-bottom: 1px solid #22222a; color: #8A8A93;'>ENTRY ID:</td><td style='padding: 8px; border-bottom: 1px solid #22222a; color: #00D2BE; font-weight: bold;'>" + escapeHtml_(fields.entryId) + "</td></tr>" +
    "<tr><td style='padding: 8px; border-bottom: 1px solid #22222a; color: #8A8A93;'>TEAM CALLSIGN:</td><td style='padding: 8px; border-bottom: 1px solid #22222a;'>" + escapeHtml_(fields.teamName) + "</td></tr>" +
    "<tr><td style='padding: 8px; border-bottom: 1px solid #22222a; color: #8A8A93;'>REGISTERED MEMBERS:</td><td style='padding: 8px; border-bottom: 1px solid #22222a;'>" + escapeHtml_(fields.teamMembers) + "</td></tr>" +
    "<tr><td style='padding: 8px; border-bottom: 1px solid #22222a; color: #8A8A93;'>CHAMPIONSHIP TRACK:</td><td style='padding: 8px; border-bottom: 1px solid #22222a; color: #F5A623;'>" + escapeHtml_(fields.championship) + "</td></tr>" +
    "<tr><td style='padding: 8px; border-bottom: 1px solid #22222a; color: #8A8A93;'>CATEGORY / EVENT:</td><td style='padding: 8px; border-bottom: 1px solid #22222a;'>" + escapeHtml_(fields.category) + "</td></tr>" +
    "<tr><td style='padding: 8px; border-bottom: 1px solid #22222a; color: #8A8A93;'>12-DIGIT UTR REF:</td><td style='padding: 8px; border-bottom: 1px solid #22222a; color: #F5A623;'>" + escapeHtml_(fields.utrNumber) + "</td></tr>" +
    "<tr><td style='padding: 8px; border-bottom: 1px solid #22222a; color: #8A8A93;'>TOTAL ENTRY DEPOSIT:</td><td style='padding: 8px; border-bottom: 1px solid #22222a; color: #00D2BE; font-weight: bold;'>₹" + escapeHtml_(fields.paymentAmount) + "</td></tr>" +
    "</table>" +

    "<div style='background-color: #111115; border: 1px solid #22222a; padding: 15px; border-radius: 10px; margin-top: 20px; font-size: 12px; text-align: left;'>" +
    "<div style='color: #F5A623; font-weight: bold; margin-bottom: 6px;'>📞 NEED ASSISTANCE? STUDENT COORDINATORS CONTACT:</div>" +
    "<div style='color: #CCCCCC; margin-bottom: 4px;'>⚙️ <strong>Technical Coordinators:</strong> " + CONFIG.COORDINATORS.technical + "</div>" +
    "<div style='color: #CCCCCC;'>🎨 <strong>Non-Technical Coordinators:</strong> " + CONFIG.COORDINATORS.nonTechnical + "</div>" +
    "</div>" +

    "<div style='text-align: center; margin-top: 25px; padding-top: 15px; border-top: 1px solid #22222a;'>" +
    "<p style='font-size: 13px; color: #FFFFFF; font-weight: bold; margin: 0;'>Warm Regards &amp; Best of Luck!</p>" +
    "<p style='font-size: 11px; color: #8A8A93; margin-top: 5px;'>Race Control Team · Formula-AI 2026 National Championship</p>" +
    "</div>" +
    "</div>";

  return { subject: subject, htmlBody: htmlBody };
}

function sendConfirmationEmail_(email, fields) {
  if (!email || !isValidEmail_(email)) {
    return "INVALID_EMAIL";
  }

  var built = buildEmailHtml_(fields);

  try {
    MailApp.sendEmail({ to: email, subject: built.subject, htmlBody: built.htmlBody });
    return "SENT";
  } catch (mailErr) {
    Logger.log("MailApp Error, attempting GmailApp fallback: " + mailErr);
    try {
      GmailApp.sendEmail(email, built.subject, "", { htmlBody: built.htmlBody });
      return "SENT";
    } catch (gmailErr) {
      Logger.log("Email dispatch failed entirely: " + gmailErr);
      return "FAILED";
    }
  }
}

// -------------------------------------------------------------------------
// Entry points
// -------------------------------------------------------------------------

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(CONFIG.SHEET_NAME) || ss.getSheets()[0];
    var lastRow = sheet.getLastRow();

    if (lastRow <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify({ result: "success", data: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var maxCols = Math.max(sheet.getLastColumn(), 1);
    var colCount = Math.min(maxCols, CONFIG.MAX_COLS);
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
      .createTextOutput(JSON.stringify({ result: "success", data: registrations }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  var gotLock = lock.tryLock(10000);

  if (!gotLock) {
    return ContentService
      .createTextOutput(JSON.stringify({
        result: "error",
        error: "Server busy, could not acquire lock. Please retry."
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = getOrCreateSheet_(ss);

    var data = parseRequestBody_(e);
    var isAdmin = isAuthenticatedAdmin_(data);

    var lastRow = sheet.getLastRow();
    var existingData = [];
    if (lastRow > 1) {
      var colCheck = Math.min(sheet.getLastColumn(), CONFIG.MAX_COLS);
      existingData = sheet.getRange(2, 1, lastRow - 1, colCheck).getValues();
    }
    var existingIds = existingData.map(function (r) {
      return r[0] ? r[0].toString().trim().toUpperCase() : "";
    });

    var providedId = (data.id || data.entryId || "").toString().trim();
    var entryId = providedId || generateUniqueEntryId_(existingIds);

    var submittedAt = data.submittedAt || new Date().toISOString();
    var fullName = (data.fullName || "").toString();
    var email = (data.email || "").toString().trim();
    var phone = (data.phone || "").toString();
    var organization = (data.organization || "").toString();
    var year = (data.year || "").toString();
    var department = (data.department || "").toString();
    var teamName = (data.teamName || "").toString();
    var teamSize = toSafeNumber_(data.teamSizeCount, 1);

    var membersList = [fullName];
    if (data.driver2Name) membersList.push(data.driver2Name);
    if (data.driver3Name) membersList.push(data.driver3Name);
    if (data.driver4Name) membersList.push(data.driver4Name);

    var teamMembers = (data.teamMembers && data.teamMembers.length > 0)
      ? (Array.isArray(data.teamMembers) ? data.teamMembers.join(", ") : data.teamMembers.toString())
      : membersList.join(", ");

    var championship = (data.championship || "").toString();
    var category = (data.category || "").toString();
    var utrNumber = (data.utrNumber || "").toString().trim();
    var paymentAmount = toSafeNumber_(data.paymentAmount, 0);

    // Admin-only fields: a non-admin request can never set these, regardless
    // of what was submitted in the payload.
    var paymentStatus = isAdmin ? (data.paymentStatus || "PENDING").toString() : "PENDING";
    var status = isAdmin ? (data.status || "SUBMITTED").toString() : "SUBMITTED";
    var driverNumber = isAdmin ? (data.driverNumber || "").toString() : "";
    var driver2Name = (data.driver2Name || "").toString();
    var driver2Phone = (data.driver2Phone || "").toString();
    var driver3Name = (data.driver3Name || "").toString();
    var driver3Phone = (data.driver3Phone || "").toString();
    var driver4Name = (data.driver4Name || "").toString();
    var driver4Phone = (data.driver4Phone || "").toString();

    // Determine whether this is an update to an existing row
    var existingRowIndex = -1;
    var targetId = entryId.toUpperCase();
    var targetEmail = email.toLowerCase();
    var targetUtr = utrNumber.toUpperCase();

    for (var i = 0; i < existingData.length; i++) {
      var rowId = existingData[i][0] ? existingData[i][0].toString().trim().toUpperCase() : "";
      var rowEmail = existingData[i][3] ? existingData[i][3].toString().trim().toLowerCase() : "";
      var rowUtr = existingData[i][13] ? existingData[i][13].toString().trim().toUpperCase() : "";

      if (rowId === targetId || (targetEmail !== "" && rowEmail === targetEmail && targetUtr !== "" && rowUtr === targetUtr)) {
        existingRowIndex = i + 2;
        break;
      }
    }

    // If this is an update to an existing row and the request is NOT admin-
    // authenticated, carry forward the existing admin-controlled values
    // instead of resetting them to defaults. A team editing their own
    // details (e.g. fixing a phone number) should never be able to knock
    // their registration back from APPROVED to SUBMITTED, and a stranger
    // re-POSTing a known entryId should never be able to touch these either.
    if (existingRowIndex > -1 && !isAdmin) {
      var existingRow = existingData[existingRowIndex - 2];
      paymentStatus = existingRow[15] ? existingRow[15].toString() : paymentStatus;
      status = existingRow[16] ? existingRow[16].toString() : status;
      driverNumber = existingRow[17] ? existingRow[17].toString() : driverNumber;
    }

    // Send email and record the real outcome
    var champUpper = championship.toUpperCase();
    var catUpper = category.toUpperCase();
    var hasTechEvent = champUpper.indexOf("ENGINEERING") !== -1 ||
      catUpper.indexOf("ENGINEERING") !== -1 ||
      catUpper.indexOf("CODING") !== -1 ||
      catUpper.indexOf("CODE") !== -1 ||
      catUpper.indexOf("PROMPT") !== -1 ||
      catUpper.indexOf("HACKATHON") !== -1 ||
      catUpper.indexOf("CONSTRUCTORS") !== -1 ||
      catUpper.indexOf("POLE POSITION") !== -1 ||
      catUpper.indexOf("TELEMETRY") !== -1 ||
      catUpper.indexOf("DEBUGGING") !== -1 ||
      catUpper.indexOf("TYPING") !== -1;

    var emailStatus = sendConfirmationEmail_(email, {
      entryId: entryId,
      fullName: fullName,
      teamName: teamName,
      teamMembers: teamMembers,
      championship: championship,
      category: category,
      utrNumber: utrNumber,
      paymentAmount: paymentAmount,
      status: status,
      hasTechEvent: hasTechEvent
    });

    var rowValues = [
      entryId, submittedAt, fullName, email, phone, organization, year, department,
      teamName, teamSize, teamMembers, championship, category, utrNumber,
      paymentAmount, paymentStatus, status, driverNumber, emailStatus,
      driver2Name, driver2Phone, driver3Name, driver3Phone, driver4Name, driver4Phone
    ];

    if (existingRowIndex > -1) {
      sheet.getRange(existingRowIndex, 1, 1, rowValues.length).setValues([rowValues]);
    } else {
      sheet.appendRow(rowValues);
    }

    return ContentService
      .createTextOutput(JSON.stringify({
        result: "success",
        id: entryId,
        updated: existingRowIndex > -1,
        emailStatus: emailStatus,
        adminAuthenticated: isAdmin
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}