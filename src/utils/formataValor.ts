export const formataReais = (value: number): string =>
  Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

export const formataValor = (value: number): string =>
  Intl.NumberFormat('pt-BR', {
    style: 'decimal',
    currency: 'BRL',
  }).format(value);
