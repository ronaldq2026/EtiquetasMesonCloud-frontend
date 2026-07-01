'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Product, defaultLabelConfig } from '@/lib/product';
import type { LabelConfig } from '@/lib/product';

import { ProductSearch } from '@/components/product-search';
import { PrintExport } from '@/components/print-export';
import { TabDatabaseRead } from '@/components/tab-database-read';
import { TabFileUpload } from '@/components/tab-file-upload';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn =
      typeof window !== 'undefined' &&
      sessionStorage.getItem('loggedIn') === 'true';

    if (!isLoggedIn) {
      router.replace('/login');
    }
  }, [router]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [labelConfig] = useState<LabelConfig>(defaultLabelConfig);
  const [activeMenu, setActiveMenu] =
    useState<'manual' | 'database' | 'file'>('manual');
  const [canUploadPAI] = useState(() =>
    typeof window !== 'undefined' && sessionStorage.getItem('canUploadPAI') === 'true'
  );

  const handleLogout = () => {
    sessionStorage.clear();
    router.replace('/login');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600">
                <span className="text-lg font-bold text-white">Fa</span>
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Impresión de Etiquetas
                </h1>
                <p className="text-sm text-gray-500">Farmacias Ahumada</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="text-sm font-medium text-red-600 hover:underline"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <div className="sticky top-16 z-40 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Tabs
            value={activeMenu}
            onValueChange={(val) =>
              setActiveMenu(val as 'manual' | 'database' | 'file')
            }
            className="w-full"
          >
            <TabsList className="grid h-auto w-full grid-cols-3 gap-3 bg-transparent p-0">
              <TabsTrigger
                value="manual"
                className="min-h-[56px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-700 data-[state=active]:border-red-600 data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                Búsqueda Manual
              </TabsTrigger>

              <TabsTrigger
                value="database"
                className="min-h-[56px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-700 data-[state=active]:border-red-600 data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                Carga Automatica de Ofertas
              </TabsTrigger>

              <TabsTrigger
                value="file"
                className="min-h-[56px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-700 data-[state=active]:border-red-600 data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                Cargar Archivo Etiqueta (RF)
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {activeMenu === 'manual' && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <ProductSearch
                selectedProduct={selectedProduct}
                onProductSelect={setSelectedProduct}
              />
            </div>

            <div className="space-y-6 lg:col-span-2">
              <PrintExport product={selectedProduct} config={labelConfig} />
            </div>
          </div>
        )}

        {activeMenu === 'database' && <TabDatabaseRead canUploadPAI={canUploadPAI} />}

        {activeMenu === 'file' && <TabFileUpload />}
      </div>
    </main>
  );
}
