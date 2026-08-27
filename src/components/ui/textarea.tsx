import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Adaptado ao Observatório na 3B, como o `input`: anel da §5, raio de 6px,
        // desabilitado e inválido da §8.
        "flex field-sizing-content min-h-16 w-full rounded-md border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:text-ink-600 aria-invalid:border-destructive md:text-sm dark:bg-input/30",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
