'use client';

import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.clear();
    router.replace('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">

          {/* IZQUIERDA */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">Fa</span>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Impresión de Etiquetas
              </h1>
              <p className="text-sm text-gray-500">
                Farmacias Ahumada
              </p>
            </div>
          </div>

          {/* DERECHA */}
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-red-600 hover:underline"
          >
            Cerrar sesión
          </button>

        </div>
      </div>
    </header>
  );
}
