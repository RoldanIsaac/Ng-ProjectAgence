import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, map, of } from 'rxjs';
import {
  Usuario,
  Fatura,
  Os,
  CaoSalario,
  ReceitaLiquida,
} from './core/interfaces/common';
import { DateRange } from './core/interfaces/date';
import { DateUtilsService } from './services/date-utils.service';
import { caoFaturas } from './api/mock';
import { MockDataService } from './api/mock-data.service';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private apiUrl = 'http://localhost:3000/faturas'; // tu endpoint JSON o API
  dateUtils = inject(DateUtilsService);
  mockService = inject(MockDataService);

  constructor(private http: HttpClient) {}

  getConsultants(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>('/api/consultants');
  }

  getFaturas(): Observable<Fatura[]> {
    return this.http.get<Fatura[]>('/api/faturas');
  }

  getOs(): Observable<Os[]> {
    return this.http.get<Os[]>('/api/os');
  }

  getSalarios(): Observable<CaoSalario[]> {
    return this.http.get<CaoSalario[]>('/api/salarios');
  }

  /**
   * Obtiene todas las facturas y calcula la receita líquida por mes
   */
  getReceitaLiquidaPorMes(): Observable<any[]> {
    return this.http.get<Fatura[]>(this.apiUrl).pipe(
      map((faturas) => {
        // Agrupamos por mes-año
        const resultado: Record<string, number> = {};

        faturas.forEach((f) => {
          const fecha = new Date(f.data_emissao);
          const mesAno = `${fecha.getFullYear()}-${(fecha.getMonth() + 1)
            .toString()
            .padStart(2, '0')}`;

          // Receita líquida = valor - (valor * impuesto%)
          const receitaLiquida = f.valor - (f.valor * f.total_imp_inc) / 100;

          if (!resultado[mesAno]) {
            resultado[mesAno] = 0;
          }
          resultado[mesAno] += receitaLiquida;
        });

        // Lo convertimos en array [{ mes: '2007-01', receita: ... }]
        return Object.entries(resultado).map(([mes, receita]) => ({
          mes,
          receita: receita.toFixed(2),
        }));
      })
    );
  }

  /**
   * @description
   * Genera el reporte por consultores filtrados para un mes de referencia.
   * month: 1-12, year: 4 dígitos
   */
  generateReport(consultors: string[], dateRange: DateRange): Observable<any> {
    // Get all months in the date range
    const months = this.dateUtils.getMonthsInDateRange(dateRange);

    const observables = consultors.map((consultor) => {
      // Get all faturas for each consultor, by month
      return this.getFaturasForConsultor(consultor).pipe(
        map((consultorFaturas) => {
          // Debug
          // console.log(`Faturas for consultor ${consultor}:`, consultorFaturas);
          const receitaLiquidas = this.getReceitaLiquidaByDate(
            consultorFaturas,
            months
          );

          // Debug
          // console.log(
          //   `Receita líquida for consultor ${consultor}:`,
          //   receitaLiquidas
          // );

          return { consultor, receitaLiquidas };
        })
      );
    });

    return forkJoin(observables);
  }

  getFaturasForConsultor(consultor: string): Observable<Fatura[]> {
    return new Observable<Fatura[]>((subscriber) => {
      this.mockService.getFaturas().subscribe({
        next: (faturas) => {
          if (!faturas) {
            subscriber.next([]);
            subscriber.complete();
            return;
          }

          // Filtrar por consultor
          const consultorFaturas = faturas.filter(
            (fat) => fat.co_cliente !== consultor
          );

          subscriber.next(consultorFaturas);
          subscriber.complete();
        },
        error: (err) => {
          subscriber.error(err);
        },
      });
    });
  }

  getReceitaLiquidaByDate(
    faturas: Fatura[],
    months: { month: number; year: number }[]
  ): ReceitaLiquida[] {
    const receitaLiquidas: ReceitaLiquida[] = [];

    months.forEach(({ month, year }) => {
      // Debug
      // console.log(`Processing ${month}/${year}`);

      let receitaLiquida = 0;
      faturas.forEach((fat: Fatura) => {
        // If the fatura is in the month and year
        if (
          !(
            this.dateUtils.isMonthEqual(fat.data_emissao, month) &&
            this.dateUtils.isYearEqual(fat.data_emissao, year)
          )
        ) {
          receitaLiquida += fat.valor - (fat.valor * fat.total_imp_inc) / 100;
        }
      });

      receitaLiquidas.push({
        month,
        year,
        receitaLiquida: Number(receitaLiquida.toFixed(2)),
      });
    });

    return receitaLiquidas;
  }
}
