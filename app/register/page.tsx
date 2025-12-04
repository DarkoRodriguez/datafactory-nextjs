"use client"; // necesario para usar useState y useEffect

import "../../styles/registroUsuario.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchJSON } from '../lib/api'

export default function RegistroUsuario() {

  // ✅ Estados para el formulario
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [region, setRegion] = useState("");
  const [comuna, setComuna] = useState("");
  const [comunasDisponibles, setComunasDisponibles] = useState<string[]>([]);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const comunasPorRegion: Record<string, string[]> = {
    metropolitana: ["Santiago", "Maipú", "Puente Alto", "La Florida", "Las Condes"],
    valparaiso: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "San Antonio"],
    biobio: ["Concepción", "Talcahuano", "Chiguayante", "Los Ángeles", "Coronel"],
    araucania: ["Temuco", "Padre Las Casas", "Angol", "Villarrica", "Pucón"],
    nuble: ["Chillán", "San Carlos", "Bulnes", "Yungay", "Quirihue"]
  };

  // Actualiza comunas cuando se selecciona región
  useEffect(() => {
    if (region && comunasPorRegion[region]) {
      setComunasDisponibles(comunasPorRegion[region]);
    } else {
      setComunasDisponibles([]);
      setComuna("");
    }
  }, [region]);

  // Validación y envío del formulario
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // keep basic client validations
    if (!nombre || !email || !contrasena) {
      alert('Complete los campos requeridos');
      return;
    }

    // call backend API to create usuario
    (async () => {
      try {
        const payload = { nombre, email, password: contrasena, telefono, region, comuna };
        const created = await fetchJSON('/usuarios', { method: 'POST', body: JSON.stringify(payload) });
        // store user locally for compatibility and redirect to login
        try { localStorage.setItem('usuarioLogueado', JSON.stringify(created)); } catch(e) {}
        alert('Registro exitoso');
        // reset
        setNombre(''); setEmail(''); setContrasena(''); setConfirmacion(''); setTelefono(''); setRegion(''); setComuna(''); setComunasDisponibles([]);
        window.location.href = '/login';
      } catch (e:any) {
        console.error(e);
        // fetchJSON throws with server text when !ok; show a friendly message
        alert(e?.message || 'Error conectando al servidor');
      }
    })();
  };

  return (
    <main>
      {/* Formulario */}
      <section className="section_registro_usuario" style={{ backgroundColor: "#ffffffea", maxWidth: "800px", padding: "50px", borderRadius: "7px", width: "80%", margin: "10px auto 40px auto", color: "#000" }}>
        <Image src="/logo_empresa.jpg" width={150} height={150} alt="Logo" className="logo_empresa" />
        <h2 className="h2_registro_usuario">Registro Usuario</h2>

        <form className="form_registro_usuario" onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className="nombre mb-3">
            <label className="form-label">Nombre Completo</label>
            <input type="text" className="form-control" value={nombre} onChange={e => setNombre(e.target.value)} />
          </div>

          {/* Email */}
          <div className="email mb-3">
            <label className="form-label">Correo</label>
            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          {/* Contraseña */}
          <div className="contraseña mb-3">
            <label className="form-label">Contraseña</label>
            <input type={mostrarContrasena ? "text" : "password"} className="form-control" value={contrasena} onChange={e => setContrasena(e.target.value)} />
            <div className="form-check mt-2">
              <input className="form-check-input" type="checkbox" checked={mostrarContrasena} onChange={e => setMostrarContrasena(e.target.checked)} />
              <label className="form-check-label">Mostrar contraseña</label>
            </div>
          </div>

          {/* Confirmación */}
          <div className="confirmacion_contraseña mb-3">
            <label className="form-label">Confirmar Contraseña</label>
            <input type={mostrarConfirmacion ? "text" : "password"} className="form-control" value={confirmacion} onChange={e => setConfirmacion(e.target.value)} />
            <div className="form-check mt-2">
              <input className="form-check-input" type="checkbox" checked={mostrarConfirmacion} onChange={e => setMostrarConfirmacion(e.target.checked)} />
              <label className="form-check-label">Mostrar contraseña de confirmación</label>
            </div>
          </div>

          {/* Teléfono */}
          <div className="telefono mb-3">
            <label className="form-label">Teléfono</label>
            <input type="number" className="form-control" value={telefono} onChange={e => setTelefono(e.target.value)} />
          </div>

          {/* Región */}
          <div className="region mb-3">
            <label className="form-label">Región</label>
            <select className="form-control" value={region} onChange={e => setRegion(e.target.value)}>
              <option value="">Seleccione una región</option>
              <option value="metropolitana">Región Metropolitana</option>
              <option value="valparaiso">Región de Valparaíso</option>
              <option value="biobio">Región del Biobío</option>
              <option value="araucania">Región de la Araucanía</option>
              <option value="nuble">Región de Ñuble</option>
            </select>
          </div>

          {/* Comuna */}
          <div className="comuna mb-3">
            <label className="form-label">Comuna</label>
            <select className="form-control" value={comuna} onChange={e => setComuna(e.target.value)} disabled={comunasDisponibles.length === 0}>
              <option value="">Seleccione una comuna</option>
              {comunasDisponibles.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <button type="submit" className="btn btn-primary mt-3">Registrar</button>
          <p className="parrafo_registro_usuario mt-3">
            ¿Ya tienes una cuenta? <Link href="/login">Inicia Sesión</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

