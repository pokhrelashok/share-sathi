import { ReactNode } from "react";
import LoadingSpinner from "./LoadingSpinner";

function Button(props: {
  href?: string;
  type?: "button" | "submit";
  color?: string;
  className?: string;
  loading?: boolean;
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => any;
}) {
  const {
    href = false,
    disabled = false,
    type = "button",
    color = "blue",
    className = "",
    loading = false,
    children,
    onClick = () => {},
  } = props;
  const cls = `inline-flex justify-center rounded-md border border-transparent bg-${color}-100 px-4 py-2 text-sm font-medium text-${color}-900 hover:bg-${color}-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-${color}-500 gap-2 focus-visible:ring-offset-2 ${className}`;
  return href ? (
    <a href={href} className={cls}>
      {children}
    </a>
  ) : (
    <button onClick={onClick} disabled={disabled} className={cls} type={type}>
      {children}
      {loading && <LoadingSpinner />}
    </button>
  );
}

export default Button;
