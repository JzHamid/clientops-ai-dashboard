"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
  disabled?: boolean;
};

export function SubmitButton({
  children,
  pendingLabel = "Working...",
  className = "",
  disabled = false,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      className={className}
      disabled={disabled || pending}
      type="submit"
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
