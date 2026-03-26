import { useCallback, useEffect, useState } from 'react'
import stellarLogo from '@/assets/stellar.png'
import vendimiaLogo from '@/assets/vendimia.png'
import './pitch-page.css'

const TOTAL_SLIDES = 9

export function PitchPage() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')

  const go = useCallback(
    (dir: 'next' | 'prev') => {
      setDirection(dir)
      setCurrent((c) =>
        dir === 'next'
          ? Math.min(c + 1, TOTAL_SLIDES - 1)
          : Math.max(c - 1, 0),
      )
    },
    [],
  )

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        go('next')
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        go('prev')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  return (
    <div className="pitch" data-direction={direction}>
      {/* Sponsor logos bar */}
      <div className="pitch__logos">
        <img src={vendimiaLogo} alt="Vendimia Tech" className="pitch__logo" />
        <span className="pitch__logos-sep">×</span>
        <img src={stellarLogo} alt="Stellar" className="pitch__logo pitch__logo--stellar" />
      </div>

      {/* Progress bar */}
      <div className="pitch__progress">
        <div
          className="pitch__progress-fill"
          style={{ width: `${((current + 1) / TOTAL_SLIDES) * 100}%` }}
        />
      </div>

      {/* Navigation hint */}
      <div className="pitch__nav-hint">
        <span>{current + 1} / {TOTAL_SLIDES}</span>
        <span className="pitch__nav-keys">
          <kbd>&larr;</kbd> <kbd>&rarr;</kbd>
        </span>
      </div>

      {/* ── Slide 0: Title ── */}
      <section className={`pitch__slide ${current === 0 ? 'pitch__slide--active' : ''}`}>
        <div className="pitch__slide-inner pitch__slide-inner--split">
          <div className="pitch__slide-content">
            <span className="pitch__tag">Vendimia Hackathon 2026 · Track Stellar</span>
            <h1 className="pitch__hero-title">
              <span className="pitch__logo-leaf">&#127807;</span>{' '}
              CosechaPay
            </h1>
            <p className="pitch__hero-tagline">
              La cosecha <em>se paga seguro.</em>
            </p>
            <p className="pitch__hero-sub">
              Pagos de cosecha bloqueados on-chain con Stellar
            </p>
          </div>

          {/* Mockup: landing hero */}
          <div className="pitch__mockup">
            <div className="pitch__mockup-chrome">
              <div className="pitch__mockup-dots"><i /><i /><i /></div>
              <div className="pitch__mockup-url">cosechapay.vercel.app</div>
            </div>
            <div className="pitch__mockup-screen">
              <div className="pitch__m-header">
                <span className="pitch__m-logo">&#127807; CosechaPay</span>
                <span className="pitch__m-pill pitch__m-pill--warning">Testnet</span>
              </div>
              <div className="pitch__m-hero">
                <div className="pitch__m-hero-tag">Stellar Testnet</div>
                <div className="pitch__m-hero-title">La cosecha</div>
                <div className="pitch__m-hero-accent">se paga seguro.</div>
                <div className="pitch__m-hero-sub">
                  El empleador bloquea el pago antes de que empiece la cosecha.
                </div>
                <div className="pitch__m-cta">
                  Conectá tu wallet Freighter para comenzar.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Slide 1: Problem ── */}
      <section className={`pitch__slide ${current === 1 ? 'pitch__slide--active' : ''}`}>
        <div className="pitch__slide-inner">
          <span className="pitch__slide-label">El problema</span>
          <h2 className="pitch__slide-title">
            El cosechero no sabe si le van a pagar.
          </h2>
          <div className="pitch__points">
            <div className="pitch__point">
              <span className="pitch__point-icon">&#128172;</span>
              <div>
                <h3>Acuerdos verbales</h3>
                <p>En trabajo rural e informal, el pago prometido es solo una palabra. No hay garantía real.</p>
              </div>
            </div>
            <div className="pitch__point">
              <span className="pitch__point-icon">&#128683;</span>
              <div>
                <h3>Sin visibilidad</h3>
                <p>El cosechero no puede verificar si el dinero existe antes de empezar a trabajar.</p>
              </div>
            </div>
            <div className="pitch__point">
              <span className="pitch__point-icon">&#9888;&#65039;</span>
              <div>
                <h3>Dependencia y desconfianza</h3>
                <p>Sin intermediarios confiables, la relación laboral queda expuesta a incumplimientos.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Slide 2: Solution ── */}
      <section className={`pitch__slide ${current === 2 ? 'pitch__slide--active' : ''}`}>
        <div className="pitch__slide-inner pitch__slide-inner--split">
          <div className="pitch__slide-content">
            <span className="pitch__slide-label">La solución</span>
            <h2 className="pitch__slide-title">
              Bloqueá el pago <em>antes</em> de la cosecha.
            </h2>
            <p className="pitch__slide-desc">
              El empleador inmoviliza los fondos on-chain usando Stellar.
              El cosechero puede verificar que el dinero existe en cualquier momento.
              Cuando termina el trabajo, reclama el pago con su wallet. Sin intermediarios.
            </p>
            <div className="pitch__quote">
              <blockquote>
                "No es una promesa verbal. Es un pago reservado y trazable."
              </blockquote>
            </div>
          </div>

          {/* Mockup: payment locked detail */}
          <div className="pitch__mockup">
            <div className="pitch__mockup-chrome">
              <div className="pitch__mockup-dots"><i /><i /><i /></div>
              <div className="pitch__mockup-url">cosechapay.vercel.app/payments/1</div>
            </div>
            <div className="pitch__mockup-screen">
              <div className="pitch__m-header">
                <span className="pitch__m-logo">&#127807; CosechaPay</span>
                <span className="pitch__m-wallet">G4X...8HK</span>
              </div>
              <div className="pitch__m-body">
                <div className="pitch__m-back">← Mis pagos</div>
                <div className="pitch__m-card">
                  <div className="pitch__m-card-header">
                    <span className="pitch__m-amount">0.5 XLM</span>
                    <span className="pitch__m-badge pitch__m-badge--warning">Bloqueado</span>
                  </div>
                  <div className="pitch__m-field">
                    <span className="pitch__m-field-label">Para</span>
                    <span className="pitch__m-field-mono">GCXW...4FH</span>
                  </div>
                  <div className="pitch__m-field">
                    <span className="pitch__m-field-label">Balance ID</span>
                    <span className="pitch__m-field-mono">00001234abcd...</span>
                  </div>
                  <div className="pitch__m-field">
                    <span className="pitch__m-field-label">Descripción</span>
                    <span className="pitch__m-field-val">Vendimia parcela 7</span>
                  </div>
                  <div className="pitch__m-link">Ver en Stellar Expert ↗</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Slide 3: How it works ── */}
      <section className={`pitch__slide ${current === 3 ? 'pitch__slide--active' : ''}`}>
        <div className="pitch__slide-inner pitch__slide-inner--stacked">
          <div className="pitch__slide-header">
            <span className="pitch__slide-label">Cómo funciona</span>
            <h2 className="pitch__slide-title">Tres pasos. Cero confianza ciega.</h2>
          </div>
          <div className="pitch__slide-inner--split pitch__slide-inner--split-flush">
            <div className="pitch__steps">
              <div className="pitch__step-card">
                <span className="pitch__step-num">01</span>
                <h3>Bloqueá el pago</h3>
                <p>El empleador crea un Claimable Balance en Stellar con el monto y la dirección del cosechero.</p>
              </div>
              <div className="pitch__step-arrow">&#8594;</div>
              <div className="pitch__step-card">
                <span className="pitch__step-num">02</span>
                <h3>Cosechá tranquilo</h3>
                <p>El cosechero ve on-chain que los fondos están bloqueados. El trabajo empieza con garantía real.</p>
              </div>
              <div className="pitch__step-arrow">&#8594;</div>
              <div className="pitch__step-card">
                <span className="pitch__step-num">03</span>
                <h3>Reclamá y listo</h3>
                <p>El cosechero reclama el balance con su wallet. Todo queda visible en el explorer de Stellar.</p>
              </div>
            </div>

          {/* Mockup: 3 screens flow */}
          <div className="pitch__mockup pitch__mockup--flow">
            <div className="pitch__mockup-chrome">
              <div className="pitch__mockup-dots"><i /><i /><i /></div>
              <div className="pitch__mockup-url">cosechapay.vercel.app</div>
            </div>
            <div className="pitch__mockup-screen pitch__mockup-screen--flow">
              {/* Screen 1: Create form */}
              <div className="pitch__m-flow-step">
                <div className="pitch__m-flow-label">Crear pago</div>
                <div className="pitch__m-mini-form">
                  <div className="pitch__m-mini-field">
                    <span>Dirección cosechero</span>
                    <div className="pitch__m-mini-input">GCXW...4FH</div>
                  </div>
                  <div className="pitch__m-mini-field">
                    <span>Monto XLM</span>
                    <div className="pitch__m-mini-input">0.5</div>
                  </div>
                  <div className="pitch__m-mini-btn">Bloquear fondos</div>
                </div>
              </div>

              <div className="pitch__m-flow-arrow">↓</div>

              {/* Screen 2: Locked */}
              <div className="pitch__m-flow-step">
                <div className="pitch__m-flow-label">Fondos bloqueados</div>
                <div className="pitch__m-mini-card">
                  <div className="pitch__m-mini-row">
                    <strong>0.5 XLM</strong>
                    <span className="pitch__m-badge pitch__m-badge--warning">Bloqueado</span>
                  </div>
                  <div className="pitch__m-mini-mono">00001234abcd...</div>
                </div>
              </div>

              <div className="pitch__m-flow-arrow">↓</div>

              {/* Screen 3: Claimed */}
              <div className="pitch__m-flow-step">
                <div className="pitch__m-flow-label">Pago reclamado</div>
                <div className="pitch__m-mini-card">
                  <div className="pitch__m-mini-row">
                    <strong>0.5 XLM</strong>
                    <span className="pitch__m-badge pitch__m-badge--success">Reclamado</span>
                  </div>
                  <div className="pitch__m-link">Ver TX en Explorer ↗</div>
                </div>
              </div>
            </div>
          </div>
          </div>{/* end split */}
        </div>{/* end stacked */}
      </section>

      {/* ── Slide 4: Architecture ── */}
      <section className={`pitch__slide ${current === 4 ? 'pitch__slide--active' : ''}`}>
        <div className="pitch__slide-inner">
          <span className="pitch__slide-label">Arquitectura</span>
          <h2 className="pitch__slide-title">Frontend-only. Blockchain-native.</h2>
          <div className="pitch__arch-grid">
            <div className="pitch__arch-card">
              <h3>React + TypeScript + Vite</h3>
              <p>SPA liviana sin backend. El estado real vive en Stellar.</p>
            </div>
            <div className="pitch__arch-card">
              <h3>Stellar SDK + Horizon</h3>
              <p>Lectura y escritura directa a Stellar Testnet. Sin intermediarios.</p>
            </div>
            <div className="pitch__arch-card">
              <h3>Claimable Balances</h3>
              <p>Escrow nativo de Stellar con predicados temporales y time lock configurable.</p>
            </div>
            <div className="pitch__arch-card">
              <h3>Freighter Wallet</h3>
              <p>Firma real de transacciones. Sin custodia propia ni auth tradicional.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Slide 5: Data flow ── */}
      <section className={`pitch__slide ${current === 5 ? 'pitch__slide--active' : ''}`}>
        <div className="pitch__slide-inner">
          <span className="pitch__slide-label">Flujo de datos</span>
          <h2 className="pitch__slide-title">Del formulario al blockchain.</h2>
          <div className="pitch__flow">
            <div className="pitch__flow-node pitch__flow-node--user">
              <span>Empleador</span>
            </div>
            <div className="pitch__flow-connector" />
            <div className="pitch__flow-node pitch__flow-node--app">
              <span>CosechaPay</span>
            </div>
            <div className="pitch__flow-connector" />
            <div className="pitch__flow-node pitch__flow-node--wallet">
              <span>Freighter</span>
            </div>
            <div className="pitch__flow-connector" />
            <div className="pitch__flow-node pitch__flow-node--chain">
              <span>Stellar Testnet</span>
            </div>
          </div>
          <div className="pitch__flow-labels">
            <span>Crea pago</span>
            <span>Firma TX</span>
            <span>Claimable Balance</span>
          </div>
          <p className="pitch__flow-note">
            El cosechero consulta Horizon, detecta sus balances disponibles y reclama directamente con su wallet.
          </p>
        </div>
      </section>

      {/* ── Slide 6: Demo ── */}
      <section className={`pitch__slide ${current === 6 ? 'pitch__slide--active' : ''}`}>
        <div className="pitch__slide-inner pitch__slide-inner--split">
          <div className="pitch__slide-content">
            <span className="pitch__slide-label">Demo en vivo</span>
            <h2 className="pitch__slide-title">Veámoslo en acción.</h2>
            <div className="pitch__demo-checklist">
              <div className="pitch__demo-item">
                <span className="pitch__demo-check">&#10003;</span>
                <span>Conectar wallet del empleador</span>
              </div>
              <div className="pitch__demo-item">
                <span className="pitch__demo-check">&#10003;</span>
                <span>Crear pago con monto y dirección del cosechero</span>
              </div>
              <div className="pitch__demo-item">
                <span className="pitch__demo-check">&#10003;</span>
                <span>Firmar con Freighter — transacción real en Stellar Testnet</span>
              </div>
              <div className="pitch__demo-item">
                <span className="pitch__demo-check">&#10003;</span>
                <span>Ver el pago bloqueado on-chain</span>
              </div>
              <div className="pitch__demo-item">
                <span className="pitch__demo-check">&#10003;</span>
                <span>Cambiar a wallet del cosechero y reclamar fondos</span>
              </div>
              <div className="pitch__demo-item">
                <span className="pitch__demo-check">&#10003;</span>
                <span>Verificar en Stellar Explorer</span>
              </div>
            </div>
          </div>

          {/* Mockup: dashboard with payments */}
          <div className="pitch__mockup">
            <div className="pitch__mockup-chrome">
              <div className="pitch__mockup-dots"><i /><i /><i /></div>
              <div className="pitch__mockup-url">cosechapay.vercel.app/payments</div>
            </div>
            <div className="pitch__mockup-screen">
              <div className="pitch__m-header">
                <span className="pitch__m-logo">&#127807; CosechaPay</span>
                <span className="pitch__m-wallet">G4X...8HK</span>
              </div>
              <div className="pitch__m-body">
                <div className="pitch__m-section-header">
                  <span className="pitch__m-section-title">Mis pagos activos</span>
                  <span className="pitch__m-new-btn">+ Nuevo</span>
                </div>
                <div className="pitch__m-card pitch__m-card--payment">
                  <div className="pitch__m-card-header">
                    <span className="pitch__m-amount">0.5 XLM</span>
                    <span className="pitch__m-badge pitch__m-badge--warning">Bloqueado</span>
                  </div>
                  <div className="pitch__m-field-val" style={{ fontSize: '10px', marginTop: '4px' }}>Vendimia parcela 7</div>
                  <div className="pitch__m-field-mono">GCXW...4FH</div>
                </div>
                <div className="pitch__m-card pitch__m-card--payment">
                  <div className="pitch__m-card-header">
                    <span className="pitch__m-amount">0.2 XLM</span>
                    <span className="pitch__m-badge pitch__m-badge--success">Reclamado</span>
                  </div>
                  <div className="pitch__m-field-val" style={{ fontSize: '10px', marginTop: '4px' }}>Cosecha marzo 2025</div>
                  <div className="pitch__m-field-mono">GBZP...7KL</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Slide 7: Why Stellar ── */}
      <section className={`pitch__slide ${current === 7 ? 'pitch__slide--active' : ''}`}>
        <div className="pitch__slide-inner">
          <span className="pitch__slide-label">Por qué Stellar</span>
          <h2 className="pitch__slide-title">Blockchain para confianza, no decoración.</h2>
          <div className="pitch__reasons">
            <div className="pitch__reason">
              <h3>Claimable Balances nativos</h3>
              <p>Escrow sin smart contracts custom. Predicados temporales built-in.</p>
            </div>
            <div className="pitch__reason">
              <h3>Fees de fracción de centavo</h3>
              <p>Viable para micropagos rurales. No necesitás capital para operar.</p>
            </div>
            <div className="pitch__reason">
              <h3>Horizon API</h3>
              <p>Lectura directa del estado on-chain sin indexer propio.</p>
            </div>
            <div className="pitch__reason">
              <h3>Testnet con faucet</h3>
              <p>XLM gratis para prototipar. Cero fricción para la demo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Slide 8: Closing ── */}
      <section className={`pitch__slide ${current === 8 ? 'pitch__slide--active' : ''}`}>
        <div className="pitch__slide-inner pitch__slide--closing">
          <h2 className="pitch__closing-title">
            El dinero está ahí.<br />
            Verificable.<br />
            <em>On-chain.</em>
          </h2>
          <div className="pitch__closing-brand">
            <span className="pitch__logo-leaf">&#127807;</span> CosechaPay
          </div>
          <p className="pitch__closing-sub">
            Pagos de cosecha bloqueados on-chain con Stellar
          </p>
        </div>
      </section>

      {/* Touch / click nav zones */}
      <button
        className="pitch__nav-zone pitch__nav-zone--prev"
        onClick={() => go('prev')}
        aria-label="Anterior"
        disabled={current === 0}
      />
      <button
        className="pitch__nav-zone pitch__nav-zone--next"
        onClick={() => go('next')}
        aria-label="Siguiente"
        disabled={current === TOTAL_SLIDES - 1}
      />
    </div>
  )
}
