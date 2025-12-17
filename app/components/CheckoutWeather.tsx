"use client"

import React, { useEffect, useState } from 'react'

type Props = { orderId: string | number }

type WeatherData = {
  weatherSummary: string
  precipitationProbability: number | null
  deliveryAvailable: boolean
  checkedAt?: string
  recommendedDate?: string
}

export default function CheckoutWeather({ orderId }: Props) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<WeatherData | null>(null)

  useEffect(() => {
    let mounted = true
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    setData(null)

    ;(async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL || ''
        const res = await fetch(`${base}/api/orders/${orderId}/weather`, { signal: controller.signal })
        if (!res.ok) throw new Error('fetch failed')
        const json = await res.json()
        if (!mounted) return
        setData(json as WeatherData)
      } catch (err) {
        if (!mounted) return
        setError('No se pudo verificar el clima — intentelo más tarde')
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    })()

    return () => { mounted = false; controller.abort(); }
  }, [orderId])

  if (loading) return <div role="status" aria-live="polite">Comprobando clima...</div>
  if (error) return <div role="alert">{error}</div>
  if (!data) return null

  const mapSymbol = (s: string) => {
    if (!s) return s
    if (s.startsWith('Symbol:')) {
      let v = s.replace(/^Symbol:\s*/i, '').trim()
      // Normalize common formats like '1', '01d', '01'
      if (/^\d+$/.test(v)) {
        // numeric codes like '1' -> map to known keys
        const numMap: Record<string,string> = {
          '1': 'Cielo despejado',
          '2': 'Pocas nubes',
          '9': 'Lluvias ligeras'
        }
        return numMap[v] || v
      }
      // Map some common symbols to readable text
      const map: Record<string,string> = {
        '01d': 'Cielo despejado',
        '02d': 'Pocas nubes',
        '09d': 'Lluvias ligeras',
        '01': 'Cielo despejado',
        '02': 'Pocas nubes',
        '09': 'Lluvias ligeras'
      }
      return map[v] || v
    }
    return s
  }

  const percent = data.precipitationProbability == null ? '—' : `${Math.round(data.precipitationProbability * 100)}%`

  return (
    <section aria-live="polite" className="checkout-weather-card" style={{ background: '#fff', padding: 12, borderRadius: 8, marginTop: 12, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
      <h3 style={{ marginTop: 0 }}>Clima hoy</h3>
      <p style={{ margin: '6px 0' }}>{mapSymbol(data.weatherSummary)}</p>
      <p style={{ margin: '6px 0' }}>Precipitación: {percent}</p>
      <p style={{ margin: '6px 0' }}>
        Entrega hoy: <strong style={{ color: data.deliveryAvailable ? 'green' : 'red' }}>{data.deliveryAvailable ? 'Sí' : 'No'}</strong>
      </p>
      {data.checkedAt && <small style={{ display: 'block', color: '#666' }}>Verificado: {data.checkedAt}</small>}
      {!data.deliveryAvailable && data.recommendedDate && (
        <div style={{ marginTop: 8 }}>
          <p style={{ margin: '6px 0' }}>No recomendamos entrega hoy. Fecha sugerida: {data.recommendedDate}</p>
          <button onClick={() => window.alert('Abrir flujo de reprogramación')} style={{ background: '#1976d2', color: '#fff', padding: '8px 12px', borderRadius: 6, border: 'none' }}>Reprogramar entrega</button>
        </div>
      )}
    </section>
  )
}
