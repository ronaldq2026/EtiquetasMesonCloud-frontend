'use client';

import { useState } from 'react';
import { Product, LabelConfig } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface LabelField {
  id: string;
  key: keyof LabelConfig;
  label: string;
  enabled: boolean;
}

interface LabelBuilderProps {
  product: Product;
  config: LabelConfig;
  onConfigChange: (config: LabelConfig) => void;
}

const availableFields: LabelField[] = [
  { id: '1', key: 'showProductName', label: 'Nombre del Producto', enabled: true },
  { id: '2', key: 'showGenericName', label: 'Descripción', enabled: true },
  { id: '3', key: 'showDosage', label: 'Talla/Tamaño', enabled: true },
  { id: '4', key: 'showBatch', label: 'Código de Producto', enabled: true },
  { id: '5', key: 'showExpiry', label: 'Fecha de Vencimiento', enabled: true },
  { id: '6', key: 'showManufacturer', label: 'Laboratorio', enabled: true },
  { id: '7', key: 'showPrice', label: 'Precio', enabled: true },
];

export function LabelBuilder({ product, config, onConfigChange }: LabelBuilderProps) {
  const [draggedField, setDraggedField] = useState<string | null>(null);
  const [builderOrder, setBuilderOrder] = useState<string[]>(
    availableFields.map(f => f.id)
  );

  const handleDragStart = (fieldId: string) => {
    setDraggedField(fieldId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedField) return;

    const draggedIndex = builderOrder.indexOf(draggedField);
    const targetIndex = builderOrder.indexOf(targetId);

    if (draggedIndex === targetIndex) return;

    const newOrder = [...builderOrder];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedField);
    setBuilderOrder(newOrder);
    setDraggedField(null);
  };

  const toggleFieldVisibility = (fieldId: string) => {
    const field = availableFields.find(f => f.id === fieldId);
    if (!field) return;

    const currentValue = config[field.key] as boolean;
    onConfigChange({
      ...config,
      [field.key]: !currentValue,
    });
  };

  const orderedFields = builderOrder
    .map(id => availableFields.find(f => f.id === id))
    .filter(Boolean) as LabelField[];

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle>Constructor Visual de Etiquetas</CardTitle>
        <CardDescription>Arrastra para reordenar campos, haz clic para alternar visibilidad</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4 space-y-2 min-h-80 border-2 border-dashed border-gray-300">
          {orderedFields.length > 0 ? (
            orderedFields.map((field) => {
              const isVisible = config[field.key] as boolean;
              return (
                <div
                  key={field.id}
                  draggable
                  onDragStart={() => handleDragStart(field.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, field.id)}
                  onClick={() => toggleFieldVisibility(field.id)}
                  className={`p-3 rounded-lg cursor-move transition-all ${
                    isVisible
                      ? 'bg-white border border-blue-300 shadow-sm hover:shadow-md'
                      : 'bg-gray-200 border border-gray-400 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{field.label}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      isVisible 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-300 text-gray-700'
                    }`}>
                      {isVisible ? 'Visible' : 'Oculto'}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              No hay campos disponibles
            </div>
          )}
        </div>

        {/* Preview of reordered label */}
        <div className="border rounded-lg p-4 bg-white">
          <p className="text-xs font-semibold text-gray-600 mb-3">Vista Previa de Etiqueta (Reordenada)</p>
          <div className="space-y-2 text-sm">
            {orderedFields.map((field) => {
              const isVisible = config[field.key] as boolean;
              if (!isVisible) return null;

              let value = '';
              switch (field.key) {
                case 'showProductName':
                  value = product.nombre;
                  break;
                case 'showGenericName':
                  value = product.descripcion;
                  break;
                case 'showDosage':
                  value = `Talla: ${product.dosage}`;
                  break;
                case 'showBatch':
                  value = `Código: ${product.codigo}`;
                  break;
                case 'showExpiry':
                  value = `Venc: ${product.expiryDate}`;
                  break;
                case 'showManufacturer':
                  value = product.laboratorio;
                  break;
                case 'showPrice':
                  value = `$${product.precio.toLocaleString('es-CL')}`;
                  break;
              }

              return (
                <div key={field.id} className="truncate">
                  <span className="text-gray-500">{field.label}:</span> {value}
                </div>
              );
            })}
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setBuilderOrder(availableFields.map(f => f.id));
          }}
        >
          Reiniciar Orden
        </Button>
      </CardContent>
    </Card>
  );
}
