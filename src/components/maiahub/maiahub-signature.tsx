import { cn } from "@/lib/utils";
import { MaiahubMark } from "./maiahub-mark";
import type { MaiahubLogoProps } from "./logo-shared";

interface MaiahubSignatureProps extends Omit<MaiahubLogoProps, "ref"> {
  /** Esconde a divisória vertical entre a marca e o nome. */
  bare?: boolean;
  className?: string;
}

/**
 * Uso corrido em texto: rodapé, cabeçalho, assinatura.
 * Diferente das outras peças, o nome aqui é texto de verdade — selecionável,
 * pesquisável, e responde aos tokens de fonte do projeto.
 */
export function MaiahubSignature({
  className,
  mono = false,
  bare = false,
  ...props
}: MaiahubSignatureProps) {
  return (
    <span className={cn("inline-flex items-center gap-3 text-foreground", className)}>
      <MaiahubMark mono={mono} className="h-7 w-auto text-current" aria-hidden {...props} />
      {!bare && <span aria-hidden className="h-6 w-px bg-current/30" />}
      <span className="text-lg tracking-wide">
        <span className="font-normal">maia</span>
        <span className="font-medium">hub</span>
      </span>
    </span>
  );
}
