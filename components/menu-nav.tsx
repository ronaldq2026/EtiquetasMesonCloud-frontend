'use client';
import { Button } from '@/components/ui/button';
import { Search, Database, FileText } from 'lucide-react';

interface MenuNavProps {
  activeMenu: 'search' | 'database' | 'file';
  onMenuChange: (menu: 'search' | 'database' | 'file') => void;
}

export function MenuNav({ activeMenu, onMenuChange }: MenuNavProps) {
  return (
    <div className="flex items-center gap-2">
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
        Lectura del Archivo Maestro Centralizado
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
  );
}