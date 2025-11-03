"use client"
import React, { useMemo } from "react";
import Link from "next/link";
import productos from "../productos";
import { Container, Row, Col, Card, Button, Carousel } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';

export default function Home() {
  const categorias = useMemo(() => {
    const cats = Array.from(new Set(productos.map((p) => p.categoria))).filter(Boolean) as string[];
    return ["todos", ...cats];
  }, []);

  return (
    <div>
      {/* Sesión links (mantener registro e inicio de sesión) */}
      <div className="sesion-container" style={{ padding: '10px', textAlign: 'right' }}>
        <ul className="sesion" style={{ listStyle: 'none', display: 'inline-flex', gap: '8px', padding: 0, margin: 0 }}>
          <li>
            <Link href="/login">
              <button className="btn btn-sm btn-outline-warning">Iniciar Sesión</button>
            </Link>
          </li>
          <li><h5 style={{ margin: 0 }}>|</h5></li>
          <li>
            <Link href="/register">
              <button className="btn btn-sm btn-warning">Registrar Usuario</button>
            </Link>
          </li>
        </ul>
      </div>

      {/* Carousel de productos (altura fija) */}
      <section id="presentacion" style={{ padding: '20px 0' }}>
        <Container>
          <Carousel style={{ height: 340, maxHeight: 340, overflow: 'hidden' }}>
              <Carousel.Item style={{ height: 340 }}>
                <Link href="/ofertas" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="carousel-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', height: 340 }}>
                    <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                      <h2 style={{ fontSize: '2rem', color: '#d32f2f', textAlign: 'center' }}>¡Revisa nuestras ofertas navideñas!</h2>
                      <p style={{ maxWidth: 520, fontWeight: 500, textAlign: 'center', margin: '0 auto' }}>Descubre descuentos especiales en libros y cursos de programación. ¡No te pierdas las mejores oportunidades para regalar y aprender!</p>
                    </div>
                    <div style={{ flex: '0 0 320px', textAlign: 'center', display: 'flex', alignItems: 'center', height: '100%' }}>
                      <img src="/ofertas_navidad.jpg" alt="Ofertas navideñas" style={{ maxWidth: '100%', maxHeight: 260, objectFit: 'cover', borderRadius: 8, margin: '0 auto' }} />
                    </div>
                  </div>
                </Link>
              </Carousel.Item>
              {productos.slice(0, 6).map((p) => (
                <Carousel.Item key={p.id} style={{ height: 340 }}>
                  <Link href={`/productos/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="carousel-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', height: 340 }}>
                      <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                        <h2 style={{ fontSize: '1.8rem', textAlign: 'center' }}>{p.nombre}</h2>
                        <p style={{ maxWidth: 520, textAlign: 'center', margin: '0 auto' }}>{p.descripcion}</p>
                      </div>
                      <div style={{ flex: '0 0 320px', textAlign: 'center', display: 'flex', alignItems: 'center', height: '100%' }}>
                        <img src={p.imagen} alt={p.nombre} style={{ maxWidth: '100%', maxHeight: 260, objectFit: 'cover', borderRadius: 8, margin: '0 auto' }} />
                      </div>
                    </div>
                  </Link>
                </Carousel.Item>
              ))}
          </Carousel>
        </Container>
      </section>

      {/* Sección de categorías (cards con imagen y texto blanco centrado) */}
      <section id="categorias" style={{ padding: '40px 0' }}>
        <Container>
          <h3 className="mb-4" style={{ textAlign: 'center' }}>Explora por categorías</h3>
          <Row xs={1} sm={2} md={3} lg={4} className="g-4 justify-content-center" style={{ justifyContent: 'center' }}>
            {/* Tarjeta "Todos los productos" */}
            <Col className="d-flex justify-content-center">
              <Link href="/productos" style={{ textDecoration: 'none' }}>
                <Card className="h-100 clickable-card" style={{ width: 260, position: 'relative', overflow: 'hidden', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                  <div style={{ height: 180, background: '#e3e3e3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src="/libros.jpg" alt="Todos los productos" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', background: 'rgba(255,255,255,0.92)', padding: '16px 0 10px 0', textAlign: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: 18 }}>Todos los productos</span>
                  </div>
                </Card>
              </Link>
            </Col>

            {categorias.filter(c => c !== 'todos').map((cat) => {
              // Buscar la primera imagen de la categoría
              const imgCat = productos.find(p => p.categoria === cat)?.imagen || '/default-cat.png';
              return (
                <Col key={cat} className="d-flex justify-content-center">
                  <Link href={`/productos?categoria=${encodeURIComponent(cat)}`} style={{ textDecoration: 'none' }}>
                    <Card className="h-100 clickable-card" style={{ width: 260, position: 'relative', overflow: 'hidden', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                      <div style={{ height: 180, background: '#e3e3e3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={imgCat} alt={cat} style={{ width: '80%', height: '80%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', background: 'rgba(255,255,255,0.92)', padding: '16px 0 10px 0', textAlign: 'center' }}>
                        <span style={{ fontWeight: 600, fontSize: 18 }}>{cat}</span>
                      </div>
                    </Card>
                  </Link>
                </Col>
              );
            })}
          </Row>
        </Container>
      </section>

      {/* Footer (mantener similar al original) */}
      <footer className="footer" style={{ background: '#f5f5f5', padding: '20px 0', marginTop: 40 }}>
        <div className="footer-container" style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 20, justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div className="footer-left">
            <ul className="links" style={{ listStyle: 'none', padding: 0 }}>
              <h5>DATA FACTORY</h5>
              <li><a href="/nosotros">Nosotros</a></li>
              <li><h5>|</h5></li>
              <li><a href="/blogs">Blogs</a></li>
              <li><h5>|</h5></li>
              <li><a href="/contacto">Contacto</a></li>
            </ul>
            <div className="payment-icons" style={{ marginTop: 10 }}>
              <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" />
              <img src="https://img.icons8.com/color/48/000000/mastercard-logo.png" alt="Mastercard" />
              <img src="https://img.icons8.com/color/48/000000/paypal.png" alt="Paypal" />
            </div>
          </div>

          <div className="footer-right" style={{ maxWidth: 360 }}>
            <p>Sigamos en contacto. Unete a nuestra comunidad</p>
            <form className="newsletter" onSubmit={(e) => { e.preventDefault(); alert('Gracias por unirte'); }}>
              <input type="email" placeholder="Ingresa tu email" required style={{ width: '70%', padding: '6px' }} />
              <button type="submit" style={{ padding: '6px 10px', marginLeft: 8 }}>Unirse</button>
            </form>
          </div>
        </div>
      </footer>
    </div>
  );
}
