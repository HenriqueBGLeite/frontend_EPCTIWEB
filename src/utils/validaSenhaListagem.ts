export default function validaSenhaListagem(numLista: number): number {
  const data = new Date();
  const dia = data.getDate();
  const mes = data.getMonth();
  const ano = data.getFullYear();

  const senha = dia * (mes + 1) * ano + numLista;

  return senha;
}
