"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { fetchJSON, getSessionId } from '../../lib/api'
import { useRouter } from 'next/navigation'

export default function ProductDetailClient({ id }: { id: string }) {
  const router = useRouter()
  const pid = Number(id)
  const [fallbackPid, setFallbackPid] = useState<number | null>(null)
  const resolvedPid = !isNaN(pid) ? pid : (fallbackPid ?? NaN)
  const [product, setProduct] = useState<any | null>(null)
  const [productos, setProductos] = useState<any[]>([])
  const [mainImg, setMainImg] = useState<string>('')
  const [qty, setQty] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

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
    let mounted = true;
    const idToFetch = resolvedPid;
    if (isNaN(idToFetch)) return;
    setLoading(true);
    setError(null);
    // Fetch single product and full list for relacionados
    Promise.all([
      fetchJSON(`/producto/${idToFetch}`).catch((e) => { console.warn(e); return null }),
      fetchJSON('/producto').catch((e) => { console.warn(e); return [] }),
    ])
      .then(([p, all]) => {
        if (!mounted) return;
        setProduct(p || null);
        setProductos(Array.isArray(all) ? all : []);
        if (p && p.imagen) setMainImg(Array.isArray(p.imagen) ? p.imagen[0] : p.imagen);
      })
      .catch((err) => {
        console.warn('Error fetching product:', err);
        if (mounted) setError('No se pudo cargar el producto');
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false }
  }, [resolvedPid])

  if (loading) return <div style={{ padding: 20, textAlign: 'center' }}>Cargando producto...</div>
  if (error) return <div style={{ padding: 20, textAlign: 'center' }}>{error}</div>
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
      productoId: product.id,
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

    // try to sync with backend
    (async () => {
      try {
        const usuario = JSON.parse(localStorage.getItem('usuarioLogueado') || 'null');
        const body: any = {
          // primary shape: primitive ids
          producto_id: product.id,
          cantidad: item.qty,
          nombre: product.nombre,
          imagen: product.imagen,
          precio: precioFinal
        };
        // also include nested relation shapes that some backends expect
        if (usuario && usuario.id) {
          body.usuario_id = usuario.id;
          body.usuario = { id: usuario.id };
        } else {
          const sid = getSessionId();
          body.sessionId = sid;
          body.session_id = sid;
        }
        // include producto as nested object as well
        body.producto = { id: product.id };

        // debug: log payload as JSON string before sending (safer to copy/paste)
        try {
          console.debug('POST /carrito_item payload (string):', JSON.stringify(body));
        } catch (e) {
          console.warn('Could not stringify carrito_item payload for debug', e);
        }

        // Guard: ensure we have a product id to send to backend. If missing, abort sync to avoid 500s.
        if (!body.producto_id && !(body.producto && body.producto.id)) {
          console.error('Aborting POST /carrito_item: missing producto_id in payload', body);
        } else {
          let created: any = null;
          try {
            created = await fetchJSON('/carrito_item', { method: 'POST', body: JSON.stringify(body) });
          } catch (err: any) {
            // fetchJSON throws Error(text) where text may be JSON; print it for debugging
            console.error('Error creating carrito_item:', err?.message || err);
            throw err; // rethrow so outer handler can continue
          }
          // if backend returned the created carrito item with id, sync local cart with server state
          try {
            const allServer = await fetchJSON('/carrito_item');
            let serverItems: any[] = [];
            if (usuario && usuario.id) {
              const uid = usuario.id || Number(localStorage.getItem('usuarioId'));
              serverItems = allServer.filter((it: any) => (it.usuario_id && it.usuario_id === uid) || (it.usuario && it.usuario.id === uid));
            } else {
              const sid = getSessionId();
              serverItems = allServer.filter((it: any) => it.sessionId === sid || it.session_id === sid);
            }
            // map server items to local cart shape
            const mapped = serverItems.map((it: any) => ({
              id: it.id,
              productoId: it.producto?.id || it.producto_id || it.productoId || it.productoId || null,
              nombre: it.nombre || it.producto?.nombre,
              imagen: it.imagen || it.producto?.imagen,
              precio: it.precio || it.producto?.precio,
              qty: it.cantidad || it.qty
            }));
            localStorage.setItem('cart', JSON.stringify(mapped));
            try { window.dispatchEvent(new Event('cartUpdated')); } catch (e) {}
          } catch (e) {
            // fallback: try to update the single item id locally
            if (created && created.id) {
              try {
                const raw = localStorage.getItem('cart') || '[]';
                const localCart = JSON.parse(raw);
                const idx = localCart.findIndex((c: any) => c.id === item.id);
                if (idx >= 0) {
                  localCart[idx].id = created.id;
                  localStorage.setItem('cart', JSON.stringify(localCart));
                  try { window.dispatchEvent(new Event('cartUpdated')); } catch (e) {}
                }
              } catch (e) {}
            }
          }
        }
        
      } catch (err) {
        console.warn('No se pudo sincronizar carrito:', err);
      }
    })();
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
            {(Array.isArray(product.imagen) ? product.imagen : [product.imagen]).map((img: any, idx: number) => {
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
          {relacionados.map((r: any) => (
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
