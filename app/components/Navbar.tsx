'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Navbar, Nav, Container } from 'react-bootstrap'

export default function Naavbar() {
  const pathname = usePathname()
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
            <Nav.Link as={Link} href="/nosotros" active={pathname === '/nosotros'}>Nosotros</Nav.Link>
            <Nav.Link as={Link} href="/blogs" active={pathname === '/blogs'}>Blogs</Nav.Link>
            <Nav.Link as={Link} href="/contacto" active={pathname === '/contacto'}>Contactos</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Brand as={Link} href="/carrito">
          <Image src="/carrito.png" alt="Carrito" width={30} height={24} style={{ borderRadius: '75px' }} />
          {' '}Carrito
        </Navbar.Brand>
      </Container>
    </Navbar>
  )
}