import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'brDate',
  pure: true,
})
export class BrDatePipe implements PipeTransform {
  /**
   * Convierte una fecha a formato dd/MM/yyyy
   * @param value Date | string | number
   * @returns string
   */
  transform(value: Date | string | number | null | undefined): string {
    if (!value) return '';

    let date: Date;

    if (value instanceof Date) {
      date = value;
    } else {
      date = new Date(value);
    }

    if (isNaN(date.getTime())) {
      return String(value); // no es fecha válida
    }

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
}
