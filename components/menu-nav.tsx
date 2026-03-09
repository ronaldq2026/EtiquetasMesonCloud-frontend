'use client';

import { Button } from '@/components/ui/button';
import { Search, Database, FileText } from 'lucide-react';

interface MenuNavProps {
  activeMenu: 'search' | 'database' | 'file';
  onMenuChange: (menu: 'search' | 'database' | 'file') => void;
}

export function MenuNav({ activeMenu, onMenuChange }: MenuNavProps) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 py-4">
          <Button
            variant={activeMenu === 'search' ? 'default' : 'outline'}
            onClick={() => onMenuChange('search')}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Búsqueda Manual
          </Button>
          
          <Button
            variant={activeMenu === 'database' ? 'default' : 'outline'}
            onClick={() => onMenuChange('database')}
            className="flex items-center gap-2"
          >
            <Database className="h-4 w-4" />
            Leer Base de Datos
          </Button>
          
          <Button
            variant={activeMenu === 'file' ? 'default' : 'outline'}
            onClick={() => onMenuChange('file')}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Cargar Archivo TXT
          </Button>
        </div>
      </div>
    </div>
  );
}
