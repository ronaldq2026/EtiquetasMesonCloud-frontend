// components/excel-uploader.tsx
'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Upload } from 'lucide-react';
import { getExcelStatus, uploadMesonExcel, MesonExcelSummary } from '@/lib/api';

interface ExcelUploaderProps {
  userName?: string;                 // para logging en backend
  onUploaded?: (summary: MesonExcelSummary) => void;
  className?: string;
}

export function ExcelUploader({
  userName = 'unknown',
  onUploaded,
  className,
}: ExcelUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<MesonExcelSummary | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // carga estado al montar (opcional)
  // useEffect(() => { getExcelStatus().then(setSummary).catch(() => {}) }, []);

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const s = await uploadMesonExcel(file, userName);
      setSummary(s);
      onUploaded?.(s);
    } catch (e: any) {
      setError(e?.message || 'Error cargando Excel');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={className}>
      <input
        ref={fileRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleUpload(f);
          if (fileRef.current) fileRef.current.value = '';
        }}
      />
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Cargando Excel...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Cargar Excel de imprimibles
            </>
          )}
        </Button>

        {summary && (
          <span className="text-xs text-gray-600">
            Imprimibles: <b>{summary.count}</b>
            {summary.lastUpdated && (
              <> · Última carga: {new Date(summary.lastUpdated).toLocaleString()}</>
            )}
          </span>
        )}
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
}