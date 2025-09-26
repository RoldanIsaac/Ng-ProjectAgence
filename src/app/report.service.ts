import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { Usuario, Fatura, Os, CaoSalario } from './core/interfaces/common';

@Injectable({ providedIn: 'root' })
export class ReportService {
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
   * Genera el reporte por consultores filtrados para un mes de referencia.
   * month: 1-12, year: 4 dígitos
   */
  generateReportForMonth(consultantIds: number[], month: number, year: number) {
    return forkJoin({
      faturas: this.getFaturas(),
      os: this.getOs(),
      salarios: this.getSalarios(),
    }).pipe(
      map(({ faturas, os, salarios }) => {
        // filtrar faturas por mes/año y por consultores (atraves de OS)
        const osMap = new Map<number, Os>();
        os.forEach((o) => osMap.set(o.co_os, o));

        // agrupar por consultor
        const reportMap = new Map<
          number,
          {
            co_usuario: number;
            nome?: string;
            total_valor: number; // sum VALOR raw
            receita_liquida: number; // sum of VALOR*(1 - TOTAL_IMP_INC/100)
            comissao_total: number;
            custo_fixo: number; // from salarios
          }
        >();

        faturas.forEach((f) => {
          const dt = new Date(f.data_emissao);
          if (dt.getMonth() + 1 !== month || dt.getFullYear() !== year) return;

          const osObj = osMap.get(f.co_os);
          if (!osObj) return;
          const consultorId = osObj.co_usuario;
          if (consultantIds.length > 0 && !consultantIds.includes(consultorId))
            return;

          const valor = Number(f.valor ?? 0);
          const totalImp = Number(f.total_imp_inc ?? 0); // porcentaje
          const comissaoPct = Number(f.comissao_cn ?? 0); // porcentaje

          const receita_liq = valor * (1 - totalImp / 100);
          const comissao = receita_liq * (comissaoPct / 100);

          const prev = reportMap.get(consultorId) ?? {
            co_usuario: consultorId,
            total_valor: 0,
            receita_liquida: 0,
            comissao_total: 0,
            custo_fixo: 0,
          };

          prev.total_valor += valor;
          prev.receita_liquida += receita_liq;
          prev.comissao_total += comissao;
          reportMap.set(consultorId, prev);
        });

        // asignar custo_fixo por consultor desde salarios
        const salarioMap = new Map<string, number>();
        salarios.forEach((s) =>
          salarioMap.set(s.co_usuario, Number(s.brut_salario ?? 0))
        );

        const report = Array.from(reportMap.values()).map((r) => {
          r.custo_fixo = 0;
          //   r.custo_fixo = salarioMap.get(r.co_usuario) ?? 0;
          const lucro = r.receita_liquida - (r.custo_fixo + r.comissao_total);
          return {
            ...r,
            lucro,
          };
        });

        // calcular custo fixo medio (promedio) sobre consultores involucrados
        const totalCusto = report.reduce((s, r) => s + r.custo_fixo, 0);
        const custoFixoMedio = report.length ? totalCusto / report.length : 0;

        return { report, custoFixoMedio };
      })
    );
  }
}
