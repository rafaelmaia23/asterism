/**
 * A redução da imagem na importação — decisão 56 da §16 do documento de contexto.
 *
 * Uma foto de celular tem 4000×3000. Ela iria inteira para o IndexedDB, inteira para o DOM
 * e, na exportação, inteira para dentro do `foreignObject` como data URL, uma vez por slide
 * — e o `.json` autocontido da Etapa 4 a carregaria em base64 por cima disso. Nada dessa
 * resolução chega ao arquivo: o slide tem 1080px de largura e o alvo PDF rasteriza na
 * escala 2, então **2160px é o maior lado que o PDF consegue aproveitar**. O que passa
 * disso é peso puro, em quatro lugares de uma vez.
 *
 * A função de dimensões é separada do desenho de propósito: proporção é aritmética e se
 * testa, canvas é ambiente e se olha.
 */

/** O 1080 do formato vezes a escala 2 do alvo PDF. Ver `SCALE` em `export/targets/pdf.ts`. */
export const MAX_EDGE = 2160;

/**
 * As dimensões que cabem no quadrado de lado `max`, preservando a proporção. O que já cabe
 * volta intacto — reduzir não é redimensionar para o teto, é impedir de passar dele.
 */
export function fitWithin(
  width: number,
  height: number,
  max: number,
): { width: number; height: number } {
  const longest = Math.max(width, height);

  if (longest <= max) {
    return { width, height };
  }

  const k = max / longest;

  return { width: Math.round(width * k), height: Math.round(height * k) };
}

/**
 * O arquivo reduzido, ou o próprio arquivo.
 *
 * **Falhar em reduzir não impede importar.** Se o ambiente não decodifica o blob — um
 * formato que o navegador não abre, um canvas que não dá contexto —, o que volta é o
 * original: numa ferramenta de um usuário só, guardar a foto grande é bem melhor que
 * recusar a foto. O preço é que a redução é oportunista, e é por isso que ela se confere
 * medindo o que ficou guardado, e não lendo esta função.
 *
 * O tipo de saída é PNG: preserva a transparência do screenshot de diagrama, que é
 * justamente o caso que o `contain` da §11.9 dos templates existe para servir. A troca por
 * JPEG 0.92 continua sendo o plano B que a §10 reserva para o arquivo, e é do alvo, não daqui.
 */
export async function downscale(file: Blob, max: number = MAX_EDGE): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    const size = fitWithin(bitmap.width, bitmap.height, max);

    if (size.width === bitmap.width && size.height === bitmap.height) {
      bitmap.close();
      return file;
    }

    const canvas = document.createElement("canvas");
    canvas.width = size.width;
    canvas.height = size.height;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      bitmap.close();
      return file;
    }

    ctx.drawImage(bitmap, 0, 0, size.width, size.height);
    bitmap.close();

    const reduced = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );

    return reduced ?? file;
  } catch {
    return file;
  }
}
