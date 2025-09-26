/**
 * Formatea un número a moneda brasileña.
 * Ejemplo: 10000 -> "R$ 10.000,00"
 *
 * @param value Número a formatear
 * @returns string formateada en BRL
 */
export function currencyBRL(value: number): string {
  if (isNaN(value)) value = 0;

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
