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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
