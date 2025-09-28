import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, map, of, zip } from 'rxjs';
import {
  Usuario,
  Fatura,
  Os,
  CaoSalario,
  ReceitaLiquida,
  Comissao,
  FaturaEnriched,
} from '../core/interfaces/common';
import { DateRange } from '../core/interfaces/date';
import { DateUtilsService } from '../services/date-utils.service';
import { MockDataService } from '../api/mock-data.service';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private apiUrl = 'http://localhost:3000/';
  dateUtils = inject(DateUtilsService);
  mockService = inject(MockDataService);

  constructor(private http: HttpClient) {}

  getConsultors(): Observable<Usuario[]> {
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

  // ------------------------------------------------------------------------------------------
  // @ Mock Data Methods
  // ------------------------------------------------------------------------------------------

  /**
   * @description
   * Genera el reporte por consultores filtrados para un rango de fecha.
   */
  generateReport(consultors: string[], dateRange: DateRange): Observable<any> {
    // Get all months in the date range
    const months = this.dateUtils.getMonthsInDateRange(dateRange);

    const observables = consultors.map((consultor) => {
      // Get all faturas for each consultor, by month
      return this.getFaturasForConsultor(consultor).pipe(
        map((consultorFaturas: FaturaEnriched[]) => {
          // Debug
          console.log(`Faturas for consultor ${consultor}:`, consultorFaturas);

          // Receta liquida
          const receitaLiquidas = this.getReceitaLiquidaByDate(
            consultorFaturas,
            months
          );

          // Comissaos
          const comissoes = this.getComissaoByDate(consultorFaturas, months);

          // Unir receitaLiquidas y comissoes en una sola estructura
          const info = months.map((m) => {
            const receita =
              receitaLiquidas.find(
                (r) => r.month === m.month && r.year === m.year
              )?.receitaLiquida ?? 0;

            const comissao =
              comissoes.find((c) => c.month === m.month && c.year === m.year)
                ?.comissao ?? 0;

            return {
              month: m.month,
              year: m.year,
              receitaLiquida: receita,
              // Tomamos el salario fijo de la primera factura (es el mismo para todas)
              salarioFixo: consultorFaturas[0]?.salarioFixo ?? 0,
              comissao: comissao,
              lucro:
                receita - (consultorFaturas[0]?.salarioFixo ?? 0 + comissao),
            };
          });

          return { consultor, info };
        })
      );
    });

    return forkJoin(observables);
  }

  // ------------------------------------------------------------------------------------------
  // @ Faturas
  // ------------------------------------------------------------------------------------------

  /**
   * @description
   *
   */
  getFaturasForConsultor(consultor: string): Observable<FaturaEnriched[]> {
    return zip([
      this.mockService.getFaturas(),
      this.mockService.getOS(),
      this.mockService.getSalarios(),
    ]).pipe(
      map(([faturas, ordens, salarios]) => {
        if (!faturas || !ordens || !salarios) return [];

        // Enriquecer facturas con consultor
        const enriched = faturas.map((fat) => {
          const os = ordens.find((orden) => orden.co_os === fat.co_os);

          const salario = os
            ? salarios.find((salario) => salario.co_usuario === os.co_usuario)
            : null;

          return {
            ...fat,
            co_usuario: os ? os.co_usuario : null,
            salarioFixo: salario ? salario.brut_salario : 0,
          };
        });

        // Filtrar por consultor
        return enriched.filter((fat) => fat.co_usuario === consultor);
      })
    );
  }

  // ------------------------------------------------------------------------------------------
  // @ Receita Liquida
  // ------------------------------------------------------------------------------------------

  /**
   * @description
   *
   */
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
          receitaLiquida += this.calcFaturaReceitaLiquida(
            fat.valor,
            fat.total_imp_inc
          );
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

  /**
   * @description
   *
   */
  getComissaoByDate(
    faturas: Fatura[],
    months: { month: number; year: number }[]
  ) {
    const commissao: Comissao[] = [];

    months.forEach(({ month, year }) => {
      let totalComissao = 0;
      faturas.forEach((fat: Fatura) => {
        // If the fatura is in the month and year
        // Calcular comisión total del mes
        if (
          !(
            this.dateUtils.isMonthEqual(fat.data_emissao, month) &&
            this.dateUtils.isYearEqual(fat.data_emissao, year)
          )
        ) {
          totalComissao += this.calcFaturaCommission(
            fat.valor,
            fat.total_imp_inc,
            fat.comissao_cn
          );
        }
      });

      commissao.push({
        month,
        year,
        comissao: totalComissao,
      });
    });

    return commissao;
  }

  // ------------------------------------------------------------------------------------------
  // @ Equations
  // ------------------------------------------------------------------------------------------

  /**
   * @description
   *
   */
  calcFaturaCommission(
    valor: number,
    totalImpInc: number,
    commisisonCn: number
  ): number {
    const commission = (valor - valor * totalImpInc) * commisisonCn;
    return commission;
  }

  /**
   * @description
   *
   */
  calcFaturaReceitaLiquida(valor: number, totalImpInc: number): number {
    const receitaLiquida = valor - (valor * totalImpInc) / 100;
    return receitaLiquida;
  }
}
