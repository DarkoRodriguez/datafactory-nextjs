import productos from '../../productos'
import Link from 'next/link'

export default function OfertasPage() {
  const ofertas = productos.filter(p => p.oferta && p.descuento > 0)

  return (
    <section style={{ width: 'auto', maxWidth: 1100, margin: 'auto', padding: 20 }}>
      <h2 style={{ marginBottom: 18 }}>Ofertas especiales</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        {ofertas.length === 0 ? (
          <div>No hay productos en oferta actualmente.</div>
        ) : (
          ofertas.map(producto => {
            const precioOferta = Math.round(producto.precio * (1 - producto.descuento / 100))
            return (
              <div key={producto.id} style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px #eee', padding: 18, width: 240 }}>
                <Link href={`/productos/${producto.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <img src={producto.imagen} alt={producto.nombre} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8 }} />
                  <h3 style={{ margin: '12px 0 4px 0', fontSize: 18 }}>{producto.nombre}</h3>
                  <div style={{ fontSize: 15, color: '#888', marginBottom: 6 }}>{producto.descripcion.slice(0, 60)}...</div>
                  <div style={{ fontWeight: 'bold', color: '#d32f2f', fontSize: 18 }}>
                    ${precioOferta.toLocaleString()} <span style={{ color: '#1976d2', fontSize: 14, marginLeft: 8 }}>({producto.descuento}% OFF)</span>
                  </div>
                  <div style={{ textDecoration: 'line-through', color: '#888', fontSize: 14 }}>${producto.precio.toLocaleString()}</div>
                </Link>
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}
