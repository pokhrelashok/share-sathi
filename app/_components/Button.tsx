import { ReactNode } from "react";
import LoadingSpinner from "./LoadingSpinner";

function Button(props: {
  href?: string;
  type?: "button" | "submit";
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
    className = "",
    loading = false,
    children,
    onClick = () => {},
  } = props;
  const cls = `inline-flex items-center justify-center rounded-md border border-transparent bg-blue-100 duration-200 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 gap-2 focus-visible:ring-offset-2 ${className}`;
  return href ? (
    <a href={href} className={cls}>
      {children}
    </a>
  ) : (
    <button onClick={onClick} disabled={disabled} className={cls} type={type}>
      {children}
      {loading && <LoadingSpinner className="h-4 w-4" />}
    </button>
  );
}

export default Button;
