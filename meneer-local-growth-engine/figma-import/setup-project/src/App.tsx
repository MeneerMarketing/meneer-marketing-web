import { useState, useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import BehandelingenPage from './pages/BehandelingenPage'
import HuidproblemenPage from './pages/HuidproblemenPage'
import TarievenPage from './pages/TarievenPage'
import InformatiePage from './pages/InformatiePage'
import OverOnsPage from './pages/OverOnsPage'

export type Page = 'home' | 'behandelingen' | 'huidproblemen' | 'tarieven' | 'informatie' | 'over-ons'

export default function App() {
  const [page, setPage] = useState<Page>('home')

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page])

  return (
    <div className="min-h-screen bg-warm-white font-sans">
      <Header page={page} setPage={setPage} />
      <main>
        {page === 'home' && <HomePage setPage={setPage} />}
        {page !== 'home' && <div className="h-[92px]" />}
        {page === 'behandelingen' && <BehandelingenPage setPage={setPage} />}
        {page === 'huidproblemen' && <HuidproblemenPage setPage={setPage} />}
        {page === 'tarieven' && <TarievenPage setPage={setPage} />}
        {page === 'informatie' && <InformatiePage setPage={setPage} />}
        {page === 'over-ons' && <OverOnsPage setPage={setPage} />}
      </main>
      <Footer setPage={setPage} />
    </div>
  )
}
