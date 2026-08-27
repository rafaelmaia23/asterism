import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        // Adaptado ao Observatório na 3B: anel da §5, raio de 6px, e o desabilitado da §8 —
        // texto `ink-600` com a superfície intacta, em vez de fundo mais escuro a 50% de
        // opacidade. O inválido é borda `crown-400` e nada mais, que é o que a §8 escreve e
        // o mesmo sinal que o guard de transbordo usa no quadro do slide.
        "h-8 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:text-ink-600 aria-invalid:border-destructive md:text-sm dark:bg-input/30",
        className
      )}
      {...props}
    />
  )
}

export { Input }
