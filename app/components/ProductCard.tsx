'use client'
import Link from "next/link";
import React from "react";

type Product = {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
};

export default function ProductCard({ producto }: { producto: Product }) {
  return (
    <Link href={`/productos/${producto.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div
        className="card"
        style={{
          width: "100%",
          minWidth: 220,
          maxWidth: 300,
          height: 350,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          margin: "0 auto"
        }}
      >
        <img
          src={producto.imagen}
          alt={producto.nombre}
          style={{
            width: "100%",
            height: 180,
            objectFit: "cover"
          }}
        />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <h3 style={{ margin: "10px 0", fontSize: "1.1rem", wordBreak: "break-word" }}>{producto.nombre}</h3>
          <p>Aprende a programar</p>
          <p className="price" style={{ fontWeight: "bold", color: "#e63946" }}>${producto.precio.toLocaleString()}</p>
        </div>
      </div>
    </Link>
  );
}