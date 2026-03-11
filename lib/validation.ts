import { LabelConfig } from './mock-data';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateLabelConfig(config: LabelConfig): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validar dimensiones
  if (config.width <= 0) {
    errors.push({
      field: 'width',
      message: 'El ancho debe ser mayor a 0mm',
    });
  }

  if (config.height <= 0) {
    errors.push({
      field: 'height',
      message: 'El alto debe ser mayor a 0mm',
    });
  }

  // Validar que al menos un campo esté visible
  const hasVisibleField =
    config.showProductName ||
    config.showGenericName ||
    config.showDosage ||
    config.showBatch ||
    config.showExpiry ||
    config.showManufacturer ||
    config.showPrice;

  if (!hasVisibleField) {
    errors.push({
      field: 'fields',
      message: 'Debes seleccionar al menos un campo para mostrar en la etiqueta',
    });
  }

  // Validar colores
  if (!config.backgroundColor || config.backgroundColor.length === 0) {
    errors.push({
      field: 'backgroundColor',
      message: 'Debes seleccionar un color de fondo',
    });
  }

  if (!config.textColor || config.textColor.length === 0) {
    errors.push({
      field: 'textColor',
      message: 'Debes seleccionar un color de texto',
    });
  }

  // Validar tamaño de fuente
  if (config.fontSize < 6 || config.fontSize > 72) {
    errors.push({
      field: 'fontSize',
      message: 'El tamaño de fuente debe estar entre 6 y 72',
    });
  }

  return errors;
}

export function isConfigValid(config: LabelConfig): boolean {
  return validateLabelConfig(config).length === 0;
}
