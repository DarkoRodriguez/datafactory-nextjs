"use client"

import React, { useEffect, useState } from 'react'
import { useRef } from 'react'
import { useRouter } from 'next/navigation'

type CartItem = {
  id: number
  nombre: string
  precio: number
  imagen?: string
  qty: number
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    const raw = localStorage.getItem('cart')
    try {
      const parsed = raw ? JSON.parse(raw) : []
      setCart(Array.isArray(parsed) ? parsed : [])
    } catch (e) {
      setCart([])
    }
  }, [])

  useEffect(() => {
    // Listen for external updates to the cart (other components/tabs)
    function onCartUpdated() {
      const raw = localStorage.getItem('cart')
      try {
        const parsed = raw ? JSON.parse(raw) : []
        setCart(Array.isArray(parsed) ? parsed : [])
      } catch (e) {
        setCart([])
      }
    }

    window.addEventListener('cartUpdated', onCartUpdated)
    window.addEventListener('storage', (e: StorageEvent) => {
      if (e.key === 'cart') onCartUpdated()
    })
    return () => {
      window.removeEventListener('cartUpdated', onCartUpdated)
    }
  }, [])

  const mountedRef = useRef(false)

  useEffect(() => {
    // Avoid writing to localStorage on the very first render before we've hydrated
    if (!mountedRef.current) {
      mountedRef.current = true
      return
    }
    try {
      localStorage.setItem('cart', JSON.stringify(cart))
    } catch (e) {
      console.error(e)
    }
  }, [cart])

  function formatCurrency(num: number) {
    return '$' + num.toLocaleString()
  }

  function changeQty(idOrIndex: number, delta: number) {
    setCart((prev) => {
      const copy = [...prev]
      // find by id first, fallback to index
      let idx = copy.findIndex((c) => c.id === idOrIndex)
      if (idx === -1) idx = idOrIndex
      if (!copy[idx]) return prev
      copy[idx] = { ...copy[idx], qty: Math.max(1, (copy[idx].qty || 1) + delta) }
      try {
        localStorage.setItem('cart', JSON.stringify(copy))
      } catch (e) {
        console.error('Error saving cart:', e)
      }
      try { window.dispatchEvent(new Event('cartUpdated')) } catch (e) {}
      return copy
    })
  }

  function removeFromCart(idOrIndex: number) {
    setCart((prev) => {
      const copy = [...prev]
      const idx = copy.findIndex((c) => c.id === idOrIndex)
      const removeIndex = idx >= 0 ? idx : idOrIndex
      if (removeIndex >= 0 && removeIndex < copy.length) {
        copy.splice(removeIndex, 1)
      }
      try {
        localStorage.setItem('cart', JSON.stringify(copy))
      } catch (e) {
        console.error('Error saving cart:', e)
      }
      try { window.dispatchEvent(new Event('cartUpdated')) } catch (e) {}
      return copy
    })
  }

  function checkout() {
    // navigate to checkout page where user will fill the form
    try {
      router.push('/checkout')
    } catch (e) {
      // fallback: do nothing
      console.error('Navigation failed', e)
    }
  }

  const total = cart.reduce((s, it) => s + it.precio * (it.qty || 1), 0)

  const router = useRouter()
  return (
    <section style={{ width: 'auto', maxWidth: 1300, margin: 'auto', padding: 20 }}>
      <h2 className="cart-text"> Carrito de Compra</h2>
      <div className="cart-container">
        <div className="cart-products" id="cart-products">
          {cart.length === 0 ? (
            <h3>Tu carrito está vacío</h3>
          ) : (
            cart.map((item, i) => (
              <div className="cart-item" key={item.id + '-' + i}>
                {item.imagen ? (
                    <img src={item.imagen} alt={item.nombre} style={{ width: 60, height: 60, borderRadius: 5 }} />
                  ) : (
                    <div style={{ width: 60, height: 60, borderRadius: 5, background: '#f0f0f0' }} />
                  )}
                  <div style={{ flex: 1, marginLeft: 12 }}>
                  <h4 style={{ margin: 0 }}>{item.nombre}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                    <button onClick={() => changeQty(item.id, -1)} style={{ borderRadius: 75 }}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => changeQty(item.id, 1)} style={{ borderRadius: 75 }}>+</button>
                    <button onClick={() => removeFromCart(item.id)} style={{ borderRadius: 75, color: 'red' }}>Eliminar</button>
                  </div>
                </div>
                <div className="cart-price">{formatCurrency(item.precio * (item.qty || 1))}</div>
              </div>
            ))
          )}
        </div>

        <div className="cart-summary">
          <h3>Resumen de compra</h3>
          <p>Total: <span id="total">{formatCurrency(total)}</span></p>
          <button className="checkout-btn" onClick={checkout}>Continuar compra</button>
        </div>
      </div>
    </section>
  )
}
