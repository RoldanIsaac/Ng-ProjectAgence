// src/app/calc.utils.ts
export function receitaLiquida(valor: number, totalImpPct: number) {
  return valor * (1 - totalImpPct / 100);
}
export function comissaoValor(
  valor: number,
  totalImpPct: number,
  comissaoPct: number
) {
  const liq = receitaLiquida(valor, totalImpPct);
  return liq * (comissaoPct / 100);
}
export function lucroPorFatura(
  valor: number,
  totalImpPct: number,
  comissaoPct: number,
  custoFixo: number
) {
  const liq = receitaLiquida(valor, totalImpPct);
  const comissao = comissaoValor(valor, totalImpPct, comissaoPct);
  return liq - (custoFixo + comissao);
}

const VALOR = 600;
const TOTAL_IMP_INC = 23;
const COMISSAO_CN = 7;
const liq = receitaLiquida(VALOR, TOTAL_IMP_INC); // 600 * 0.77 = 462
const com = comissaoValor(VALOR, TOTAL_IMP_INC, COMISSAO_CN); // 462 * 0.07 = 32.34
