"use client"

import React, { useEffect, useState } from 'react'
import { useRef } from 'react'
import { fetchJSON, getSessionId } from '../lib/api'
import { useRouter } from 'next/navigation'

type CartItem = {
  id: number
  productoId?: number
  nombre: string
  precio: number
  imagen?: string
  qty: number
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    async function loadCart() {
      try {
        const usuario = JSON.parse(localStorage.getItem('usuarioLogueado') || 'null');
        let items: any[] = [];
        try {
          const all = await fetchJSON('/carrito_item');
          if (usuario && usuario.id) {
            const uid = usuario.id || Number(localStorage.getItem('usuarioId'));
            // backend may return usuario_id or nested usuario object
            items = all.filter((it: any) => (it.usuario_id && it.usuario_id === uid) || (it.usuario && it.usuario.id === uid));
          } else {
            const sid = getSessionId();
            // backend may use sessionId or session_id
            items = all.filter((it: any) => it.sessionId === sid || it.session_id === sid);
          }
        } catch (e) {
          // fallback to localStorage
          const raw = localStorage.getItem('cart')
          const parsed = raw ? JSON.parse(raw) : []
          items = Array.isArray(parsed) ? parsed : []
        }
        setCart(items.map((it: any) => ({
          id: it.id,
          productoId: it.producto?.id || it.producto_id || it.productoId || null,
          nombre: it.nombre || it.producto?.nombre,
          imagen: it.imagen || it.producto?.imagen,
          precio: it.precio || it.producto?.precio,
          qty: it.cantidad || it.qty
        })));
      } catch (e) {
        setCart([])
      }
    }
    loadCart();
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
      const copy: any[] = [...prev]
      // find by id first, fallback to index
      let idx = copy.findIndex((c) => c.id === idOrIndex)
      if (idx === -1) idx = idOrIndex
      if (!copy[idx]) return prev
      const newQty = Math.max(1, (copy[idx].qty || 1) + delta)
      copy[idx] = { ...copy[idx], qty: newQty }
      // sync to server if possible
      (async () => {
        try {
          await fetchJSON(`/carrito_item/${copy[idx].id}`, { method: 'PUT', body: JSON.stringify({ cantidad: newQty }) });
        } catch (e) {
          console.warn('No se pudo actualizar carrito en servidor', e);
          try { localStorage.setItem('cart', JSON.stringify(copy)) } catch(e){}
        }
      })();
      try { window.dispatchEvent(new Event('cartUpdated')) } catch (e) {}
      return copy
    })
  }

  function removeFromCart(idOrIndex: number) {
    setCart((prev) => {
      if (!Array.isArray(prev)) return prev;
      const copy: any[] = [...prev]
      const idx = copy.findIndex((c) => c && c.id === idOrIndex)
      const removeIndex = idx >= 0 ? idx : idOrIndex
      if (removeIndex >= 0 && removeIndex < copy.length) {
        let toRemove: any = null;
        const removed = copy.splice(removeIndex, 1);
        if (Array.isArray(removed) && removed.length > 0) toRemove = removed[0];
        (async () => {
          try {
            if (toRemove && toRemove.id) await fetchJSON(`/carrito_item/${toRemove.id}`, { method: 'DELETE' });
          } catch (e) { console.warn('No se pudo eliminar carrito en servidor', e); }
        })();
      }
      try { window.dispatchEvent(new Event('cartUpdated')) } catch (e) {}
      try { localStorage.setItem('cart', JSON.stringify(copy)); } catch(e) {}
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
