import { ReactNode } from "react";
import BackIcon from "./BackIcon";

function Wrapper({
  title,
  showBack = false,
  action = null,
  children,
  className = "",
  subtitle = "",
}: {
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  showBack?: boolean;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className="flex flex-col gap-2 p-3 pt-0 max-w-2xl mx-auto relative ">
      <div className={`sticky top-0 my-2`}>
        <div
          className={`text-xl sm:text-2xl flex flex-col gap-3 sm:gap-0 sm:flex-row sm:items-center font-bold text-center z-0 bg-white py-3 ${
            action || showBack ? "justify-between" : "justify-center"
          } ${className}`}
        >
          <div className="flex items-center gap-2">
            {showBack && <BackIcon />}
            <div>{title}</div>
          </div>
          {action}
        </div>
        {subtitle}
      </div>
      {children}
    </div>
  );
}

export default Wrapper;
