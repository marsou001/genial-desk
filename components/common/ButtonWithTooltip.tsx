"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonWithTooltipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tooltip?: ReactNode;
  wrapperClassName?: string;
  tooltipClassName?: string;
};

export default function ButtonWithTooltip({
  children,
  tooltip,
  className = "",
  wrapperClassName = "",
  tooltipClassName = "",
  type = "button",
  ...buttonProps
}: ButtonWithTooltipProps) {
  const wrapperClasses = wrapperClassName
    ? `group relative ${wrapperClassName}`
    : "group relative inline-flex";

  return (
    <div className={wrapperClasses}>
      <button type={type} className={className} {...buttonProps}>
        {children}
      </button>
      {tooltip != null ? (
        <span
          className={`pointer-events-none absolute left-1/2 top-full z-50 mt-2 w-max max-w-xs -translate-x-1/2 rounded-md bg-zinc-900 px-3 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 dark:bg-zinc-100 dark:text-zinc-900 ${tooltipClassName}`.trim()}
        >
          {tooltip}
        </span>
      ) : null}
    </div>
  );
}
