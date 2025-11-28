// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";  

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, rememberMe }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Usuario o contraseña incorrectos");
        setLoading(false);
        return;
      }

      localStorage.setItem("sessionToken", data.token);

      if (rememberMe) localStorage.setItem("rememberMe", "true");
      else localStorage.removeItem("rememberMe");

      login({
        username: data.username,
        email: data.email,
      });

      router.refresh();
      setTimeout(() => router.push("/"), 100);

    } catch (err) {
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage:
          "linear-gradient(135deg, #003366 0%, #004488 50%, #002244 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Efectos de luz */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md bg-white shadow-2xl relative z-10 rounded-lg">
        <div className="p-8">
          
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <svg width="120" height="80" viewBox="0 0 120 80" className="w-full">
                <rect x="10" y="10" width="35" height="35" fill="#003366" rx="4" />
                <rect x="50" y="10" width="35" height="35" fill="#FFCC00" rx="4" />
                <rect x="10" y="50" width="35" height="20" fill="#E63946" rx="4" />
                <rect x="50" y="50" width="35" height="20" fill="#003366" rx="4" />
              </svg>
            </div>

            <h1 className="text-4xl font-bold text-blue-900 mb-2">SERCOP</h1>
            <p className="text-gray-600 text-sm font-medium">
              Sistema Oficial de Contratación Pública
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Módulo Facilitador de Contratación Pública
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Usuario
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ejemplo_usuario"
                required
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* CONTRASEÑA + ojo */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña
              </label>

              <Input
                type={showPassword ? "text" : "password"}   // ← AÑADIDO
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded pr-12 focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
              />

              {/* ICONO */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[42px] text-gray-600 hover:text-gray-800"
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-900 rounded cursor-pointer"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600 cursor-pointer">
                Recordar contraseña
              </label>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded text-sm">
                <p className="font-semibold">Error de autenticación</p>
                <p className="text-xs mt-1">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-bold py-2.5 rounded transition-all disabled:opacity-60"
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="mt-6 border-t pt-6">
            <p className="text-gray-600 text-sm text-center">
              ¿No tienes una cuenta?{" "}
              <Link href="/register" className="text-blue-900 font-bold hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              Portal oficial del SERCOP - República del Ecuador
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
