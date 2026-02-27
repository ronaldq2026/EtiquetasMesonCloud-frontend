"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/mock-data";
import { defaultLabelConfig } from "@/lib/mock-data";
import { LabelPreview } from "@/components/label-preview";
import { fetchDemoProducto, printDemoEtiqueta } from "@/lib/api";

export function PosDemoPanel() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setMessage("");
        const row = await fetchDemoProducto();
        setProduct(row as Product);
      } catch (err: any) {
        setMessage(err?.message ?? "Error cargando producto demo");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handlePrint = async () => {
    try {
      setPrinting(true);
      setMessage("");
      const { status, result } = await printDemoEtiqueta();
      const trimmed = (result ?? "").toString().trim();
      setMessage(
        status === "printed"
          ? `Etiqueta enviada a impresión: ${trimmed || "OK"}`
          : `Respuesta inesperada: ${status || "desconocido"}`
      );
    } catch (err: any) {
      setMessage(err?.message ?? "Error al imprimir");
    } finally {
      setPrinting(false);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h3>POS — Producto e Impresión</h3>

      {/* BOTÓN REAL */}
      <button 
        onClick={handlePrint} 
        disabled={printing}
        style={{ 
          marginBottom: 16,
          padding: "10px 16px",
          backgroundColor: printing ? "#ccc" : "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          fontSize: "14px",
          fontWeight: "600",
          cursor: printing ? "not-allowed" : "pointer",
          transition: "background-color 0.2s ease"
        }}
        onMouseEnter={(e) => {
          if (!printing) {
            (e.target as HTMLButtonElement).style.backgroundColor = "#0056b3";
          }
        }}
        onMouseLeave={(e) => {
          if (!printing) {
            (e.target as HTMLButtonElement).style.backgroundColor = "#007bff";
          }
        }}
      >
        {printing ? "Imprimiendo…" : "Imprimir etiqueta demo"}
      </button>

      {/* ACCIONES */}
      <section style={{ marginBottom: 24 }}>
        <h4>Acciones</h4>
        <pre>GET /api/pos/producto-demo</pre>
        <pre>POST /api/pos/print-demo</pre>

        <strong>Endpoints:</strong>
        {!!message && (
          <div style={{ marginTop: 4, whiteSpace: "pre-wrap" }}>{message}</div>
        )}
      </section>

      {/* PRODUCTO */}
      <section>
        <h4>Producto</h4>

        {loading && <div>Cargando producto…</div>}

        {!loading && !product && (
          <div>No se encontró producto demo en el DBF.</div>
        )}

        {!loading && (
          <>
            <div>Nombre</div>
            <div>{product?.nombre ?? "-"}</div>

            <div>Descripción</div>
            <div>{product?.descripcion ?? "-"}</div>

            <div>Código</div>
            <div>{product?.codigo ?? "-"}</div>

            <div>Código de barras</div>
            <div>{product?.codigoBarras ?? "-"}</div>

            <div>Precio</div>
            <div>
              {typeof product?.precio === "number"
                ? `$ ${product.precio.toLocaleString("es-CL")}`
                : "-"}
            </div>
          </>
        )}

        {product && (
          <section style={{ marginTop: 24 }}>
            <h4>Vista previa</h4>
            <LabelPreview product={product} config={defaultLabelConfig} />
          </section>
        )}
      </section>
    </div>
  );
}
