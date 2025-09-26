export interface Usuario {
  co_usuario: number;
  no_usuario: string;
  ds_email?: string;
}

export interface Fatura {
  id: number;
  co_os: number;
  co_cliente: number;
  co_sistema: number;
  data_emissao: string;
  valor: number;
  total_imp_inc: number;
  comissao_cn: number;
}

export interface Os {
  co_os: number;
  co_usuario: number;
}

export interface Salario {
  co_usuario: number;
  brut_salario: number;
}
