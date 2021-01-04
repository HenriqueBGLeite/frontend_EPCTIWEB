interface RetornoOs {
  numos: number;
  numvol: number;
}

export default function quebraOs(numos: string): RetornoOs {
  const posicao = [''];
  /* Armazena o número da O.S. */
  posicao[0] = String(numos).substring(0, 10);
  /* Armazena o número do volume. */
  posicao[1] = String(numos).substring(10, 15);

  return {
    numos: Number(posicao[0]),
    numvol: Number(posicao[1]),
  } as RetornoOs;
}
