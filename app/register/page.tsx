'use client';'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Error al crear la cuenta');
        return;
      }

      setUserEmail(formData.email);
      setStep('verify');
      setSuccessMessage(`Se ha enviado un código de verificación a ${formData.email}`);
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!verificationCode) {
      setError('Por favor ingresa el código de verificación');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          code: verificationCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Código incorrecto');
        return;
      }

      setSuccessMessage('¡Email verificado correctamente! Redirigiendo al login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/resend-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Error al reenviar el código');
        return;
      }

      setSuccessMessage('Se ha reenviado el código de verificación a tu correo');
      setVerificationCode('');
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-linear-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-4"
      style={{
        backgroundImage: 'linear-gradient(135deg, #003366 0%, #004488 50%, #002244 100%)',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md bg-white shadow-2xl relative z-10 rounded-lg">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <svg width="120" height="80" viewBox="0 0 120 80" className="w-full">
                <rect x="10" y="10" width="35" height="35" fill="#003366" rx="4"/>
                <rect x="50" y="10" width="35" height="35" fill="#FFCC00" rx="4"/>
                <rect x="10" y="50" width="35" height="20" fill="#E63946" rx="4"/>
                <rect x="50" y="50" width="35" height="20" fill="#003366" rx="4"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">SERCOP</h1>
            <p className="text-gray-600 text-sm">Crear Nueva Cuenta</p>
          </div>

          {step === 'register' ? (
            <form onSubmit={handleRegister} className="space-y-4">

              {/* Usuario */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de Usuario
                </label>
                <Input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="mi_usuario"
                  required
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="tu@correo.com"
                  required
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <Input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  placeholder="+593 9 9999 9999"
                  required
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Contraseña con ojo */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>

                <Input
                  type={showPassword ? "text" : "password"} // ← AÑADIDO
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded pr-12 focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[42px] text-gray-600 hover:text-gray-800"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>

              {/* Confirmar contraseña con ojo */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Contraseña
                </label>

                <Input
                  type={showConfirmPassword ? "text" : "password"} // ← AÑADIDO
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded pr-12 focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-[42px] text-gray-600 hover:text-gray-800"
                >
                  {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-bold py-2.5 rounded transition-all disabled:opacity-60"
              >
                {loading ? 'Registrando...' : 'Registrarse'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-blue-900">
                  Se ha enviado un código de verificación a <strong>{userEmail}</strong>
                </p>
              </div>

              {successMessage && (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-800 px-4 py-3 rounded text-sm">
                  {successMessage}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código de Verificación
                </label>
                <Input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Ingresa el código de 6 dígitos"
                  maxLength={6}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded focus:border-blue-900 focus:ring-2 focus:ring-blue-100 text-center text-2xl tracking-widest"
                />
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-bold py-2.5 rounded transition-all disabled:opacity-60"
              >
                {loading ? 'Verificando...' : 'Verificar Código'}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleResendCode}
                disabled={loading}
                className="w-full border-2 border-blue-900 text-blue-900 hover:bg-blue-50"
              >
                Reenviar Código
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setStep('register');
                  setVerificationCode('');
                  setError('');
                  setSuccessMessage('');
                }}
                className="w-full"
              >
                Volver
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-blue-900 font-semibold hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
