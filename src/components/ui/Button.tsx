import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "sm";

const variants: Record<Variant, string> = {
  primary: "bg-foreground text-bg hover:bg-foreground/90 border border-transparent",
  secondary:
    "bg-transparent text-foreground border border-border-strong hover:border-accent/60 hover:text-accent",
  ghost: "bg-transparent text-muted hover:text-foreground",
};

const sizes: Record<Size, string> = {
  md: "px-6 py-3 text-sm",
  sm: "px-4 py-2 text-sm",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type LinkButtonProps = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
};

type NativeButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

export function Button(props: LinkButtonProps | NativeButtonProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200",
    variants[variant],
    sizes[size],
    className
  );

  if (props.href) {
    return (
      <Link href={props.href} target={props.target} rel={props.rel} className={classes}>
        {children}
      </Link>
    );
  }

  const { type = "button", onClick, disabled, form, name, value } = props as NativeButtonProps;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      form={form}
      name={name}
      value={value}
      className={classes}
    >
      {children}
    </button>
  );
}
