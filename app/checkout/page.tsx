"use client"

import React, { useEffect, useState } from 'react'

type CartItem = {
  id: number
  nombre: string
  precio: number
  imagen?: string
  qty: number
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)


  // form state
  const [nombre, setNombre] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [correo, setCorreo] = useState('')
  const [calle, setCalle] = useState('')
  const [departamento, setDepartamento] = useState('')
  const [region, setRegion] = useState('Región Metropolitana de Santiago')
  const [comuna, setComuna] = useState('Cerrillos')
  const [indicaciones, setIndicaciones] = useState('')

  // Autocompletar datos si el usuario está logueado
  useEffect(() => {
    try {
      const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado') || 'null');
      if (usuarioLogueado) {
        setNombre(usuarioLogueado.nombre || '');
        setApellidos(usuarioLogueado.apellidos || '');
        setCorreo(usuarioLogueado.email || '');
        setCalle(usuarioLogueado.calle || '');
        setDepartamento(usuarioLogueado.departamento || '');
        setRegion(usuarioLogueado.region || 'Región Metropolitana de Santiago');
        setComuna(usuarioLogueado.comuna || 'Cerrillos');
        setIndicaciones(usuarioLogueado.indicaciones || '');
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cart')
      const parsed = raw ? JSON.parse(raw) : []
      setCart(Array.isArray(parsed) ? parsed : [])
    } catch (e) {
      setCart([])
    } finally {
      setLoading(false)
    }
  }, [])

  function formatCurrency(num: number) {
    return '$' + num.toLocaleString()
  }

  const total = cart.reduce((s, it) => s + it.precio * (it.qty || 1), 0)


  // Lista de comunas válidas (puedes agregar más si lo deseas)
  const comunasValidas = [
    'Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 'Estación Central',
    'Huechuraba', 'Independencia', 'La Cisterna', 'La Florida', 'La Granja',
    'La Pintana', 'La Reina', 'Las Condes', 'Lo Barnechea', 'Lo Espejo',
    'Lo Prado', 'Macul', 'Maipú', 'Ñuñoa', 'Pedro Aguirre Cerda', 'Peñalolén',
    'Providencia', 'Pudahuel', 'Quilicura', 'Quinta Normal', 'Recoleta',
    'Renca', 'San Joaquín', 'San Miguel', 'San Ramón', 'Santiago', 'Vitacura'
  ];

  // Estado de la compra: null | 'success' | 'fail'
  const [estadoCompra, setEstadoCompra] = useState<null | 'success' | 'fail'>(null);
  const [orderId] = useState(() => Math.floor(20240000 + Math.random() * 1000));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const comunaValida = comunasValidas.some(
      (c) => c.toLowerCase() === comuna.trim().toLowerCase()
    );
    setEstadoCompra(comunaValida ? 'success' : 'fail');
    // Guardar orden para depuración
    const order = {
      customer: { nombre, apellidos, correo },
      address: { calle, departamento, region, comuna, indicaciones },
      items: cart,
      total,
      createdAt: new Date().toISOString(),
      estado: comunaValida ? 'success' : 'fail',
    };
    try {
      localStorage.setItem('lastOrder', JSON.stringify(order));
      try { (window as any).lastOrder = order } catch (e) {}
    } catch (e) {
      console.error('Could not save order to localStorage', e);
    }
    if (comunaValida) {
      try {
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cartUpdated'));
      } catch (e) {}
    }
  }

  if (loading) return <div style={{ padding: 24 }}>Cargando...</div>;

  // Si el carrito está vacío, mostrar mensaje amigable

  // Bloque de depuración para mostrar el contenido del carrito
  if (!cart || cart.length === 0) {
    return (
      <section style={{ width: 'auto', maxWidth: 700, margin: 'auto', padding: 40 }}>
        <div style={{ background: '#fff', padding: 32, borderRadius: 12, boxShadow: '0 2px 8px #eee', textAlign: 'center' }}>
          <h2>Tu carrito está vacío</h2>
          
          <div style={{ marginTop: 24, fontSize: 13, color: '#888', textAlign: 'center' }}>
            <strong>Agrega productos al carrito para continuar con la compra.</strong>
            </div>
        </div>
      </section>
    );
  }

  // Renderizar resultado de compra si existe estadoCompra
  if (estadoCompra) {
    const esExitosa = estadoCompra === 'success';
    return (
      <section style={{ width: 'auto', maxWidth: 700, margin: 'auto', padding: 20 }}>
        <div style={{ background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 2px 8px #eee' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
            {esExitosa ? (
              <span style={{ fontSize: 28, color: '#2e7d32', marginRight: 12 }}>✔️</span>
            ) : (
              <span style={{ fontSize: 28, color: '#c62828', marginRight: 12 }}>❌</span>
            )}
            <div>
              <h2 style={{ margin: 0, fontWeight: 600, fontSize: 22 }}>
                {esExitosa ? 'Se ha realizado la compra.' : 'No se pudo realizar el pago.'} nro #{orderId}
              </h2>
              <div style={{ color: '#888', fontSize: 14, marginTop: 2 }}>Código orden: ORDER12345</div>
            </div>
          </div>
          <div style={{ marginBottom: 18, fontSize: 15, color: '#444' }}>
            {esExitosa ? 'Completa la siguiente información' : 'Detalle de comprar'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label>Nombre*</label>
              <input value={nombre} disabled style={{ width: '100%', padding: 8 }} />
            </div>
            <div>
              <label>Apellidos*</label>
              <input value={apellidos} disabled style={{ width: '100%', padding: 8 }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label>Correo*</label>
              <input value={correo} disabled style={{ width: '100%', padding: 8 }} />
            </div>
            <div>
              <label>Calle*</label>
              <input value={calle} disabled style={{ width: '100%', padding: 8 }} />
            </div>
            <div>
              <label>Departamento (opcional)</label>
              <input value={departamento} disabled style={{ width: '100%', padding: 8 }} />
            </div>
            <div>
              <label>Región*</label>
              <input value={region} disabled style={{ width: '100%', padding: 8 }} />
            </div>
            <div>
              <label>Comuna*</label>
              <input value={comuna} disabled style={{ width: '100%', padding: 8 }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label>Indicaciones para la entrega (opcional)</label>
              <textarea value={indicaciones} disabled style={{ width: '100%', padding: 8, minHeight: 60 }} />
            </div>
          </div>
          <div style={{ marginBottom: 18 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 8 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: 8 }}>Imagen</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Nombre</th>
                  <th style={{ textAlign: 'right', padding: 8 }}>Precio</th>
                  <th style={{ textAlign: 'center', padding: 8 }}>Cantidad</th>
                  <th style={{ textAlign: 'right', padding: 8 }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((it) => (
                  <tr key={it.id} style={{ borderTop: '1px solid #eee' }}>
                    <td style={{ padding: 8 }}>
                      {it.imagen ? <img src={it.imagen} alt={it.nombre} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6 }} /> : <div style={{ width: 40, height: 40, background: '#f0f0f0' }} />}
                    </td>
                    <td style={{ padding: 8 }}>{it.nombre}</td>
                    <td style={{ padding: 8, textAlign: 'right' }}>{formatCurrency(it.precio)}</td>
                    <td style={{ padding: 8, textAlign: 'center' }}>{it.qty}</td>
                    <td style={{ padding: 8, textAlign: 'right' }}>{formatCurrency(it.precio * (it.qty || 1))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ textAlign: 'right', marginTop: 8 }}>
              <strong>Total pagado: {formatCurrency(total)}</strong>
            </div>
          </div>
          {esExitosa ? (
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button style={{ background: '#d32f2f', color: '#fff', padding: '10px 16px', borderRadius: 6, border: 'none' }}>Imprimir boleta en PDF</button>
              <button style={{ background: '#388e3c', color: '#fff', padding: '10px 16px', borderRadius: 6, border: 'none' }}>Enviar boleta por email</button>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
              <button onClick={() => setEstadoCompra(null)} style={{ background: '#388e3c', color: '#fff', padding: '12px 18px', borderRadius: 6, border: 'none', fontWeight: 500 }}>
                VOLVER A REALIZAR EL PAGO
              </button>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Renderizar el formulario de checkout si hay productos y no se ha realizado la compra
  return (
    <section style={{ width: 'auto', maxWidth: 1000, margin: 'auto', padding: 20 }}>
      <h2 style={{ marginBottom: 12 }}>Carrito de compra</h2>

      <div style={{ background: '#fff', padding: 12, borderRadius: 6, marginBottom: 18 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: 8 }}>Imagen</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Nombre</th>
              <th style={{ textAlign: 'right', padding: 8 }}>Precio</th>
              <th style={{ textAlign: 'center', padding: 8 }}>Cantidad</th>
              <th style={{ textAlign: 'right', padding: 8 }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((it) => (
              <tr key={it.id} style={{ borderTop: '1px solid #eee' }}>
                <td style={{ padding: 8 }}>
                  {it.imagen ? <img src={it.imagen} alt={it.nombre} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6 }} /> : <div style={{ width: 60, height: 60, background: '#f0f0f0' }} />}
                </td>
                <td style={{ padding: 8 }}>{it.nombre}</td>
                <td style={{ padding: 8, textAlign: 'right' }}>{formatCurrency(it.precio)}</td>
                <td style={{ padding: 8, textAlign: 'center' }}>{it.qty}</td>
                <td style={{ padding: 8, textAlign: 'right' }}>{formatCurrency(it.precio * (it.qty || 1))}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ textAlign: 'right', marginTop: 8 }}>
          <strong>Total: {formatCurrency(total)}</strong>
        </div>
      </div>

      <h3 style={{ marginBottom: 8 }}>Información del cliente</h3>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 12, borderRadius: 6 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 14 }}>Nombre*</label>
            <input required value={nombre} onChange={(e) => setNombre(e.target.value)} style={{ width: '100%', padding: 8 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 14 }}>Apellidos*</label>
            <input required value={apellidos} onChange={(e) => setApellidos(e.target.value)} style={{ width: '100%', padding: 8 }} />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: 14 }}>Correo*</label>
            <input required type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} style={{ width: '100%', padding: 8 }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 14 }}>Calle*</label>
            <input required value={calle} onChange={(e) => setCalle(e.target.value)} style={{ width: '100%', padding: 8 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 14 }}>Departamento (opcional)</label>
            <input value={departamento} onChange={(e) => setDepartamento(e.target.value)} style={{ width: '100%', padding: 8 }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 14 }}>Región*</label>
            <select required value={region} onChange={(e) => setRegion(e.target.value)} style={{ width: '100%', padding: 8 }}>
              <option>Región Metropolitana de Santiago</option>
              <option>Valparaíso</option>
              <option>Biobío</option>
              <option>O'Higgins</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 14 }}>Comuna*</label>
            <input required value={comuna} onChange={(e) => setComuna(e.target.value)} placeholder="Ej: Cerrillos" style={{ width: '100%', padding: 8 }} />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: 14 }}>Indicaciones para la entrega (opcional)</label>
            <textarea value={indicaciones} onChange={(e) => setIndicaciones(e.target.value)} style={{ width: '100%', padding: 8, minHeight: 80 }} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <div />
          <button type="submit" style={{ background: '#2e7d32', color: '#fff', padding: '12px 18px', borderRadius: 6, border: 'none' }}>
            Pagar ahora {formatCurrency(total)}
          </button>
        </div>
      </form>
    </section>
  );
}
