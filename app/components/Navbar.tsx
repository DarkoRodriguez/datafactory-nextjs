'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Navbar, Nav, Container } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'

export default function Naavbar() {
  const pathname = usePathname()
  const [count, setCount] = useState<number>(0)

  useEffect(() => {
    function readCart() {
      try {
        const raw = localStorage.getItem('cart')
        const parsed = raw ? JSON.parse(raw) : []
        setCount(Array.isArray(parsed) ? parsed.reduce((s: number, it: any) => s + (it.qty || 0), 0) : 0)
      } catch (e) {
        setCount(0)
      }
    }

    readCart()

    // Listen to storage events (other tabs) and custom events
    function onStorage(e: StorageEvent) {
      if (e.key === 'cart') readCart()
    }

    function onCartUpdated() { readCart() }

    window.addEventListener('storage', onStorage)
    window.addEventListener('cartUpdated', onCartUpdated)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('cartUpdated', onCartUpdated)
    }
  }, [])
  return (
    <Navbar expand="lg" style={{ backgroundColor: '#ffe07a', fontFamily: 'copperplate, fantasy', fontWeight: 'lighter', paddingBottom: '10px',paddingTop: '10px'  }}>
      <Container>
        <Navbar.Brand as={Link} href="/">
          <Image src="/logo_empresa.jpg" alt="Logo" width={30} height={24} style={{ borderRadius: '75px' }} />
          {' '}DATA FACTORY
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar" className="justify-content-center">
          <Nav>
            <Nav.Link as={Link} href="/" active={pathname === '/'}>Home</Nav.Link>
            <Nav.Link as={Link} href="/productos" active={pathname === '/productos'}>Productos</Nav.Link>
            <Nav.Link as={Link} href="/ofertas" active={pathname === '/ofertas'} style={{ color: '#d32f2f', fontWeight: 600 }}>Ofertas</Nav.Link>
            <Nav.Link as={Link} href="/nosotros" active={pathname === '/nosotros'}>Nosotros</Nav.Link>
            <Nav.Link as={Link} href="/blogs" active={pathname === '/blogs'}>Blogs</Nav.Link>
            <Nav.Link as={Link} href="/contacto" active={pathname === '/contacto'}>Contactos</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Brand as={Link} href="/carrito" style={{ position: 'relative' }}>
          <Image src="/carrito.png" alt="Carrito" width={30} height={24} style={{ borderRadius: '75px' }} />
          {' '}Carrito
          {count > 0 && (
            <span style={{
              position: 'absolute',
              top: -6,
              right: -6,
              background: '#dc3545',
              color: '#fff',
              borderRadius: '50%',
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700
            }}>{count}</span>
          )}
        </Navbar.Brand>
      </Container>
    </Navbar>
  )
}