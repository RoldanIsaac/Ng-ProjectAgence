import { Injectable } from '@angular/core';
import { DateRange } from '../core/interfaces/date';

@Injectable({
  providedIn: 'root',
})
export class DateUtilsService {
  getMonthsInDateRange(dateRange: {
    from: string;
    to: string;
  }): { month: number; year: number }[] {
    const parseDate = (dateStr: string): Date => {
      const [day, month, year] = dateStr.split('/').map(Number);
      return new Date(year, month - 1, day); // month - 1 porque en JS enero=0
    };

    const fromDate = parseDate(dateRange.from);
    const toDate = parseDate(dateRange.to);

    const months: { month: number; year: number }[] = [];

    // Normalizamos al primer día del mes
    let current = new Date(fromDate.getFullYear(), fromDate.getMonth(), 1);
    const end = new Date(toDate.getFullYear(), toDate.getMonth(), 1);

    while (current <= end) {
      months.push({
        month: current.getMonth() + 1,
        year: current.getFullYear(),
      });

      // Avanzar al siguiente mes
      current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    }

    return months;
  }
  isMonthEqual(dateString: string, month: number): boolean {
    // dateString esperado en formato 'YYYY-MM-DD'
    const date = new Date(dateString);

    // En JavaScript getMonth() devuelve 0 = Enero, 11 = Diciembre
    const monthFromDate = date.getMonth() + 1;

    return monthFromDate === month;
  }

  isYearEqual(dateString: string, year: number): boolean {
    // dateString esperado en formato 'YYYY-MM-DD'
    const date = new Date(dateString);

    const yearFromDate = date.getFullYear();

    return yearFromDate === year;
  }
}
