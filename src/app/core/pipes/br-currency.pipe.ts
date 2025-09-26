import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'brCurrency',
})
export class BrCurrencyPipe implements PipeTransform {
  /**
   * @param value number | string - valor a formatear
   * @param showSymbol boolean - si debe mostrar "R$" (default true)
   * @param decimals number - cantidad de decimales (default 2)
   */
  transform(
    value: number | string | null | undefined,
    showSymbol = true,
    decimals = 2
  ): string {
    if (value === null || value === undefined || value === '') return '';

    // Normalizar entrada: aceptar strings como "10000", "10.000,00", "10000.5", etc.
    let n: number;
    if (typeof value === 'string') {
      // quitar todo lo que no sea dígito, punto o coma o signo menos
      const cleaned = value.replace(/[^\d\-,.]/g, '').trim();

      // Si contiene coma y punto, asumimos formato pt-BR (10.000,00) => reemplazar '.' y convertir ',' -> '.'
      if (cleaned.indexOf(',') > -1 && cleaned.indexOf('.') > -1) {
        // eliminar puntos de miles y convertir coma decimal a punto
        n = Number(cleaned.replace(/\./g, '').replace(',', '.'));
      } else if (cleaned.indexOf(',') > -1 && cleaned.indexOf('.') === -1) {
        // "1000,50" -> "1000.50"
        n = Number(cleaned.replace(',', '.'));
      } else {
        // "1000.50" o "1000" -> parse directamente
        n = Number(cleaned);
      }
    } else {
      n = Number(value);
    }

    if (!isFinite(n) || isNaN(n)) {
      // si no es un número válido, devolver el input original (o vacío)
      return String(value);
    }

    const options: Intl.NumberFormatOptions = {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    };

    // usamos estilo currency para garantizar formato pt-BR
    const formatter = new Intl.NumberFormat('pt-BR', {
      ...options,
      style: 'currency',
      currency: 'BRL',
    });
    let formatted = formatter.format(n); // -> "R$ 10.000,00"

    if (!showSymbol) {
      // quitar símbolo "R$" (puede venir con espacio o NBSP)
      formatted = formatted.replace(/^(R\$\s?|\u00A0)/, '').trim();
    }

    return formatted;
  }
}
