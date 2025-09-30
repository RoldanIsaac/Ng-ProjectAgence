import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DateRange } from '../core/interfaces/date';
import { Usuario } from '../core/interfaces/common';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private apiUrl = 'http://agence-api.gt.tc/agence-api/api';

  constructor(private http: HttpClient) {}

  // ------------------------------------------------------------------------------------------
  // @ Public Methods
  // ------------------------------------------------------------------------------------------

  /**
   * @description
   * Get consultors
   */
  getConsultors(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/consultors`);
  }

  /**
   * @description
   * Generate the report for given consultors and date range
   */
  generateReport(consultors: Usuario[], dateRange: DateRange): Observable<any> {
    const body = {
      consultors: consultors,
      dateStart: dateRange.from,
      dateEnd: dateRange.to,
    };

    return this.http.post<any>(`${this.apiUrl}/reports`, body);
  }
}
