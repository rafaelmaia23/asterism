import { EditorShell } from "@/editor/editor-shell";

/**
 * A rota única da aplicação. O editor inteiro vive aqui — não há outra tela até a
 * listagem de decks da Etapa 4.
 *
 * Esta página foi, até a 1C, a verificação visual do tema do Observatório. Ela cumpriu o
 * papel no bootstrap e está no histórico do git, que é onde uma página descartável deve
 * ficar.
 */
export default function Page() {
  return <EditorShell />;
}
