"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const response = await fetch("http://localhost:3000/api/accesos/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const text = await response.text();
  console.log("LOGIN RESPONSE:", text);

  if (!response.ok) {
    alert("Acceso no autorizado");
    return;
  }

  // por ahora solo redirige o muestra mensaje
  sessionStorage.setItem("loggedIn", "true");
  router.replace("/");
};

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>Sistema de Impresión de Etiquetas</h2>
        <p style={styles.subtitle}>Acceso Corporativo</p>

        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button}>
          Ingresar
        </button>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f8",
  },
  card: {
    width: 360,
    padding: 24,
    background: "#ffffff",
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  title: {
    marginBottom: 6,
  },
  subtitle: {
    marginBottom: 22,
    color: "#666",
    fontSize: 14,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 12,
    fontSize: 14,
  },
  button: {
    width: "100%",
    padding: 10,
    fontSize: 14,
    background: "#d71920", // rojo FA
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};
