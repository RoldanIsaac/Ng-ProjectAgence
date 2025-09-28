import { Injectable } from '@angular/core';
import { DateRange } from '../core/interfaces/date';

@Injectable({
  providedIn: 'root',
})
export class DateUtilsService {
  getMonthsInDateRange(
    dateRange: DateRange
  ): { month: number; year: number }[] {
    const parseDate = (dateStr: string): Date => {
      const [day, month, year] = dateStr.split('/').map(Number);
      return new Date(year, month - 1, day);
    };

    const fromDate = parseDate(dateRange.from);
    const toDate = parseDate(dateRange.to);

    const months: { month: number; year: number }[] = [];

    let current = new Date(fromDate.getFullYear(), fromDate.getMonth(), 1);
    const end = new Date(toDate.getFullYear(), toDate.getMonth(), 1);

    while (current <= end) {
      months.push({
        month: current.getMonth() + 1,
        year: current.getFullYear(),
      });

      current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    }

    return months;
  }

  isMonthEqual(dateString: string, month: number): boolean {
    const date = new Date(dateString);
    const monthFromDate = date.getMonth() + 1;
    return monthFromDate === month;
  }

  isYearEqual(dateString: string, year: number): boolean {
    const date = new Date(dateString);
    const yearFromDate = date.getFullYear();
    return yearFromDate === year;
  }
}
