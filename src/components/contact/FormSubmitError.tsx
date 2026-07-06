import Link from "next/link";
import { AlertCircle, Mail } from "lucide-react";

interface FormSubmitErrorProps {
  message: string;
  mailtoHref?: string;
}

/** Fout bij formulier-submit, met optionele mailto-fallback als Resend niet staat. */
export function FormSubmitError({ message, mailtoHref }: FormSubmitErrorProps) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
    >
      <div className="flex items-start gap-2">
        <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
        <div className="min-w-0 space-y-2">
          <p>{message}</p>
          {mailtoHref ? (
            <Link
              href={mailtoHref}
              className="inline-flex items-center gap-1.5 font-bold text-red-900 underline decoration-red-300 underline-offset-2 hover:decoration-red-600"
            >
              <Mail className="size-4" aria-hidden />
              Stuur je aanvraag via e-mail
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
