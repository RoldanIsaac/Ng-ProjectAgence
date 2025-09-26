export interface Usuario {
  co_usuario: string;
  no_usuario: string;
  ds_senha: string;
  co_usuario_autorizacao: string | null;
  nu_matricula: number | null;
  dt_nascimento: string | null;
  dt_admissao_empresa: string | null;
  dt_desligamento: string | null;
  dt_inclusao: string | null;
  dt_expiracao: string | null;
  nu_cpf: string | null;
  nu_rg: string | null;
  no_orgao_emissor: string | null;
  uf_orgao_emissor: string | null;
  ds_endereco: string | null;
  no_email: string | null;
  no_email_pessoal: string | null;
  nu_telefone: string | null;
  dt_alteracao: string;
  url_foto: string | null;
  instant_messenger: string | null;
  icq: number | null;
  msn: string | null;
  yms: string | null;
  ds_comp_end: string | null;
  ds_bairro: string | null;
  nu_cep: string | null;
  no_cidade: string | null;
  uf_cidade: string | null;
  dt_expedicao: string | null;
}

export interface PermissaoSistema {
  co_usuario: string;
  co_tipo_usuario: number;
  co_sistema: number;
  in_ativo: string;
  co_usuario_atualizacao?: string;
  dt_atualizacao: string;
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
