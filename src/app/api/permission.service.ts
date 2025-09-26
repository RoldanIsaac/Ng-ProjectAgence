// src/app/services/tipo-usuario.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface TipoUsuario {
  co_usuario: string;
  co_tipo_usuario: number;
  co_sistema: number;
  in_ativo: string; // "S" o "N"
  co_usuario_atualizacao: string | null;
  dt_atualizacao: string;
}

@Injectable({
  providedIn: 'root',
})
export class TipoUsuarioService {
  private tiposUsuarios: TipoUsuario[] = [
    {
      co_usuario: 'USR001',
      co_tipo_usuario: 1,
      co_sistema: 100,
      in_ativo: 'S',
      co_usuario_atualizacao: 'admin',
      dt_atualizacao: '2023-05-15 10:30:00',
    },
    {
      co_usuario: 'USR002',
      co_tipo_usuario: 2,
      co_sistema: 200,
      in_ativo: 'S',
      co_usuario_atualizacao: 'USR001',
      dt_atualizacao: '2024-01-20 14:00:00',
    },
    {
      co_usuario: 'USR003',
      co_tipo_usuario: 3,
      co_sistema: 300,
      in_ativo: 'N',
      co_usuario_atualizacao: null,
      dt_atualizacao: '2025-02-01 08:15:00',
    },
  ];

  constructor() {}

  getTiposUsuarios(): Observable<TipoUsuario[]> {
    return of(this.tiposUsuarios); // simula un request HTTP
  }
}
