'use client';

import { Product, LabelConfig } from '@/lib/mock-data';

interface LabelPreviewProps {
  product: Product;
  config: LabelConfig;
}

export function LabelPreview({ product, config }: LabelPreviewProps) {
  const ofertaVigente = product.oferta && new Date() <= new Date(product.oferta.vigenciaFin);

  return (
    <div className="flex justify-center items-center p-6 relative">
      {ofertaVigente && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10 animate-pulse">
          -{product.oferta?.descuentoPorcentaje}%
        </div>
      )}
      <div
        className="border-2 border-gray-300 overflow-hidden shadow-lg transition-all"
        style={{
          width: `${config.width}mm`,
          height: `${config.height}mm`,
          backgroundColor: config.backgroundColor,
          color: config.textColor,
        }}
      >
        <div
          className="p-3 h-full flex flex-col justify-between text-center"
          style={{ fontSize: `${config.fontSize}px` }}
        >
          {config.showProductName && (
            <div className="font-bold truncate">
              {product.nombre}
            </div>
          )}
          
          {config.showGenericName && (
            <div className="text-xs italic truncate">
              {product.descripcion}
            </div>
          )}
          
          {config.showDosage && (
            <div className="font-semibold truncate">
              Talla: {product.dosage}
            </div>
          )}
          
          {config.showManufacturer && (
            <div className="text-xs truncate">
              Lab: {product.laboratorio}
            </div>
          )}
          
          {config.showBatch && (
            <div className="text-xs truncate">
              Cod: {product.codigo}
            </div>
          )}
          
          {config.showExpiry && (
            <div className="text-xs truncate">
              Venc: {product.expiryDate}
            </div>
          )}          
			{config.showPrice && (
			  <div className="line price">
				{typeof product.precio === 'number'
				  ? `$ ${product.precio.toLocaleString('es-CL')}`
				  : '-'}
			  </div>
			)}
        </div>
      </div>
    </div>
  );
}
