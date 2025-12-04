
"use client";

import React, { useMemo, useState, useEffect, Suspense } from "react";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";
import SortSelector from "../components/SortSelector";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../globals.css';
import { useSearchParams } from 'next/navigation';
import { fetchJSON } from "../lib/api";

export default function ProductosPage() {
  return (
    <Suspense fallback={<div style={{padding: 40, textAlign: 'center'}}>Cargando productos...</div>}>
      <ProductosPageContent />
    </Suspense>
  );
}

function ProductosPageContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams?.get('categoria') || 'todos';
  const [categoria, setCategoria] = useState<string>(initialCat);
  const [orden, setOrden] = useState<string>("asc");
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // react to changes in the URL param if user navigates here with ?categoria=...
    const cat = searchParams?.get('categoria');
    if (cat) setCategoria(cat);
  }, [searchParams]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    fetchJSON('/producto')
      .then((data: any) => {
        if (!mounted) return;
        if (Array.isArray(data)) setProductos(data as any[]);
        else setProductos([]);
      })
      .catch((err) => {
        console.warn('No se pudo cargar la lista de productos desde la API:', err);
        setError('No se pudieron cargar los productos.');
        setProductos([]);
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false };
  }, []);

  const categorias = useMemo(() => {
    const cats = Array.from(new Set(productos.map((p) => p.categoria))).filter(Boolean) as string[];
    return ["todos", ...cats];
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    let list = categoria === "todos" ? [...productos] : productos.filter(p => p.categoria === categoria);
    list.sort((a, b) => (orden === "asc" ? a.precio - b.precio : b.precio - a.precio));
    return list;
  }, [categoria, orden, productos]);

  return (
    <div>
      {/* Título centrado */}
      <div className="titulo-productos">
        <h1>Nuestros Productos</h1>
      </div>

      {/* Filtros y contador centrados */}
      <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-2 mb-3" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <CategoryFilter categorias={categorias} value={categoria} onChange={setCategoria} />
        <SortSelector value={orden} onChange={setOrden} />
      </div>
      <div style={{textAlign:'center'}}>
        {loading ? (
          <span className="text-muted">Cargando productos...</span>
        ) : error ? (
          <span className="text-muted">{error}</span>
        ) : (
          <span className="text-muted">Mostrando {productosFiltrados.length} productos</span>
        )}
      </div>

      {/* Grid de productos usando tu CSS */}
      <div className="product-grid">
        {productosFiltrados.map((producto) => (
          <ProductCard key={producto.id} producto={producto} />
        ))}
      </div>
    </div>
  );
}