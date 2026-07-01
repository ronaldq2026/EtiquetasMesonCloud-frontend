"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "changePwd">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdminFromMenuXml = (menuXml?: string | null) => {
    if (!menuXml) return false;
    return /tit\s*=\s*["']Admin["']/i.test(menuXml);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/api/accesos/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("LOGIN RESPONSE:", data);

      if (!response.ok || !data.ok) {
        setError(data.mensaje || "Acceso no autorizado");
        return;
      }

      if (data.passwordChangeRequired) {
        setMode("changePwd");
        setLoading(false);
        return;
      }

      const isAdmin = isAdminFromMenuXml(data.menuXml);
      console.log("ROL DETECTADO:", isAdmin ? "Admin" : "Farmacia");
      sessionStorage.setItem("loggedIn", "true");
      sessionStorage.setItem("canUploadPAI", isAdmin ? "true" : "false");
      router.replace("/");
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    console.log("[LOGIN] CambioPWD payload frontend:", {
      username,
      passwordLength: password.length,
      newPasswordLength: newPassword.length,
      confirmPasswordLength: confirmPassword.length,
    });

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas nuevas no coinciden");
      setLoading(false);
      return;
    }

    if (newPassword.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/accesos/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, newPassword }),
      });

      const data = await response.json();
      console.log("CHANGE PWD RESPONSE:", data);

      if (!response.ok || !data.ok) {
        setError(data.mensaje || "Error al cambiar contraseña");
        return;
      }

      const isAdmin = isAdminFromMenuXml(data.menuXml);
      console.log("ROL DETECTADO:", isAdmin ? "Admin" : "Farmacia");
      sessionStorage.setItem("loggedIn", "true");
      sessionStorage.setItem("canUploadPAI", isAdmin ? "true" : "false");
      router.replace("/");
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setMode("login");
    setError(null);
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div style={styles.container}>
      <form
        onSubmit={mode === "changePwd" ? handleChangePassword : handleLogin}
        style={styles.card}
      >
        <h2 style={styles.title}>Sistema de Impresión de Etiquetas</h2>
        <p style={styles.subtitle}>Acceso Corporativo</p>

        {mode === "changePwd" && (
          <div style={styles.warning}>
            Su usuario requiere cambio de contraseña.
            Ingrese una nueva contraseña para continuar.
          </div>
        )}

        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
          required
          disabled={mode === "changePwd"}
        />

        <input
          type="password"
          placeholder={mode === "changePwd" ? "Contraseña actual" : "Contraseña"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />

        {mode === "changePwd" && (
          <>
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={styles.input}
              required
              minLength={4}
            />
            <input
              type="password"
              placeholder="Confirmar nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              required
              minLength={4}
            />
          </>
        )}

        {error && <div style={styles.error}>{error}</div>}

        {mode === "changePwd" ? (
          <div style={styles.buttonGroup}>
            <button
              type="submit"
              disabled={loading}
              style={{ ...styles.button, flex: 1 }}
            >
              {loading ? "Cambiando..." : "Cambiar contraseña"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              style={{ ...styles.button, flex: 1, background: "#6b7280" }}
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        )}
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
    boxSizing: "border-box" as const,
  },
  button: {
    width: "100%",
    padding: 10,
    fontSize: 14,
    background: "#d71920",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  buttonGroup: {
    display: "flex",
    gap: 8,
  },
  warning: {
    marginBottom: 12,
    padding: 10,
    background: "#fff3cd",
    border: "1px solid #ffc107",
    borderRadius: 4,
    color: "#856404",
    fontSize: 13,
    textAlign: "left" as const,
  },
  error: {
    marginBottom: 12,
    padding: 10,
    background: "#f8d7da",
    border: "1px solid #f5c6cb",
    borderRadius: 4,
    color: "#721c24",
    fontSize: 13,
    textAlign: "left" as const,
  },
};
