'use client'
import Link from "next/link";
import React from "react";

type Product = {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  oferta?: boolean;
  descuento?: number;
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
          margin: "0 auto",
          overflow: 'hidden'
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
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 12, alignItems: 'center', textAlign: 'center' }}>
          <h3 style={{ margin: "6px 0", fontSize: "1.05rem", wordBreak: "break-word" }}>{producto.nombre}</h3>
          <p style={{ margin: '6px 0', color: '#555' }}>Aprende a programar</p>
          {producto.oferta && producto.descuento && producto.descuento > 0 ? (
            <>
              <p className="price" style={{ fontWeight: "bold", color: "#d32f2f", marginBottom: 2 }}>
                ${Math.round(producto.precio * (1 - producto.descuento / 100)).toLocaleString()} <span style={{ color: '#1976d2', fontSize: 14, marginLeft: 6 }}>({producto.descuento}% OFF)</span>
              </p>
              <div style={{ textDecoration: 'line-through', color: '#888', fontSize: 13, marginBottom: 6 }}>${producto.precio.toLocaleString()}</div>
            </>
          ) : (
            <p className="price" style={{ fontWeight: "bold", color: "#e63946", marginBottom: 6 }}>${producto.precio.toLocaleString()}</p>
          )}
        </div>
      </div>
    </Link>
  );
}