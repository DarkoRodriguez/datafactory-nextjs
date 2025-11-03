"use client";

import "../../styles/inicioSesion.css";
import { useState } from "react";
import Image from "next/image";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function InicioSesion() {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const listaUsuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const usuarioEncontrado = listaUsuarios.find((u: any) => u.email === email);

    if (!usuarioEncontrado) {
      alert("El correo no está registrado");
      console.error("Correo no registrado");
      return;
    }

    if (usuarioEncontrado.contrasena !== contrasena) {
      alert("Contraseña incorrecta");
      console.error("Contraseña incorrecta");
      return;
    }

    alert("Inicio de sesión exitoso");
    console.log("Usuario logueado:", usuarioEncontrado);
  };

  return (
    <main>
      {/* Logo */}
      <Image
        src="/logo_empresa.jpg"
        width={150}
        height={150}
        alt="Logo"
        className="logo_empresa"
      />
      <h1 className="encabezado1">DATA FACTORY</h1>

      {/* Formulario */}
      <section
        className="section_registro_usuario mt-1"
        style={{
          backgroundColor: "#ffffffea",
          maxWidth: "800px",
          padding: "50px",
          borderRadius: "7px",
          width: "80%",
          margin: "0 auto 40px auto",
          color: "#000",
        }}
      >
        <h2 className="h2_registro_usuario">Inicio Sesión</h2>

        <form className="form_inicio_sesion" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="correo mb-3">
            <label className="form-label">Correo</label>
            <input
              type="text"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="form-text">Ingrese correo correctamente</div>
          </div>

          {/* Contraseña */}
          <div className="contraseña mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type={mostrarContrasena ? "text" : "password"}
              className="form-control"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
            <div className="form-check mt-2">
              <input
                className="form-check-input"
                type="checkbox"
                checked={mostrarContrasena}
                onChange={(e) => setMostrarContrasena(e.target.checked)}
              />
              <label className="form-check-label">Mostrar contraseña</label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary mt-3">
            Iniciar Sesión
          </button>

          <p className="parrafo_registro_usuario mt-3">
            ¿No tienes una cuenta? <a href="/register">Regístrate</a>
          </p>
        </form>
      </section>
    </main>
  );
}
