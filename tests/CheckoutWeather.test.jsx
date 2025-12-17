import React from 'react'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import CheckoutWeather from '../app/components/CheckoutWeather'

afterEach(() => { cleanup(); global.fetch && (global.fetch = undefined); })

test('muestra entrega disponible cuando deliveryAvailable es true', async () => {
  global.fetch = jest.fn(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      weatherSummary: 'Despejado',
      precipitationProbability: 0.0,
      deliveryAvailable: true,
      checkedAt: '2025-12-17'
    })
  }))

  render(<CheckoutWeather orderId={123} />)

  expect(screen.getByRole('status')).toBeInTheDocument()

  await waitFor(() => {
    expect(screen.getByText(/Entrega hoy:/)).toBeInTheDocument()
    expect(screen.getByText('Sí')).toBeInTheDocument()
  })
})

test('muestra entrega no disponible y fecha recomendada cuando deliveryAvailable es false', async () => {
  global.fetch = jest.fn(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      weatherSummary: 'Lluvias',
      precipitationProbability: 0.8,
      deliveryAvailable: false,
      checkedAt: '2025-12-17',
      recommendedDate: '2025-12-18'
    })
  }))

  render(<CheckoutWeather orderId={456} />)

  await waitFor(() => {
    expect(screen.getByText(/Entrega hoy:/)).toBeInTheDocument()
    expect(screen.getByText('No')).toBeInTheDocument()
    expect(screen.getByText(/Fecha sugerida/)).toBeInTheDocument()
    expect(screen.getByText('2025-12-18')).toBeInTheDocument()
  })
})
