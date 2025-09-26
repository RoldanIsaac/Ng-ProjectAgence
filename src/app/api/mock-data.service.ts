// services/mock-data.service.ts
import { Injectable } from '@angular/core';
import { PermissaoSistema, Usuario } from '../core/interfaces/common';
import { permissaoSistema, usuarios } from './mock';
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

  // Simula un JOIN entre las tablas por CO_USUARIO
  getUsuariosConSistemaFiltrado(): Observable<any[]> {
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
