"use client";

import "../../styles/contacto.css";
import { useState } from "react";
import Image from "next/image";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Contacto() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Validación nombre
    const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (!nombre) {
      alert("El campo Nombre no puede estar vacío");
      console.error("Error: El campo nombre no puede estar vacío");
      return;
    }
    if (!nombreRegex.test(nombre)) {
      alert("El Nombre solo debe contener letras y espacios");
      console.error("El Nombre solo debe contener letras y espacios");
      return;
    }
    if (nombre.length > 100) {
      alert("El campo Nombre no puede superar los 100 caracteres");
      console.error("El campo Nombre no puede superar los 100 caracteres");
      return;
    }

    // Validación email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|gmail\.com|profesor\.duoc\.cl)$/;
    if (!email) {
      alert("El campo correo no puede estar vacío.");
      console.error("Error: El campo correo no puede estar vacío");
      return;
    }
    if (email.length > 100) {
      alert("El correo no puede superar los 100 caracteres.");
      console.error("El correo no puede superar los 100 caracteres");
      return;
    }
    if (!emailRegex.test(email)) {
      alert("El correo debe terminar en @duoc.cl, @gmail.com o @profesor.duoc.cl");
      console.error("El correo debe terminar en @duoc.cl, @gmail.com o @profesor.duoc.cl");
      return;
    }

    // Validación mensaje
    if (!mensaje) {
      alert("El campo Mensaje no puede estar vacío");
      console.error("Error: Mensaje vacío");
      return;
    }
    if (mensaje.length > 500) {
      alert("El mensaje no puede exceder los 500 caracteres");
      console.error("Error: Mensaje demasiado largo");
      return;
    }

    console.log("Formulario enviado correctamente:", { nombre, email, mensaje });
    alert("Formulario enviado correctamente");

    // Reset del formulario
    setNombre("");
    setEmail("");
    setMensaje("");
  };

  return (
    <body>
      {/* Logo centrado */}
      <div className="logo-container">
        <Image
          src="/logo_empresa.jpg"
          width={150}
          height={150}
          alt="Logo"
          className="logo_empresa"
        />
      </div>

      <h1 className="encabezado1">DATA FACTORY</h1>

      {/* Formulario */}
      <section className="section_registro_usuario">
        <h2 className="h2_registro_usuario">Formulario de Contactos</h2>

        <form className="form_contacto" onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className="nombre mb-3">
            <label className="form-label">Nombre Completo</label>
            <input
              type="text"
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <div className="form-text">Ingrese nombre completo</div>
          </div>

          {/* Email */}
          <div className="correo mb-3">
            <label className="form-label">Correo</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="form-text">Ingrese correo correctamente</div>
          </div>

          {/* Mensaje */}
          <div className="mensaje mb-3">
            <label className="form-label">Mensaje</label>
            <textarea
              className="form-control"
              rows={3}
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
            ></textarea>
            <div className="form-text">Ingrese el contenido del mensaje</div>
          </div>

          <button type="submit" className="btn btn-primary mt-3">
            Enviar
          </button>
        </form>
      </section>
    </body>
  );
}
