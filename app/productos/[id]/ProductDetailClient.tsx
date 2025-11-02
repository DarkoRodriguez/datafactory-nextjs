"use client"

import React, { useEffect, useMemo, useState } from 'react'
import productos from '../../../productos'
import { useRouter } from 'next/navigation'

export default function ProductDetailClient({ id }: { id: string }) {
  const router = useRouter()
  const pid = Number(id)
  const [fallbackPid, setFallbackPid] = useState<number | null>(null)
  const resolvedPid = !isNaN(pid) ? pid : (fallbackPid ?? NaN)
  const product = productos.find((p) => p.id === resolvedPid)
  const [mainImg, setMainImg] = useState<string>('')
  const [qty, setQty] = useState<number>(1)

  useEffect(() => {
    // If the server-provided id was empty/NaN, try to parse it from the current pathname on the client.
    if (isNaN(pid) && typeof window !== 'undefined') {
      const parts = window.location.pathname.split('/').filter(Boolean)
      const last = parts.length ? parts[parts.length - 1] : ''
      const p = Number(last)
      if (!isNaN(p)) setFallbackPid(p)
    }
  }, [pid])

  useEffect(() => {
    if (product) setMainImg(product.imagen)
  }, [product])

  if (!product) {
      return (
        <section style={{ width: 'auto', maxWidth: 1300, margin: 'auto', padding: 20 }}>
          <h3>Producto no encontrado</h3>
          <p>Si esperabas ver un producto, revisa que la ruta sea <code>/productos/&lt;id&gt;</code> con un id numérico existente.</p>
        </section>
      )
  }

  const relacionados = productos.filter((p) => p.categoria === product.categoria && p.id !== product.id).slice(0, 6)

  function saveCart(cart: any[]) {
    try {
      localStorage.setItem('cart', JSON.stringify(cart))
    } catch (e) {
      console.error(e)
    }
  }

  function addToCart() {
    if (!product) return;
    // Calcular precio con descuento si aplica
    let precioFinal = product.precio;
    if (product.oferta && product.descuento > 0) {
      precioFinal = Math.round(product.precio * (1 - product.descuento / 100));
    }
    // Sanitize product before saving to avoid unexpected properties
    const item = {
      id: product.id,
      nombre: product.nombre,
      precio: precioFinal,
      imagen: product.imagen,
      qty: qty || 1,
    };

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingIndex = cart.findIndex((c: any) => c.id === item.id);
    if (existingIndex >= 0) {
      cart[existingIndex].qty = (cart[existingIndex].qty || 1) + item.qty;
    } else {
      cart.push(item);
    }

    try {
      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`${product.nombre} agregado al carrito`);
      // Notify other components (navbar, cart page) that cart changed
      try { window.dispatchEvent(new Event('cartUpdated')); } catch (e) { /* ignore */ }
    } catch (e) {
      console.error('Error saving cart:', e);
      alert('No se pudo agregar al carrito (error de almacenamiento)');
    }
  }

  return (
    <section style={{ width: 'auto', maxWidth: 1000, margin: 'auto', padding: 20 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
        <div style={{ flex: '1 1 320px', maxWidth: 400, minWidth: 260, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img
            id="main-img"
            src={mainImg}
            alt={product.nombre}
            className="main-img"
            style={{
              width: '100%',
              maxWidth: 340,
              maxHeight: 340,
              objectFit: 'contain',
              borderRadius: 8,
              boxShadow: '0 2px 12px #eee',
              marginBottom: 16,
              background: '#fff',
            }}
          />
          <div className="miniaturas" id="miniaturas" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {(Array.isArray(product.imagen) ? product.imagen : [product.imagen]).map((img, idx) => {
              const isSelected = img === mainImg
              return (
                <div
                  key={idx}
                  className={`mini-wrap ${isSelected ? 'selected' : ''}`}
                  onClick={() => setMainImg(img)}
                  style={{
                    display: 'inline-block',
                    border: isSelected ? '2px solid #1976d2' : '2px solid #eee',
                    borderRadius: 6,
                    padding: 2,
                    background: isSelected ? '#e3f2fd' : '#fff',
                    cursor: 'pointer',
                  }}
                >
                  <img src={img} alt={`mini-${idx}`} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4 }} />
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ flex: '2 1 400px', minWidth: 260 }}>
          <h2 id="nombre" style={{ marginTop: 0 }}>{product.nombre}</h2>
          {product.oferta && product.descuento > 0 ? (
            <>
              <h3 id="precio" style={{ color: '#d32f2f', margin: '8px 0' }}>
                ${Math.round(product.precio * (1 - product.descuento / 100)).toLocaleString()} <span style={{ color: '#1976d2', fontSize: 15, marginLeft: 8 }}>({product.descuento}% OFF)</span>
              </h3>
              <div style={{ textDecoration: 'line-through', color: '#888', fontSize: 15, marginBottom: 6 }}>${product.precio.toLocaleString()}</div>
            </>
          ) : (
            <h3 id="precio" style={{ color: '#1976d2', margin: '8px 0' }}>${product.precio.toLocaleString()}</h3>
          )}
          <p id="descripcion" style={{ fontSize: 16 }}>{product.descripcion}</p>

          <div style={{ margin: '18px 0 0 0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <label htmlFor="cantidad">Cantidad:</label>
            <input id="cantidad" type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} style={{ width: 60 }} />
            <button id="btn-add" onClick={addToCart} style={{ borderRadius: 15, maxWidth: 250, borderColor: 'antiquewhite', background: '#1976d2', color: '#fff', padding: '8px 18px', fontWeight: 500 }}>
              Añadir al carrito
            </button>
          </div>
        </div>
      </div>

      <div className="relacionados" style={{ marginTop: 48 }}>
        <h4>Productos relacionados</h4>
        <div id="relacionados-list" style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          {relacionados.map((r) => (
            <div key={r.id} onClick={() => router.push(`/productos/${r.id}`)} style={{ cursor: 'pointer', width: 120, textAlign: 'center' }}>
              <img src={r.imagen} alt={r.nombre} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 6, boxShadow: '0 1px 6px #eee' }} />
              <div style={{ fontSize: 13, marginTop: 6 }}>{r.nombre}</div>
              <div style={{ fontWeight: 'bold', color: '#e63946', fontSize: 14 }}>${r.precio.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
