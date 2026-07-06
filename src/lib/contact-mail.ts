/** Server-side: Resend geconfigureerd voor contactformulieren. */
export function isContactMailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export const CONTACT_MAIL_NOT_CONFIGURED_CODE = "EMAIL_NOT_CONFIGURED" as const;

export const CONTACT_MAIL_NOT_CONFIGURED_MESSAGE =
  "E-mail is nog niet geconfigureerd op de server. Mail ons direct, dan komt je aanvraag alsnog binnen.";
