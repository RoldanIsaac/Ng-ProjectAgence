// services/mock-data.service.ts
import { Injectable } from '@angular/core';
import {
  CaoSalario,
  PermissaoSistema,
  Usuario,
} from '../core/interfaces/common';
import {
  caoFaturas,
  caoOS,
  caoSalarios,
  permissaoSistema,
  usuarios,
} from './mock';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  getPermissaioSistema(): Observable<PermissaoSistema[]> {
    return of(permissaoSistema);
  }

  getUsuarios(): Observable<Usuario[]> {
    return of(usuarios);
  }

  getSalarios(): Observable<CaoSalario[]> {
    return of(caoSalarios);
  }

  getFaturas(): Observable<any[]> {
    return of(caoFaturas);
  }

  getOS(): Observable<any[]> {
    return of(caoOS);
  }

  // Simula un JOIN entre las tablas por CO_USUARIO
  getConsultors(): Observable<any[]> {
    return of(
      usuarios
        .map((usuario) => {
          const sistemas = permissaoSistema.filter(
            (sistema) => sistema.co_usuario === usuario.co_usuario
            //  &&
            //   sistema.co_sistema === 1 &&
            //   sistema.in_ativo === 'S' &&
            //   [0, 1, 2].includes(sistema.co_tipo_usuario)
          );
          return { ...usuario, sistemas };
        })
        // Solo usuarios que cumplen la condición
        .filter((usuario) => usuario.sistemas.length > 0)
    );
  }
}
