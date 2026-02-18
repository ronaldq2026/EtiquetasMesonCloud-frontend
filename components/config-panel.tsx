'use client';

import { useState } from 'react';
import { LabelConfig } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

function Checkbox({ id, checked, onChange }: { id: string; checked: boolean; onChange: () => void }) {
  return (
    <CheckboxPrimitive.Root
      id={id}
      checked={checked}
      onCheckedChange={onChange}
      className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
    >
      <CheckboxPrimitive.Indicator>
        <Check className="w-3 h-3 text-white" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

interface ConfigPanelProps {
  config: LabelConfig;
  onConfigChange: (config: LabelConfig) => void;
}

export function ConfigPanel({ config, onConfigChange }: ConfigPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleToggleField = (field: keyof LabelConfig) => {
    if (typeof config[field] === 'boolean') {
      onConfigChange({
        ...config,
        [field]: !config[field],
      });
    }
  };

  const handleNumberChange = (field: keyof LabelConfig, value: number) => {
    onConfigChange({
      ...config,
      [field]: value,
    });
  };

  const handleColorChange = (field: keyof LabelConfig, value: string) => {
    onConfigChange({
      ...config,
      [field]: value,
    });
  };

  return (
    <Card className="w-full h-full overflow-auto">
      <CardHeader className="pb-3">
        <CardTitle>Configuración de Etiqueta</CardTitle>
        <CardDescription>Personaliza tu etiqueta farmacéutica</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dimensions */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Dimensiones de la Etiqueta</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width" className="text-xs">Ancho (mm)</Label>
              <Input
                id="width"
                type="number"
                value={config.width}
                onChange={(e) => handleNumberChange('width', parseInt(e.target.value) || 0)}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height" className="text-xs">Alto (mm)</Label>
              <Input
                id="height"
                type="number"
                value={config.height}
                onChange={(e) => handleNumberChange('height', parseInt(e.target.value) || 0)}
                className="text-sm"
              />
            </div>
          </div>
        </div>

        {/* Font Size */}
        <div className="space-y-2">
          <Label htmlFor="fontSize" className="text-xs">Tamaño de Fuente (px)</Label>
          <Input
            id="fontSize"
            type="number"
            value={config.fontSize}
            onChange={(e) => handleNumberChange('fontSize', parseInt(e.target.value) || 0)}
            className="text-sm"
          />
        </div>

        {/* Colors */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Colores</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bgColor" className="text-xs">Fondo</Label>
              <div className="flex gap-2">
                <Input
                  id="bgColor"
                  type="color"
                  value={config.backgroundColor}
                  onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input
                  type="text"
                  value={config.backgroundColor}
                  onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                  className="text-xs flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="textColor" className="text-xs">Color del Texto</Label>
              <div className="flex gap-2">
                <Input
                  id="textColor"
                  type="color"
                  value={config.textColor}
                  onChange={(e) => handleColorChange('textColor', e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input
                  type="text"
                  value={config.textColor}
                  onChange={(e) => handleColorChange('textColor', e.target.value)}
                  className="text-xs flex-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Fields Selection */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Campos de Etiqueta</h3>
          <div className="space-y-3">
            {[
              { key: 'showProductName', label: 'Nombre del Producto' },
              { key: 'showGenericName', label: 'Descripción' },
              { key: 'showDosage', label: 'Talla/Tamaño' },
              { key: 'showBatch', label: 'Código de Producto' },
              { key: 'showExpiry', label: 'Fecha de Vencimiento' },
              { key: 'showManufacturer', label: 'Laboratorio' },
              { key: 'showPrice', label: 'Precio' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={config[key as keyof LabelConfig] as boolean}
                  onChange={() => handleToggleField(key as keyof LabelConfig)}
                />
                <Label htmlFor={key} className="text-sm font-normal cursor-pointer">
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Presets */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">Preestablecidos Rápidos</h3>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-left"
            onClick={() => onConfigChange({
              ...config,
              width: 100,
              height: 60,
              fontSize: 10,
            })}
          >
            Etiqueta Pequeña (100×60mm)
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-left"
            onClick={() => onConfigChange({
              ...config,
              width: 150,
              height: 100,
              fontSize: 12,
            })}
          >
            Etiqueta Mediana (150×100mm)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
