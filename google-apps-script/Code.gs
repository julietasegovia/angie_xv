/**
 * Backend for Angie XV — Google Apps Script
 *
 * MUST be created from the Sheet you want to write to:
 *   Sheet → Extensiones → Apps Script → paste this file
 *
 * If the script is standalone, paste the Sheet ID below
 * (from https://docs.google.com/spreadsheets/d/SHEET_ID/edit).
 *
 * Deploy:
 *   1. Run doGet once → approve permissions
 *   2. Implementar → Nueva implementación → Aplicación web
 *      - Ejecutar como: Yo
 *      - Quién tiene acceso: Cualquier persona
 *   3. Copy /exec URL → .env as VITE_RSVP_ENDPOINT
 *   4. After edits: Administrar implementaciones → lápiz → Nueva versión
 *
 * Tabs:
 *   RSVPs     → timestamp | attending | firstName | lastName | dni | dietary
 *   Canciones → timestamp | song | artist
 */

// Fill this if Extensiones → Apps Script was NOT opened from the target Sheet.
const SHEET_ID = ''

function doGet() {
  try {
    const ss = getSpreadsheet_()
    return json_({
      ok: true,
      message: 'Angie XV form backend is live',
      spreadsheet: ss.getName(),
      spreadsheetId: ss.getId(),
      url: ss.getUrl(),
    })
  } catch (err) {
    return json_({ ok: false, error: String(err) })
  }
}

function doPost(e) {
  try {
    const data = readData_(e)
    const type = data.type || 'rsvp'
    const ss = getSpreadsheet_()

    if (type === 'song') {
      const sheet = getOrCreateSheet_(ss, 'Canciones', ['timestamp', 'song', 'artist'])
      sheet.appendRow([
        new Date().toISOString(),
        data.song || '',
        data.artist || '',
      ])
      return json_({
        ok: true,
        tab: 'Canciones',
        row: sheet.getLastRow(),
        spreadsheet: ss.getName(),
      })
    }

    const sheet = getOrCreateSheet_(ss, 'RSVPs', [
      'timestamp',
      'attending',
      'firstName',
      'lastName',
      'dni',
      'dietary',
    ])
    const attending =
      data.attending === true ||
      data.attending === 'true' ||
      data.attending === 'Sí' ||
      data.attending === 'si'

    sheet.appendRow([
      new Date().toISOString(),
      attending ? 'Sí' : 'No',
      data.firstName || '',
      data.lastName || '',
      data.dni || '',
      data.dietary || '',
    ])

    return json_({
      ok: true,
      tab: 'RSVPs',
      row: sheet.getLastRow(),
      spreadsheet: ss.getName(),
    })
  } catch (err) {
    return json_({ ok: false, error: String(err) })
  }
}

function readData_(e) {
  if (e && e.postData && e.postData.contents) {
    const raw = e.postData.contents
    try {
      return JSON.parse(raw)
    } catch (err) {
      // URL-encoded fallback
      if (e.parameter && Object.keys(e.parameter).length > 0) {
        return e.parameter
      }
      throw err
    }
  }

  if (e && e.parameter && Object.keys(e.parameter).length > 0) {
    return e.parameter
  }

  throw new Error('No data received')
}

function getSpreadsheet_() {
  const active = SpreadsheetApp.getActiveSpreadsheet()
  if (active) return active

  if (SHEET_ID) {
    return SpreadsheetApp.openById(SHEET_ID)
  }

  throw new Error(
    'No spreadsheet bound. Open Apps Script from the Sheet (Extensiones), or set SHEET_ID in Code.gs'
  )
}

function getOrCreateSheet_(ss, name, headers) {
  let sheet = ss.getSheetByName(name)

  if (!sheet) {
    sheet = ss.insertSheet(name)
    sheet.appendRow(headers)
  }

  return sheet
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON)
}
