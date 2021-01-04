export default function formataRelatorioPdf(data: string): string {
  const relatorio = atob(data);

  const byteNumbers = new Array(relatorio.length);

  for (let i = 0; i < relatorio.length; i += 1) {
    byteNumbers[i] = relatorio.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);

  const file = new Blob([byteArray], { type: 'application/pdf;base64' });

  const fileURL = URL.createObjectURL(file);

  return fileURL;
}
