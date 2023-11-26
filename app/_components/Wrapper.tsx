import { ReactNode } from "react";
import BackIcon from "./BackIcon";

function Wrapper({
  title,
  showBack = false,
  action = null,
  children,
  className = "",
}: {
  title: string | ReactNode;
  showBack?: boolean;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className="flex flex-col gap-2 p-3 pt-0 max-w-2xl mx-auto relative ">
      <div
        className={`text-xl sm:text-2xl flex items-center font-bold mt-3 text-center z-0 bg-white py-3 sticky top-0 ${
          action || showBack ? "justify-between" : "justify-center"
        } ${className}`}
      >
        <div className="flex items-center gap-2">
          {showBack && <BackIcon />}
          <div>{title}</div>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

export default Wrapper;
