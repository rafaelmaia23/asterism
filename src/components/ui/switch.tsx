"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        // Adaptado ao Observatório na 3B: anel da §5 e o desabilitado da §8. O interruptor
        // não tem texto para levar a `ink-600`, então quem escurece é a **marca** — o
        // polegar —, e a superfície fica intacta, que é o que a linha da §8 pede.
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-all outline-none group-has-[:focus-visible]/field-label:border-transparent group-has-[:focus-visible]/field-label:ring-0 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:border-destructive data-[size=default]:h-[18.4px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px] data-checked:bg-primary data-unchecked:bg-input dark:data-unchecked:bg-input/80 data-disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {/* O `!` do polegar desabilitado não é preguiça: o preset pinta o polegar em duas
          regras de dois variantes (`dark:data-checked:` e `dark:data-unchecked:`), e o
          Tailwind ordena a folha por peso de variante, não pela ordem em que as classes
          aparecem aqui. Sem ele, a cor de `ink-600` sai da folha antes das outras duas e
          perde para elas — verificado no CSS construído. */}
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-full bg-background ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] dark:data-checked:bg-primary-foreground group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0 dark:data-unchecked:bg-foreground data-disabled:bg-ink-600!"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
