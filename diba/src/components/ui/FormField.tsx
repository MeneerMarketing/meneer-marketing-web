import type {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";

const fieldBase =
  "w-full rounded-[1rem] bg-white px-4 text-[16px] leading-relaxed text-[#17372a] " +
  "placeholder:text-[#9ab09a] border transition motion-reduce:transition-none " +
  "focus:outline-none focus-visible:outline-none " +
  "focus:ring-2 focus:ring-[#286943] focus:ring-offset-0 " +
  "disabled:cursor-not-allowed disabled:text-[#9ab09a]";

const borders = {
  normal: "border-[#dce8d9] focus:border-[#286943]",
  error: "border-[#b85c5c] focus:border-[#b85c5c] focus:ring-[#b85c5c]",
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
      <label htmlFor={id} className="text-[14px] font-medium leading-relaxed text-[#17372a]">
        {label}
        {required ? (
          <span aria-hidden="true" className="text-[#5d9564]">
            {" "}
            *
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-[13px] leading-relaxed text-[#b85c5c]">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-[13px] leading-relaxed text-[#5f7765]">
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
    <Wrapper label={label} id={id} error={error} hint={hint} required={rest.required}>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
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
    <Wrapper label={label} id={id} error={error} hint={hint} required={rest.required}>
      <textarea
        id={id}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`py-3 ${fieldBase} ${error ? borders.error : borders.normal} ${className}`}
        {...rest}
      />
    </Wrapper>
  );
}
