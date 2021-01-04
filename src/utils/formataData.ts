interface DataInicioFim {
  dataInicial: string;
  dataFinal: string;
}

export function formataData(data: string): string {
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
  const date = new Date(data);

  const dataFormatada = date.toLocaleDateString('pt-br', options);

  return dataFormatada;
}

export function formataDataInicial(): DataInicioFim {
  // Seta data inicial e final dos ultimos 30 dias
  const hoje = new Date();
  const inicio = new Date();

  inicio.setMonth(hoje.getMonth() - 1);

  let mes;
  let dia;

  if (inicio.getMonth() + 1 < 10) {
    if (inicio.getMonth() + 1 === 1) {
      mes = '12';
    }
    // Formata data para o input
    mes = `0${inicio.getMonth() + 1}`;
  } else {
    // Formata data para o input
    mes = `${inicio.getMonth() + 1}`;
  }

  if (inicio.getDate() < 10) {
    // Formata data para o input
    dia = `0${inicio.getDate()}`;
  } else {
    // Formata data para o input
    dia = `${inicio.getDate()}`;
  }

  const dataInicial = `${inicio.getFullYear()}-${mes}-${dia}`;

  if (hoje.getMonth() + 1 < 10) {
    // Formata data para o input
    mes = `0${hoje.getMonth() + 1}`;
  } else {
    // Formata data para o input
    mes = `${hoje.getMonth() + 1}`;
  }

  if (hoje.getDate() < 10) {
    // Formata data para o input
    dia = `0${hoje.getDate()}`;
  } else {
    // Formata data para o input
    dia = `${hoje.getDate()}`;
  }

  const dataFinal = `${hoje.getFullYear()}-${mes}-${dia}`;

  return { dataInicial, dataFinal } as DataInicioFim;
}
