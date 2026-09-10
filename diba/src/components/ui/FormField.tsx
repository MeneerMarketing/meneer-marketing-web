import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

const fieldBase =
  "w-full rounded-[1rem] bg-white px-4 text-[16px] leading-relaxed text-[var(--g-900)] " +
  "placeholder:text-[var(--t-muted)] border transition motion-reduce:transition-none " +
  "focus:outline-none focus-visible:outline-none " +
  "focus:ring-2 focus:ring-[var(--g-700)] focus:ring-offset-0 " +
  "disabled:cursor-not-allowed disabled:text-[var(--t-muted)]";

const borders = {
  normal: "border-[var(--g-100)] focus:border-[var(--g-700)]",
  error:
    "border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]",
};

type BaseProps = {
  label: string;
  id: string;
  error?: string;
  hint?: string;
};

function Wrapper({
  label,
  id,
  error,
  hint,
  required,
  children,
}: BaseProps & { required?: boolean; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-[14px] font-medium leading-relaxed text-[var(--g-900)]"
      >
        {label}
        {required ? (
          <span aria-hidden="true" className="text-[var(--t-label)]">
            {" "}
            *
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          className="text-[13px] leading-relaxed text-[var(--error)]"
        >
          {error}
        </p>
      ) : hint ? (
        <p
          id={`${id}-hint`}
          className="text-[13px] leading-relaxed text-[var(--t-muted)]"
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function TextField({
  label,
  id,
  error,
  hint,
  className = "",
  ...rest
}: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Wrapper
      label={label}
      id={id}
      error={error}
      hint={hint}
      required={rest.required}
    >
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        className={`h-12 ${fieldBase} ${error ? borders.error : borders.normal} ${className}`}
        {...rest}
      />
    </Wrapper>
  );
}

export function TextareaField({
  label,
  id,
  error,
  hint,
  className = "",
  rows = 4,
  ...rest
}: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Wrapper
      label={label}
      id={id}
      error={error}
      hint={hint}
      required={rest.required}
    >
      <textarea
        id={id}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        className={`py-3 ${fieldBase} ${error ? borders.error : borders.normal} ${className}`}
        {...rest}
      />
    </Wrapper>
  );
}

/**
 * Een keuzelijst in dezelfde jas als de andere velden.
 *
 * Het pijltje is er een van ons: `appearance-none` haalt dat van het besturingssysteem
 * weg, want anders staat er op een Mac een ander teken dan op Windows en op een telefoon
 * weer een derde. Ruimte rechts, zodat een lange keuze er niet onder loopt.
 */
export function SelectField({
  label,
  id,
  error,
  hint,
  className = "",
  children,
  ...rest
}: BaseProps & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Wrapper
      label={label}
      id={id}
      error={error}
      hint={hint}
      required={rest.required}
    >
      <div className="relative">
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error ? `${id}-error` : hint ? `${id}-hint` : undefined
          }
          className={`h-12 appearance-none pr-11 ${fieldBase} ${error ? borders.error : borders.normal} ${className}`}
          {...rest}
        >
          {children}
        </select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[var(--t-label)]"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2.5 4.5 6 8l3.5-3.5" />
          </svg>
        </span>
      </div>
    </Wrapper>
  );
}
