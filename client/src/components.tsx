import type { ReactNode } from "react";
import { AlertTriangle, Check, ChevronDown, Search, X } from "lucide-react";

export const fieldClass =
  "w-full rounded-[10px] border border-[#d7d5ca] bg-[#fbfaf5] px-3.5 py-2.5 text-[14px] text-[#292d29] outline-none transition placeholder:text-[#999b91] focus:border-[#66735a] focus:ring-3 focus:ring-[#66735a]/12";

export function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-semibold tracking-[0.02em] text-[#555c54]">
        {label} {required && <span className="text-[#9b463b]">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-[#7a7e75]">{hint}</span>}
    </label>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative min-w-0 flex-1">
      <Search
        size={16}
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#767b72]"
      />
      <input
        aria-label={placeholder}
        className={`${fieldClass} pl-9`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export function Select({
  value,
  onChange,
  children,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  label: string;
}) {
  return (
    <div className="relative">
      <select
        aria-label={label}
        className={`${fieldClass} min-w-36 cursor-pointer appearance-none pr-9`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {children}
      </select>
      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6f756b]"
      />
    </div>
  );
}

export function Modal({
  title,
  description,
  onClose,
  children,
  wide,
}: {
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#1e221e]/45 p-0 backdrop-blur-[1px] sm:items-center sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        className={`max-h-[94vh] w-full overflow-y-auto rounded-t-2xl border border-[#d1d0c5] bg-[#f5f3eb] shadow-[0_24px_70px_rgba(33,38,32,0.25)] sm:rounded-2xl ${wide ? "sm:max-w-3xl" : "sm:max-w-xl"}`}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-[#deddd4] bg-[#f5f3eb]/95 px-5 py-4 backdrop-blur sm:px-6">
          <div>
            <h2 className="font-serif text-[22px] leading-tight text-[#252a25]">{title}</h2>
            {description && <p className="mt-1 text-[13px] text-[#70766d]">{description}</p>}
          </div>
          <button
            className="rounded-lg p-2 text-[#686e65] hover:bg-[#e5e3d9] hover:text-[#2f352f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#66735a]"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-4 rounded-2xl border border-[#d9d8cf] bg-[#edebe2] p-3 text-[#65705b] shadow-[inset_0_1px_2px_rgba(255,255,255,.8)]">
        {icon}
      </div>
      <h3 className="font-serif text-xl text-[#30352f]">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-[#777b73]">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ConfirmDialog({
  title,
  message,
  onCancel,
  onConfirm,
}: {
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal title={title} onClose={onCancel}>
      <div className="p-6">
        <div className="flex gap-3 rounded-xl border border-[#dec9c2] bg-[#f7ece8] p-4">
          <AlertTriangle className="mt-0.5 shrink-0 text-[#9b463b]" size={19} />
          <p className="text-sm leading-6 text-[#5d4a44]">{message}</p>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button className="button-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="button-danger" onClick={onConfirm}>
            Delete permanently
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-5 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-2 rounded-xl bg-[#2f382e] px-4 py-3 text-sm font-medium text-white shadow-xl">
      <span className="rounded-full bg-[#cfdbb9] p-0.5 text-[#34402f]">
        <Check size={13} strokeWidth={3} />
      </span>
      {message}
    </div>
  );
}

export const dateLabel = (date: string) =>
  new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(date),
  );

export const truncate = (text: string, length = 130) =>
  text.length > length ? `${text.slice(0, length).trim()}…` : text;
