import { useState, useEffect, useRef } from 'react'
import { FORM_ENDPOINT } from './config'
import { submitForm } from './submitForm'

const DIETARY_OPTIONS = [
  { value: 'ninguna', label: 'Ninguna' },
  { value: 'vegetariano', label: 'Vegetariano' },
  { value: 'vegano', label: 'Vegano' },
  { value: 'celiaco', label: 'Celíaco' },
  { value: 'diabetico', label: 'Diabético' },
]

const emptyGuest = {
  firstName: '',
  lastName: '',
  dni: '',
  dietary: 'ninguna',
}

const DNI_PATTERN = /^\d{8}$/

function RsvpForm() {
  const [attending, setAttending] = useState(null)
  const [guest, setGuest] = useState(emptyGuest)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [dietOpen, setDietOpen] = useState(false)
  const dietRef = useRef(null)

  const updateGuest = (field, value) => {
    setGuest((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setAttending(null)
    setGuest(emptyGuest)
    setError('')
    setDietOpen(false)
  }

  useEffect(() => {
    if (!dietOpen) return

    const handlePointerDown = (event) => {
      if (dietRef.current && !dietRef.current.contains(event.target)) {
        setDietOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [dietOpen])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (attending === null) {
      setError('Elegí si vas a venir o no.')
      return
    }

    if (attending) {
      if (!guest.firstName.trim() || !guest.lastName.trim()) {
        setError('Completá nombre y apellido.')
        return
      }
      if (!DNI_PATTERN.test(guest.dni)) {
        setError('El DNI debe tener exactamente 8 números.')
        return
      }
    }

    if (!FORM_ENDPOINT) {
      setError('Falta configurar el destino de las confirmaciones (VITE_RSVP_ENDPOINT).')
      return
    }

    setStatus('submitting')
    setError('')

    const payload = attending
      ? {
          type: 'rsvp',
          attending: true,
          firstName: guest.firstName.trim(),
          lastName: guest.lastName.trim(),
          dni: guest.dni,
          dietary: guest.dietary,
        }
      : {
          type: 'rsvp',
          attending: false,
          firstName: '',
          lastName: '',
          dni: '',
          dietary: '',
        }

    try {
      await submitForm(payload)
      setStatus('success')
      resetForm()
    } catch (err) {
      setStatus('idle')
      setError(err instanceof Error ? err.message : 'Hubo un problema al enviar. Intentá de nuevo.')
    }
  }

  if (status === 'success') {
    return (
      <section className="bg-[#4d0000] w-screen max-w-full overflow-x-hidden flex items-center justify-center flex-col px-6 py-14">
        <div className="w-full max-w-sm flex flex-col items-center text-center">
          <h1 className="mb-3 text-3xl text-white font-['XV']">
            ¡LISTO!
          </h1>
          <p className="text-white/80 font-['xvv'] text-lg leading-relaxed">
            Recibimos tu confirmación. ¡Gracias!
          </p>
          <button
            type="button"
            onClick={() => setStatus('idle')}
            className="mt-8 w-full py-3 rounded-md border-2 border-white text-white font-['xvv'] font-semibold tracking-wide active:scale-[0.98] transition-transform"
          >
            Enviar otra respuesta
          </button>
        </div>
      </section>
    )
  }

  const choiceBase =
    "py-3 rounded-md font-['xvv'] font-semibold tracking-wide transition-colors active:scale-[0.98]"
  const choiceActive = 'bg-white text-[#4d0000]'
  const choiceIdle = 'bg-white/15 text-white'

  return (
    <section className="bg-[#4d0000] w-screen max-w-full overflow-x-hidden flex items-center justify-center flex-col px-6 py-14">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col items-center"
        noValidate
      >
        <h1 className="mb-2 text-3xl text-white font-['XV'] text-center">
          ¿VENÍS?
        </h1>
        <p className="mb-8 text-white/70 font-['XV'] text-10 text-center text-base">
          CONFIRMA TU ASISTENCIA
        </p>

        <div className="w-full grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => {
              setAttending(true)
              setError('')
            }}
            className={`${choiceBase} ${attending === true ? choiceActive : choiceIdle}`}
            aria-pressed={attending === true}
          >
            Sí, voy
          </button>
          <button
            type="button"
            onClick={() => {
              setAttending(false)
              setGuest(emptyGuest)
              setDietOpen(false)
              setError('')
            }}
            className={`${choiceBase} ${attending === false ? choiceActive : choiceIdle}`}
            aria-pressed={attending === false}
          >
            No puedo
          </button>
        </div>

        {attending === true && (
          <div className="w-full flex flex-col gap-4 mb-6 animate-[fadeIn_0.35s_ease-out]">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold uppercase tracking-wide text-white font-['xvv']">
                Nombre
              </span>
              <input
                type="text"
                name="firstName"
                autoComplete="given-name"
                value={guest.firstName}
                onChange={(e) => updateGuest('firstName', e.target.value)}
                className="w-full rounded-md border-2 border-white/30 bg-transparent px-3 py-3 text-white placeholder:text-white/40 font-['xvv'] outline-none focus:border-white transition-colors"
                required
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold uppercase tracking-wide text-white font-['xvv']">
                Apellido
              </span>
              <input
                type="text"
                name="lastName"
                autoComplete="family-name"
                value={guest.lastName}
                onChange={(e) => updateGuest('lastName', e.target.value)}
                className="w-full rounded-md border-2 border-white/30 bg-transparent px-3 py-3 text-white placeholder:text-white/40 font-['xvv'] outline-none focus:border-white transition-colors"
                required
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold uppercase tracking-wide text-white font-['xvv']">
                DNI
              </span>
              <input
                type="text"
                name="dni"
                inputMode="numeric"
                pattern="\d{8}"
                maxLength={8}
                autoComplete="off"
                value={guest.dni}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 8)
                  updateGuest('dni', digits)
                }}
                className="w-full rounded-md border-2 border-white/30 bg-transparent px-3 py-3 text-white placeholder:text-white/40 font-['xvv'] outline-none focus:border-white transition-colors tabular-nums"
                required
              />
            </label>

            <div className="flex flex-col gap-1.5" ref={dietRef}>
              <span className="text-sm font-semibold uppercase tracking-wide text-white font-['xvv']">
                Restricción alimenticia
              </span>
              <button
                type="button"
                onClick={() => setDietOpen((open) => !open)}
                aria-haspopup="listbox"
                aria-expanded={dietOpen}
                className={`w-full rounded-md border-2 bg-transparent px-3 py-3 text-left text-white font-['xvv'] outline-none transition-colors flex items-center justify-between gap-2 ${
                  dietOpen ? 'border-white' : 'border-white/30'
                }`}
              >
                <span>
                  {DIETARY_OPTIONS.find((option) => option.value === guest.dietary)?.label}
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className={`shrink-0 transition-transform ${dietOpen ? 'rotate-180' : ''}`}
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {dietOpen && (
                <ul
                  role="listbox"
                  aria-label="Restricción alimenticia"
                  className="w-full rounded-md border-2 border-white/30 bg-[#4d0000] overflow-hidden animate-[fadeIn_0.2s_ease-out]"
                >
                  {DIETARY_OPTIONS.map((option) => {
                    const selected = guest.dietary === option.value
                    return (
                      <li key={option.value} role="option" aria-selected={selected}>
                        <button
                          type="button"
                          onClick={() => {
                            updateGuest('dietary', option.value)
                            setDietOpen(false)
                          }}
                          className={`w-full px-3 py-3 text-left font-['xvv'] transition-colors ${
                            selected
                              ? 'bg-white text-[#4d0000]'
                              : 'text-white hover:bg-white/10'
                          }`}
                        >
                          {option.label}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
        )}

        {attending === false && (
          <p className="mb-6 text-center text-white/70 font-['xvv'] text-base leading-relaxed">
            Lamentamos que no puedas venir. Podés enviar la confirmación igual.
          </p>
        )}

        {error && (
          <p className="mb-4 w-full text-center text-sm text-white font-['xvv']" role="alert">
            {error}
          </p>
        )}

        {attending !== null && (
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full py-3.5 rounded-md bg-white text-[#4d0000] font-['xvv'] font-semibold tracking-wide disabled:opacity-60 active:scale-[0.98] transition-transform"
          >
            {status === 'submitting' ? 'Enviando…' : 'Confirmar'}
          </button>
        )}
      </form>
    </section>
  )
}

export default RsvpForm
