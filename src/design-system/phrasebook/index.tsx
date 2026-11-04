import { cva, type VariantProps } from "class-variance-authority";
import { createContext, useCallback, useContext, useEffect, useId, useState, type ComponentProps, type ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const buttonVariants = cva("inline-flex min-w-0 items-center justify-center gap-2 rounded-control border-2 font-sans font-extrabold transition-[background-color,border-color,color,transform,box-shadow] duration-150 active:translate-y-px disabled:pointer-events-none disabled:cursor-not-allowed", { variants: { size: { sm: "h-10 px-3 text-small", md: "h-12 px-5 text-body", lg: "h-14 px-6 text-lead" }, variant: {
  primary: "border-primary-edge bg-primary text-primary-foreground shadow-button hover:bg-primary-hover disabled:border-disabled disabled:bg-disabled disabled:text-disabled-foreground disabled:shadow-none",
  secondary: "border-secondary-edge bg-secondary text-secondary-foreground shadow-button hover:bg-secondary-hover disabled:border-disabled disabled:bg-disabled disabled:text-disabled-foreground disabled:shadow-none",
  accent: "border-accent-edge bg-accent text-accent-foreground shadow-button hover:bg-accent-hover disabled:border-disabled disabled:bg-disabled disabled:text-disabled-foreground disabled:shadow-none",
  warning: "border-warning-edge bg-warning text-warning-foreground-strong shadow-button hover:bg-warning-hover disabled:border-disabled disabled:bg-disabled disabled:text-disabled-foreground disabled:shadow-none",
  outline: "border-border-strong bg-background text-foreground shadow-button hover:border-accent hover:bg-accent-soft disabled:border-disabled disabled:text-disabled-foreground disabled:shadow-none",
  ghost: "border-transparent bg-transparent text-foreground shadow-none hover:bg-surface-strong disabled:text-disabled-foreground",
  danger: "border-danger-edge bg-danger text-on-status shadow-button hover:bg-danger-hover disabled:border-disabled disabled:bg-disabled disabled:text-disabled-foreground disabled:shadow-none",
}, block: { true: "w-full", false: "" } }, defaultVariants: { variant: "primary", size: "md", block: false } });
export interface ButtonProps extends ComponentProps<"button">, VariantProps<typeof buttonVariants> { loading?: boolean }
export function Button({ className, variant, size, block, loading = false, disabled, children, ...props }: ButtonProps) { return <button type="button" aria-busy={loading || undefined} disabled={disabled || loading} className={cn(buttonVariants({ variant, size, block }), className)} {...props}>{loading ? <span aria-hidden="true" className="size-5 animate-spin rounded-full border-2 border-current border-t-transparent" /> : null}{children}</button>; }

export const badgeVariants = cva("inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-1 font-sans text-small font-bold", { variants: { variant: { neutral: "border-border bg-surface-strong text-foreground", primary: "border-primary-edge bg-primary text-primary-foreground", accent: "border-accent-edge bg-accent text-accent-foreground", success: "border-primary-edge bg-primary-soft text-success-foreground", warning: "border-warning-edge bg-warning-soft text-warning-foreground", danger: "border-danger-edge bg-danger-soft text-danger-foreground", outline: "border-border-strong bg-background text-muted-foreground" } }, defaultVariants: { variant: "neutral" } });
export interface BadgeProps extends ComponentProps<"span">, VariantProps<typeof badgeVariants> {}
export function Badge({ className, variant, ...props }: BadgeProps) { return <span className={cn(badgeVariants({ variant }), className)} {...props} />; }

export const cardVariants = cva("rounded-card bg-background", { variants: { variant: { outlined: "border-2 border-border", raised: "border-2 border-border shadow-card", filled: "border-2 border-primary-edge bg-primary-soft", warning: "border-2 border-warning-edge bg-warning-soft", quiet: "" }, padding: { none: "", sm: "p-4", md: "p-5 md:p-6", lg: "p-6 md:p-8" } }, defaultVariants: { variant: "outlined", padding: "md" } });
export interface CardProps extends ComponentProps<"div">, VariantProps<typeof cardVariants> {}
export function Card({ className, variant, padding, ...props }: CardProps) { return <div className={cn(cardVariants({ variant, padding }), className)} {...props} />; }
export function CardHeader({ className, ...props }: ComponentProps<"div">) { return <div className={cn("flex flex-col gap-1", className)} {...props} />; }
export function CardTitle({ className, ...props }: ComponentProps<"h3">) { return <h3 className={cn("font-sans text-lead font-extrabold text-foreground", className)} {...props} />; }
export function CardDescription({ className, ...props }: ComponentProps<"p">) { return <p className={cn("text-body text-muted-foreground", className)} {...props} />; }
export function CardContent({ className, ...props }: ComponentProps<"div">) { return <div className={cn("mt-4", className)} {...props} />; }
export function CardFooter({ className, ...props }: ComponentProps<"div">) { return <div className={cn("mt-6 flex items-center gap-3", className)} {...props} />; }

export const headingVariants = cva("font-sans font-extrabold text-foreground", { variants: { level: { 1: "text-h2 md:text-h1", 2: "text-h3 md:text-h2", 3: "text-lead md:text-h3", 4: "text-body md:text-h4" }, tone: { default: "", muted: "text-muted-foreground", accent: "text-primary" } }, defaultVariants: { level: 2, tone: "default" } });
export interface HeadingProps extends Omit<ComponentProps<"h2">, "color">, VariantProps<typeof headingVariants> { level?: 1 | 2 | 3 | 4 }
export function Heading({ className, level = 2, tone, ...props }: HeadingProps) { const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4"; return <Tag className={cn(headingVariants({ level, tone }), className)} {...props} />; }

export const textVariants = cva("font-sans", { variants: { size: { small: "text-small", body: "text-body", lead: "text-lead" }, tone: { default: "text-foreground", muted: "text-muted-foreground", accent: "text-accent-strong" }, weight: { regular: "font-normal", semibold: "font-bold" } }, defaultVariants: { size: "body", tone: "default", weight: "regular" } });
export interface TextProps extends ComponentProps<"p">, VariantProps<typeof textVariants> { as?: "p" | "span" | "div" }
export function Text({ className, size, tone, weight, as: Tag = "p", ...props }: TextProps) { return <Tag className={cn(textVariants({ size, tone, weight }), className)} {...props} />; }
export const textLinkVariants = cva("rounded-md font-sans font-bold transition-colors duration-150", { variants: { variant: { inline: "text-link underline decoration-2 underline-offset-4 hover:text-link-hover", standalone: "text-link no-underline hover:text-link-hover", quiet: "text-muted-foreground no-underline hover:text-foreground" } }, defaultVariants: { variant: "inline" } });
export interface TextLinkProps extends ComponentProps<"a">, VariantProps<typeof textLinkVariants> { external?: boolean }
export function TextLink({ className, variant, external = false, ...props }: TextLinkProps) { return <a className={cn(textLinkVariants({ variant }), className)} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : null)} {...props} />; }

export const fieldControlVariants = cva("w-full rounded-control border-2 bg-background font-sans text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-150 disabled:cursor-not-allowed disabled:bg-disabled disabled:text-disabled-foreground", { variants: { size: { sm: "h-10 px-3 text-small", md: "h-12 px-4 text-body", lg: "h-14 px-4 text-lead" }, invalid: { true: "border-danger", false: "border-border-strong hover:border-accent" } }, defaultVariants: { size: "md", invalid: false } });
export interface InputProps extends Omit<ComponentProps<"input">, "size">, VariantProps<typeof fieldControlVariants> {}
export function Input({ className, size, invalid, ...props }: InputProps) { return <input aria-invalid={invalid || undefined} className={cn(fieldControlVariants({ size, invalid }), className)} {...props} />; }
export interface SelectProps extends Omit<ComponentProps<"select">, "size"> { size?: "sm" | "md" | "lg"; invalid?: boolean }
export function Select({ className, size, invalid, ...props }: SelectProps) { return <select aria-invalid={invalid || undefined} className={cn(fieldControlVariants({ size, invalid }), "pr-9", className)} {...props} />; }
export interface TextareaProps extends ComponentProps<"textarea"> { invalid?: boolean }
export function Textarea({ className, invalid, ...props }: TextareaProps) { return <textarea aria-invalid={invalid || undefined} className={cn("w-full resize-y rounded-control border-2 bg-background px-4 py-3 font-sans text-body text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-150 disabled:cursor-not-allowed disabled:bg-disabled", invalid ? "border-danger" : "border-border-strong hover:border-accent", className)} {...props} />; }
export interface LabelProps extends ComponentProps<"label"> { required?: boolean }
export function Label({ className, required, children, ...props }: LabelProps) { return <label className={cn("block font-sans text-small font-extrabold text-foreground", className)} {...props}>{children}{required ? <span className="text-danger" aria-hidden="true"> *</span> : null}</label>; }
export interface FieldProps extends ComponentProps<"div"> { htmlFor: string; label: string; hint?: string; error?: string; required?: boolean; children: ReactNode }
export function Field({ htmlFor, label, hint, error, required, className, children, ...props }: FieldProps) { return <div className={cn("flex flex-col gap-2", className)} {...props}><Label htmlFor={htmlFor} required={required}>{label}</Label>{children}{error ? <p id={`${htmlFor}-error`} className="text-small font-bold text-danger">{error}</p> : hint ? <p id={`${htmlFor}-hint`} className="text-small text-muted-foreground">{hint}</p> : null}</div>; }

export const containerVariants = cva("mx-auto w-full px-4 md:px-8", { variants: { width: { narrow: "max-w-3xl", content: "max-w-(--container-content)", wide: "max-w-7xl" } }, defaultVariants: { width: "content" } });
export interface ContainerProps extends ComponentProps<"div">, VariantProps<typeof containerVariants> {}
export function Container({ className, width, ...props }: ContainerProps) { return <div className={cn(containerVariants({ width }), className)} {...props} />; }
export const alertVariants = cva("rounded-control border-2 bg-surface px-4 py-3 font-sans", { variants: { tone: { info: "border-info", success: "border-primary", warning: "border-warning", danger: "border-danger" } }, defaultVariants: { tone: "info" } });
export interface AlertProps extends ComponentProps<"div">, VariantProps<typeof alertVariants> { title?: string; children?: ReactNode }
export function Alert({ className, tone, title, children, ...props }: AlertProps) { return <div role={tone === "danger" ? "alert" : "status"} className={cn(alertVariants({ tone }), className)} {...props}>{title ? <p className="text-body font-bold text-foreground">{title}</p> : null}{children ? <div className="text-small text-foreground">{children}</div> : null}</div>; }
export interface DividerProps extends ComponentProps<"hr"> { orientation?: "horizontal" | "vertical" }
export function Divider({ className, orientation = "horizontal", ...props }: DividerProps) { return <hr className={cn("border-0 bg-border", orientation === "horizontal" ? "h-px w-full" : "h-full w-px", className)} {...props} />; }

export interface TableProps extends ComponentProps<"table"> { dense?: boolean }
export function Table({ className, dense = false, ...props }: TableProps) { return <div className="w-full overflow-x-auto rounded-card border-2 border-border"><table data-dense={dense || undefined} className={cn("w-full border-collapse font-sans text-body text-foreground", className)} {...props} /></div>; }
export function TableHead({ className, ...props }: ComponentProps<"thead">) { return <thead className={cn("bg-surface", className)} {...props} />; }
export function TableBody({ className, ...props }: ComponentProps<"tbody">) { return <tbody className={className} {...props} />; }
export function TableRow({ className, ...props }: ComponentProps<"tr">) { return <tr className={cn("border-b border-border transition-colors hover:bg-surface/60 last:border-0", className)} {...props} />; }
export function TableHeaderCell({ className, ...props }: ComponentProps<"th">) { return <th scope="col" className={cn("px-4 py-3 text-left text-small font-extrabold text-muted-foreground", className)} {...props} />; }
export function TableCell({ className, ...props }: ComponentProps<"td">) { return <td className={cn("px-4 py-3 align-top", className)} {...props} />; }

export interface CheckboxProps extends Omit<ComponentProps<"input">, "type"> { label: string; description?: string }
export function Checkbox({ className, label, description, id, ...props }: CheckboxProps) { return <div className={cn("flex items-start gap-3", className)}><input id={id} type="checkbox" className="mt-1 size-5 shrink-0 rounded-md border-2 border-border-strong accent-primary disabled:opacity-60" {...props} /><div className="flex flex-col gap-1"><label htmlFor={id} className="font-sans text-body text-foreground">{label}</label>{description ? <span className="text-small text-muted-foreground">{description}</span> : null}</div></div>; }
export interface RadioProps extends Omit<ComponentProps<"input">, "type"> { label: string; description?: string }
export function Radio({ className, label, description, id, ...props }: RadioProps) { return <div className={cn("flex items-start gap-3", className)}><input id={id} type="radio" className="mt-1 size-5 shrink-0 border-2 border-border-strong accent-primary disabled:opacity-60" {...props} /><div className="flex flex-col gap-1"><label htmlFor={id} className="font-sans text-body text-foreground">{label}</label>{description ? <span className="text-small text-muted-foreground">{description}</span> : null}</div></div>; }
export interface CodeProps extends ComponentProps<"code"> { block?: boolean }
export function Code({ className, block = false, ...props }: CodeProps) { const code = <code className={cn("font-mono text-small text-foreground", block ? "block whitespace-pre" : "rounded-md bg-surface px-1.5 py-0.5", className)} {...props} />; return block ? <pre className="overflow-x-auto rounded-control border-2 border-border bg-surface p-4">{code}</pre> : code; }

export type ThemeMode = "light" | "dark";
type ThemeContextValue = { theme: ThemeMode; setTheme: (theme: ThemeMode) => void; toggleTheme: () => void };
const ThemeContext = createContext<ThemeContextValue | null>(null);
export interface ThemeProviderProps { children: ReactNode; defaultTheme?: ThemeMode; storageKey?: string }
export function ThemeProvider({ children, defaultTheme = "light", storageKey = "phrasebook-theme" }: ThemeProviderProps) { const [theme, setThemeState] = useState<ThemeMode>(defaultTheme); useEffect(() => { const stored = window.localStorage.getItem(storageKey) ?? window.localStorage.getItem("codeconut-theme"); if (stored === "light" || stored === "dark") setThemeState(stored); }, [storageKey]); useEffect(() => { document.documentElement.setAttribute("data-theme", theme); }, [theme]); const setTheme = useCallback((next: ThemeMode) => { setThemeState(next); window.localStorage.setItem(storageKey, next); }, [storageKey]); const toggleTheme = useCallback(() => setTheme(theme === "dark" ? "light" : "dark"), [setTheme, theme]); return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>; }
export function useTheme() { const context = useContext(ThemeContext); if (!context) throw new Error("useTheme must be used within a ThemeProvider"); return context; }

export interface DialogProps extends Omit<ComponentProps<"dialog">, "open"> { open: boolean; onClose: () => void }
/** Centered modal using native <dialog> (focus trap, Escape, top layer). Click on backdrop closes. */
export function Dialog({ open, onClose, className, children, ...props }: DialogProps) {
  const id = useId();
  useEffect(() => {
    const el = document.getElementById(id);
    if (open && el instanceof HTMLDialogElement && !el.open) el.showModal();
  }, [open, id]);
  if (!open) return null;
  return (
    <dialog
      id={id}
      onClose={onClose}
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className={cn("m-auto w-full max-w-md overflow-y-auto rounded-card border-2 border-border bg-background p-6 text-foreground shadow-card", className)}
      {...props}
    >
      {children}
    </dialog>
  );
}
