import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Adaptado ao Observatório na 3B, experimento 3 — a §9 do design system diz que quem cede
 * é o componente. Quatro linhas do preset `nova` saíram:
 *
 *   anel de foco   `ring-3` a 50% e colado  →  2px `azure-500` com offset de 2px, §5
 *   raio           `rounded-lg`, 8px        →  `rounded-md`, os 6px que a §5 dá a controle
 *   ativo          `translate-y-px`         →  `scale(0.98)`, §8
 *   desabilitado   `opacity-50`             →  texto `ink-600` e `not-allowed`, §8
 *
 * `disabled:pointer-events-none` saiu junto: com ele o cursor sobre o botão é o do pai, e
 * `not-allowed` nunca apareceria. O preço é que o hover precisa dizer que não vale quando o
 * botão está desabilitado, e é o que `not-disabled:hover:` faz em cada variante.
 *
 * O hover da §8 é "superfície sobe um degrau, cor não muda", o que num botão de
 * preenchimento cheio é o tom 300 sobre o 400 — daí `azure-300` e `crown-300` nomeados. O
 * destrutivo perdeu o fundo tingido a 10% e virou o par 400/950 da §2.4, que é a decisão 17.
 *
 * As duplicatas `dark:` das variantes que mudaram foram colapsadas: a classe `dark` está
 * sempre no `<html>` (não há tema claro), então elas eram só o valor que de fato vale, com
 * especificidade a mais para brigar com o resto.
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:not-aria-[haspopup]:scale-[0.98] disabled:cursor-not-allowed disabled:text-ink-600 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground not-disabled:hover:bg-azure-radiance-300",
        outline:
          "border-input bg-input/30 not-disabled:hover:bg-input/50 not-disabled:hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground not-disabled:hover:bg-ink-700 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "not-disabled:hover:bg-muted not-disabled:hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
        destructive:
          "bg-destructive text-destructive-foreground not-disabled:hover:bg-crown-of-thorns-300",
        link: "text-primary underline-offset-4 not-disabled:hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
