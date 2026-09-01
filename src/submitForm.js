import { FORM_ENDPOINT } from './config'

/**
 * POST JSON to Google Apps Script.
 * GAS runs doPost, then 302 → echo URL with the JSON result (CORS allowed).
 */
export async function submitForm(fields) {
  if (!FORM_ENDPOINT) {
    throw new Error('Falta configurar VITE_RSVP_ENDPOINT en el archivo .env')
  }

  const response = await fetch(FORM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(fields),
  })

  const text = await response.text()
  let data
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error(
      'Google no devolvió una respuesta válida. Revisá el deploy (acceso: Cualquier persona) y redeployá Code.gs.'
    )
  }

  if (!data.ok) {
    throw new Error(data.error || 'No se pudo guardar en la hoja.')
  }

  return data
}
