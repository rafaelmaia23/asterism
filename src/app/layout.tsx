import type { Metadata } from "next";
import { fontVariables } from "@/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "asterism",
  description: "Editor de carrosséis para LinkedIn",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      // `dark` is not a toggle: the Observatorio has no light variant. The class
      // is here so `dark:` utilities inside shadcn components resolve coherently.
      className={`dark ${fontVariables} h-full antialiased`}
    >
      {/*
        `h-full` e não `min-h-full`: o editor é shell de aplicação, não documento que
        rola. Com altura só mínima, a do `body` é dirigida pelo conteúdo, e é por essa
        ponta solta que o canvas empurrava a área que o mede — ver a §13 do documento de
        contexto. O que rola, quando precisa, é cada coluna por dentro.
      */}
      <body className="h-full overflow-hidden flex flex-col">{children}</body>
    </html>
  );
}
