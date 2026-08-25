import { useState, useEffect } from 'react'
import RsvpForm from './RsvpForm'
import SongRequestForm from './SongRequestForm'

function App() {
  // 1. Define the target date (October 23rd, 2026)
  const targetDate = new Date('October 23, 2026 00:00:00').getTime();

  // 2. Separate states for each time segment
  const [days, setDays] = useState('00');
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        return;
      }

      // Time calculations
      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      // Helper function to pad numbers
      const formatNumber = (num) => String(num).padStart(2, '0');

      // Update separate states
      setDays(formatNumber(d));
      setHours(formatNumber(h));
      setMinutes(formatNumber(m));
      setSeconds(formatNumber(s));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <>
      {/* SECTION 1: Welcome & Countdown */}
      {/* Added relative so absolute elements align inside this section container */}
      <section className="relative bg-[url('./assets/imgs/angie.jpeg')] bg-cover bg-center h-screen w-screen max-w-full overflow-x-hidden flex items-center justify-center flex-col">
        
        {/* Header Texts */}
        {/* Changed 'fixed' to 'absolute' and changed top margins so it scrolls away naturally */}
        <div className="absolute top-[11%] flex items-center justify-center flex-col">
          <h1 className="text-6xl font-bold text-red-900">
            MIS XV
          </h1>
          <h2 className="mt-[-20px] text-7xl text-black font-['Angie']">
            Angelina
          </h2>
        </div>

        {/* Separate Segment Countdown Box */}
        {/* Changed absolute positioning here too to keep it perfectly separated from the header */}
        <div className="absolute bottom-[20%] flex items-center justify-center gap-2 bg-[#4d0000] bg-opacity-10 rounded-lg p-4 shadow-lg">
          
          {/* Days Block */}
          <div className="flex flex-col items-center w-[65px]">
            <h2 className="text-6xl text-red-900 font-['XV'] tabular-nums text-center">{days}</h2>
            <span className="text-[12px] font-semibold uppercase tracking-wide text-red-800 mt-1 text-center">{days === '01' ? 'Día' : 'Días'}</span>
          </div>

          {/* Separator Colon */}
          <span className="text-4xl text-red-900 font-bold self-start mt-2 px-0.5">:</span>

          {/* Hours Block */}
          <div className="flex flex-col items-center w-[65px]">
            <h2 className="text-6xl text-red-900 font-['XV'] tabular-nums text-center">{hours}</h2>
            <span className="text-[12px] font-semibold uppercase tracking-wide text-red-800 mt-1 text-center">Horas</span>
          </div>

          {/* Separator Colon */}
          <span className="text-4xl text-red-900 font-bold self-start mt-2 px-0.5">:</span>

          {/* Minutes Block */}
          <div className="flex flex-col items-center w-[65px]">
            <h2 className="text-6xl text-red-900 font-['XV'] tabular-nums text-center">{minutes}</h2>
            <span className="text-[12px] font-semibold uppercase tracking-wide text-red-800 mt-1 text-center">Minutos</span>
          </div>

          {/* Separator Colon */}
          <span className="text-4xl text-red-900 font-bold self-start mt-2 px-0.5">:</span>

          {/* Seconds Block */}
          <div className="flex flex-col items-center w-[65px]">
            <h2 className="text-6xl text-red-900 font-['XV'] tabular-nums text-center">{seconds}</h2>
            <span className="text-[12px] font-semibold uppercase tracking-wide text-red-800 mt-1 text-center">Segundos</span>
          </div>

        </div>
      </section>

      <section className="bg-[#4d0000] h-[35vh] w-screen max-w-full overflow-x-hidden flex items-center justify-center flex-col">
        <div className="flex items-center justify-center flex-col">
          <h1 className="mb-2 text-3xl text-white font-['XV'] text-center">
            ¿CUANDO?
          </h1>
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-white mt-2">
            <path d="M21 10H3M16 2V6M8 2V6M7.8 22H16.2C17.8802 22 18.7202 22 19.362 21.673C19.9265 21.3854 20.3854 20.9265 20.673 20.362C21 19.7202 21 18.8802 21 17.2V8.8C21 7.11984 21 6.27976 20.673 5.63803C20.3854 5.07354 19.9265 4.6146 19.362 4.32698C18.7202 4 17.8802 4 16.2 4H7.8C6.11984 4 5.27976 4 4.63803 4.32698C4.07354 4.6146 3.6146 5.07354 3.32698 5.63803C3 6.27976 3 7.11984 3 8.8V17.2C3 18.8802 3 19.7202 3.32698 20.362C3.6146 20.9265 4.07354 21.3854 4.63803 21.673C5.27976 22 6.11984 22 7.8 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h2 className="mt-4 text-2xl text-white font-['xvv'] text-center">
            OCTUBRE 23, 2026
          </h2>
          <h2 className="text-2xl text-white font-['xvv'] text-center">
            |21:00 hs|
          </h2>
        </div>
      </section>

      <section className="bg-white h-[35vh] w-screen max-w-full overflow-x-hidden flex items-center justify-center flex-col">
        <div className="flex items-center justify-center flex-col">
          <h1 className="mb-2 text-3xl text-[#4d0000] font-['XV'] text-center">
            ¿DONDE?
          </h1>
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-[#4d0000] mt-2">
            <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 22C16 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.4183 8 18 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h2 className="mt-4 text-2xl text-[#4d0000] font-['xvv'] text-center">
            X+ EVENTOS
          </h2>
          <h2 className="text-2xl text-[#4d0000] font-['xvv'] text-center">
            |27 de Febrero 1228|
          </h2>
        </div>
      </section>

      <section className="bg-[url('assets/imgs/rojoyencaje.jpg')] h-48 bg-cover bg-center w-screen max-w-full overflow-x-hidden flex items-center justify-center flex-col">
        <div className="flex items-center justify-center flex-col">
            <h3 className="text-6xl font-bold text-red-900 text-white">
              MIS XV
            </h3>
            <h4 className="mt-[-20px] text-7xl text-white font-['Angie']">
              Angelina
            </h4>
          </div>
      </section>
      
      <RsvpForm />
    
      <section className="bg-[url('./assets/imgs/inter.jpeg')] bg-cover h-[35vh] w-screen max-w-full overflow-x-hidden flex items-center justify-center flex-col border-8 border-white">
        
      </section>

      <SongRequestForm />
    
    </>
  )
}

export default App