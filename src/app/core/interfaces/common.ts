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

export interface Os {
  co_os: number;
  co_usuario: number;
}

export interface CaoSalario {
  co_usuario: string;
  dt_alteracao: string;
  brut_salario: number;
  liq_salario: number;
}

export interface Fatura {
  co_fatura: number;
  co_cliente: number;
  co_sistema: number;
  co_os: number;
  num_nf: number;
  total: number;
  valor: number;
  data_emissao: string;
  corpo_nf: string;
  comissao_cn: number;
  total_imp_inc: number;
}

export interface ReceitaLiquida {
  month: number;
  year: number;
  receitaLiquida: number;
}

export interface Comissao {
  month: number;
  year: number;
  comissao: number;
}

export interface OS {
  co_os: number;
  nu_os: number;
  co_sistema: number;
  co_usuario: string;
  co_arquitetura: number;
  ds_os: string;
  ds_caracteristica: string | null;
  ds_requisito: string | null;
  dt_inicio: string | null;
  dt_fim: string | null;
  co_status: number;
  diretoria_sol: string | null;
  dt_sol: string | null;
  nu_tel_sol: string | null;
  ddd_tel_sol: string | null;
  nu_tel_sol2: string | null;
  ddd_tel_sol2: string | null;
  usuario_sol: string | null;
  dt_imp: string | null;
  dt_garantia: string | null;
  co_email: string | null;
  co_os_prospect_rel: string | null;
}
