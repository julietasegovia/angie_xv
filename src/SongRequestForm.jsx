import { useState } from 'react'
import { FORM_ENDPOINT } from './config'
import { submitForm } from './submitForm'

const emptySong = {
  song: '',
  artist: '',
}

function SongRequestForm() {
  const [form, setForm] = useState(emptySong)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.song.trim() || !form.artist.trim()) {
      setError('Completá canción y artista.')
      return
    }

    if (!FORM_ENDPOINT) {
      setError('Falta configurar el destino (VITE_RSVP_ENDPOINT).')
      return
    }

    setStatus('submitting')
    setError('')

    try {
      await submitForm({
        type: 'song',
        song: form.song.trim(),
        artist: form.artist.trim(),
      })

      setStatus('success')
      setForm(emptySong)
    } catch (err) {
      setStatus('idle')
      setError(err instanceof Error ? err.message : 'Hubo un problema al enviar. Intentá de nuevo.')
    }
  }

  if (status === 'success') {
    return (
      <section className="bg-white w-screen max-w-full overflow-x-hidden flex items-center justify-center flex-col px-6 py-14">
        <div className="w-full max-w-sm flex flex-col items-center text-center">
          <h1 className="mb-3 text-3xl text-[#4d0000] font-['XV']">
            ¡LISTO!
          </h1>
          <p className="text-[#4d0000]/80 font-['xvv'] text-lg leading-relaxed">
            Sumamos tu tema a la lista. ¡Gracias!
          </p>
          <button
            type="button"
            onClick={() => setStatus('idle')}
            className="mt-8 w-full py-3 rounded-md border-2 border-[#4d0000] text-[#4d0000] font-['xvv'] font-semibold tracking-wide active:scale-[0.98] transition-transform"
          >
            Pedir otra canción
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white w-screen max-w-full overflow-x-hidden flex items-center justify-center flex-col px-6 py-14">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col items-center"
        noValidate
      >
        <h1 className="mb-2 text-3xl text-[#4d0000] font-['XV'] text-center">
          ¿QUÉ PONEMOS?
        </h1>
        <p className="mb-8 text-[#4d0000]/70 font-['xvv'] text-center text-base">
          Pedí una canción para la fiesta
        </p>

        <div className="w-full flex flex-col gap-4 mb-6">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold uppercase tracking-wide text-[#4d0000] font-['xvv']">
              Canción
            </span>
            <input
              type="text"
              name="song"
              value={form.song}
              onChange={(e) => updateField('song', e.target.value)}
              className="w-full rounded-md border-2 border-[#4d0000]/25 bg-transparent px-3 py-3 text-[#4d0000] font-['xvv'] outline-none focus:border-[#4d0000] transition-colors"
              required
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold uppercase tracking-wide text-[#4d0000] font-['xvv']">
              Artista
            </span>
            <input
              type="text"
              name="artist"
              value={form.artist}
              onChange={(e) => updateField('artist', e.target.value)}
              className="w-full rounded-md border-2 border-[#4d0000]/25 bg-transparent px-3 py-3 text-[#4d0000] font-['xvv'] outline-none focus:border-[#4d0000] transition-colors"
              required
            />
          </label>
        </div>

        {error && (
          <p className="mb-4 w-full text-center text-sm text-red-800 font-['xvv']" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full py-3.5 rounded-md bg-[#4d0000] text-white font-['xvv'] font-semibold tracking-wide disabled:opacity-60 active:scale-[0.98] transition-transform"
        >
          {status === 'submitting' ? 'Enviando…' : 'Enviar canción'}
        </button>
      </form>
    </section>
  )
}

export default SongRequestForm
