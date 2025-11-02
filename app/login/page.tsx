"use client"

import React from 'react'
import Link from 'next/link'

export default function LoginPage() {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    alert('Simulación: iniciar sesión (no funcional en este demo)')
  }

  return (
    <main style={{ maxWidth: 720, margin: '40px auto', padding: 20 }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label>
          Email
          <input type="email" required style={{ width: '100%', padding: 8 }} />
        </label>
        <label>
          Contraseña
          <input type="password" required style={{ width: '100%', padding: 8 }} />
        </label>
        <button type="submit" style={{ padding: '8px 12px', borderRadius: 6 }}>Iniciar sesión</button>
      </form>
      <p style={{ marginTop: 12 }}>¿No tienes cuenta? <Link href="/register">Regístrate</Link></p>
    </main>
  )
}
