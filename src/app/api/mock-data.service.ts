import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, of } from 'rxjs';
import {
  cao_fatura,
  cao_os,
  cao_salario,
  cao_usuario,
  permissao_sistema,
} from './mock-data';
import { DateRange } from '../core/interfaces/date';
import { Os, Usuario } from '../core/interfaces/common';

@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  getUsuarios(): Observable<any> {
    return of(cao_usuario);
  }

  getPermissaoSistema(): Observable<any> {
    return of(permissao_sistema);
  }

  getFaturas(): Observable<any> {
    return of(cao_fatura);
  }

  getSalario(): Observable<any> {
    return of(cao_salario);
  }

  getOS(): Observable<any> {
    return of(cao_os);
  }

  getConsultors(): Observable<{
    success: boolean;
    data: any[];
    count: number;
  }> {
    return forkJoin({
      usuarios: of(cao_usuario),
      permissoes: of(permissao_sistema),
    }).pipe(
      map(({ usuarios, permissoes }) => {
        const result = usuarios.filter((u) =>
          permissoes.some(
            (p) =>
              p.co_usuario === u.co_usuario &&
              p.co_sistema === '1' &&
              p.in_ativo === 'S' &&
              ['0', '1', '2'].includes(p.co_tipo_usuario)
          )
        );

        return {
          success: true,
          data: result,
          count: result.length,
        };
      })
    );
  }

  /**
   * Converts dd/MM/yyyy format to Date
   */
  private parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  /**
   * Generates an array of months between two dates (dd/MM/yyyy format)
   */
  private getMonthsInRange(startDate: string, endDate: string): string[] {
    const months: string[] = [];

    // Parse dates dd/MM/yyyy
    const current = this.parseDate(startDate);
    const end = this.parseDate(endDate);

    if (isNaN(current.getTime()) || isNaN(end.getTime())) {
      throw new Error('Invalid date format. Must be dd/MM/yyyy');
    }

    // Normalizar al primer día del mes
    current.setDate(1);
    end.setDate(1);

    while (current <= end) {
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, '0');
      months.push(`${year}-${month}`);

      // Avanzar al siguiente mes
      current.setMonth(current.getMonth() + 1);
    }

    return months;
  }

  /**
   * Gets monthly data for a specific consultant
   */
  private getMonthlyData(
    consultorCode: string,
    month: string
  ): Observable<any> {
    const [year, monthNum] = month.split('-');
    const startDate = `${year}-${monthNum}-01`;

    // Calcular último día del mes
    const lastDay = new Date(Number(year), Number(monthNum), 0).getDate();
    const endDate = `${year}-${monthNum}-${String(lastDay).padStart(2, '0')}`;

    return forkJoin({
      faturas: this.getFaturas(),
      orders: this.getOS(),
    }).pipe(
      map(({ faturas, orders }) => {
        let valorTotal = 0;
        let totalImpuestos = 0;
        let receitaLiquida = 0;
        let comissao = 0;

        // Filtrar órdenes de servicio del consultor
        const ordersOfConsultor = orders.filter(
          (order: Os) => order.co_usuario == consultorCode
        );

        // Obtener los códigos de OS del consultor
        const consultorOsCodes = ordersOfConsultor.map(
          (order: Os) => order.co_os
        );

        console.log('Orders del consultor:', ordersOfConsultor);
        console.log('Códigos de OS:', consultorOsCodes);

        // Filtrar facturas que cumplan TODAS las condiciones:
        // 1. Están en el rango de fechas del mes
        // 2. Pertenecen a una OS del consultor
        const faturasDelMes = faturas.filter((fatura: any) => {
          let dataEmissao = fatura.data_emissao;
          if (dataEmissao && dataEmissao.toString().startsWith('0x')) {
            dataEmissao = this.hexToDate(dataEmissao);
          }

          const isInDateRange =
            dataEmissao && dataEmissao >= startDate && dataEmissao <= endDate;

          const isConsultorOS = consultorOsCodes.includes(fatura.co_os);

          return isInDateRange && isConsultorOS;
        });

        console.log('Facturas del mes filtradas:', faturasDelMes);

        // Calcular VALOR total de todas las facturas
        valorTotal = faturasDelMes.reduce((sum: number, fatura: any) => {
          const valor = Number(fatura.valor) || 0;
          return sum + valor;
        }, 0);

        // Calcular TOTAL_IMP_INC total
        totalImpuestos = faturasDelMes.reduce((sum: number, fatura: any) => {
          const valor = Number(fatura.valor) || 0;
          const impuestoPorcentaje = Number(fatura.total_imp_inc) || 0;
          const montoImpuesto = (valor * impuestoPorcentaje) / 100;
          return sum + montoImpuesto;
        }, 0);

        // RECEITA LIQUIDA = VALOR - TOTAL_IMP_INC
        receitaLiquida = valorTotal - totalImpuestos;

        // Calcular COMISIÓN total
        comissao = faturasDelMes.reduce((sum: number, fatura: any) => {
          const valor = Number(fatura.valor) || 0;
          const totalImpInc = Number(fatura.total_imp_inc) || 0; // porcentaje
          const comissaoCn = Number(fatura.comissao_cn) || 0; // porcentaje

          // Valor neto después de impuestos
          const valorLiquido = valor - (valor * totalImpInc) / 100;

          // Comisión de esta factura
          const comissaoFatura = (valorLiquido * comissaoCn) / 100;

          return sum + comissaoFatura;
        }, 0);

        console.log('Cálculos:', {
          valorTotal,
          totalImpuestos,
          receitaLiquida,
          comissao,
          cantidadFacturas: faturasDelMes.length,
        });

        return {
          valorTotal,
          totalImpuestos,
          receitaLiquida,
          comissao,
          cantidadFacturas: faturasDelMes.length,
          facturas: faturasDelMes, // para debugging
        };
      })
    );
  }

  /**
   * Gets the fixed salary of a consultant
   */
  private getFixedSalary(consultor: Usuario): Observable<number> {
    return this.getSalario().pipe(
      map((salarios) => {
        const salario = salarios.find(
          (s: any) => s.co_usuario === consultor.co_usuario
        );
        return salario ? parseFloat(salario.brut_salario) || 0 : 0;
      })
    );
  }

  /**
   * Converts hexadecimal date to YYYY-MM-DD format
   */
  private hexToDate(hexDate: string): string {
    if (!hexDate || !hexDate.toString().startsWith('0x')) {
      return hexDate;
    }

    // Remover '0x' y convertir hex a string
    const hex = hexDate.substring(2);
    let dateStr = '';

    for (let i = 0; i < hex.length; i += 2) {
      dateStr += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }

    return dateStr;
  }

  /**
   * Generates reports for consultants within a date range
   */
  public generateReport(
    consultors: Usuario[],
    dateRange: DateRange
  ): Observable<any> {
    try {
      const dateStart = dateRange.from;
      const dateEnd = dateRange.to;

      const months = this.getMonthsInRange(dateStart, dateEnd);

      // Crear observables para cada consultor
      const consultorReports$ = consultors.map((consultor) => {
        // Crear observables para cada mes
        const monthObservables$ = months.map((month) =>
          forkJoin({
            monthData: this.getMonthlyData(consultor.co_usuario, month),
            fixedSalary: this.getFixedSalary(consultor),
          }).pipe(
            map(({ monthData, fixedSalary }) => {
              const lucro =
                monthData.receitaLiquida - (fixedSalary + monthData.comissao);

              return {
                month,
                receitaLiquida: monthData.receitaLiquida,
                fixedSalary,
                comissao: monthData.comissao,
                lucro,
              };
            })
          )
        );

        // Combinar todos los meses para este consultor
        return forkJoin(monthObservables$).pipe(
          map((monthsArray) => ({
            consultor: consultor,
            info: monthsArray,
          }))
        );
      });

      // Combinar todos los consultores
      return forkJoin(consultorReports$).pipe(
        map((resultsFinal) => ({
          success: true,
          data: resultsFinal,
          count: resultsFinal.length,
        }))
      );
    } catch (error) {
      console.error('Error al obtener reportes:', error);
      return of({
        success: false,
        error: `Error al obtener reportes: ${error}`,
      });
    }
  }
}
