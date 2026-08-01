import { Resend } from "resend";

export const LED_UPLOAD_MAX_BYTES = 8 * 1024 * 1024;
export const LED_UPLOAD_ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export interface LedPassportUploadPayload {
  firstName: string;
  email: string;
  orderNumber: string;
  skinCondition: string;
  photoFront: File;
  photoLeft: File;
  photoRight: File;
}

export interface LedPassportUploadResult {
  teamNotified: boolean;
  customerNotified: boolean;
}

function getResendClient(): Resend {
  const key = process.env.SKINCOMPLETE_RESEND_API_KEY?.trim();
  if (!key) {
    throw new Error(
      "E-mail is nog niet geconfigureerd (SKINCOMPLETE_RESEND_API_KEY ontbreekt).",
    );
  }
  return new Resend(key);
}

function resolveTeamEmail(): string {
  return process.env.SKINCOMPLETE_LED_UPLOAD_TO ?? "office@skincomplete.eu";
}

function resolveFromEmail(): string {
  return (
    process.env.SKINCOMPLETE_LED_UPLOAD_FROM ??
    "Skin Complete <office@skincomplete.eu>"
  );
}

function sanitizeFilename(value: string): string {
  return value.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function fileToAttachment(
  file: File,
  filename: string,
): Promise<{ filename: string; content: Buffer }> {
  const arrayBuffer = await file.arrayBuffer();
  return {
    filename,
    content: Buffer.from(arrayBuffer),
  };
}

export function parseLedPassportFormData(
  formData: FormData,
): LedPassportUploadPayload | { error: string } {
  const honeypot = String(formData.get("website") ?? "").trim();
  if (honeypot) {
    return { error: "INVALID" };
  }

  const consent = String(formData.get("consent") ?? "").trim();
  if (consent !== "true") {
    return { error: "Geef toestemming voor het verwerken van je gegevens." };
  }

  const firstName = String(formData.get("firstName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const orderNumber = String(formData.get("orderNumber") ?? "").trim();
  const skinCondition = String(formData.get("skinCondition") ?? "").trim();

  if (firstName.length < 1 || firstName.length > 100) {
    return { error: "Vul je voornaam in." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Vul een geldig e-mailadres in." };
  }

  if (orderNumber.length > 80) {
    return { error: "Ordernummer is te lang." };
  }

  if (skinCondition.length > 2000) {
    return { error: "Je tekst over je huidconditie is te lang (max. 2000 tekens)." };
  }

  const photoFront = formData.get("photoFront");
  const photoLeft = formData.get("photoLeft");
  const photoRight = formData.get("photoRight");

  if (
    !(photoFront instanceof File) ||
    !(photoLeft instanceof File) ||
    !(photoRight instanceof File)
  ) {
    return { error: "Upload alle drie de foto's (voor, links en rechts)." };
  }

  const isAllowedImageType = (file: File): boolean => {
    const type = (file.type || "").toLowerCase();
    if (LED_UPLOAD_ALLOWED_TYPES.has(type)) return true;
    // Mobiele browsers sturen soms een lege MIME; val terug op extensie.
    if (!type && /\.(jpe?g|png|webp)$/i.test(file.name || "")) return true;
    return false;
  };

  for (const [file, label] of [
    [photoFront, "voorkant"],
    [photoLeft, "linkerzijde"],
    [photoRight, "rechterzijde"],
  ] as const) {
    if (file.size === 0) {
      return { error: `Upload een foto voor ${label}.` };
    }
    if (file.size > LED_UPLOAD_MAX_BYTES) {
      return { error: `Foto ${label} is te groot (max. 8 MB).` };
    }
    if (!isAllowedImageType(file)) {
      return {
        error: `Foto ${label}: alleen JPG, PNG of WebP.`,
      };
    }
  }

  return {
    firstName,
    email,
    orderNumber,
    skinCondition,
    photoFront,
    photoLeft,
    photoRight,
  };
}

export async function sendLedPassportUploadEmails(
  payload: LedPassportUploadPayload,
  responseDays: number,
): Promise<LedPassportUploadResult> {
  const resend = getResendClient();
  const safeName = sanitizeFilename(payload.firstName) || "klant";
  const ext = (file: File): string => {
    if (file.type === "image/png") return "png";
    if (file.type === "image/webp") return "webp";
    return "jpg";
  };

  const attachments = await Promise.all([
    fileToAttachment(
      payload.photoFront,
      `voorkant-${safeName}.${ext(payload.photoFront)}`,
    ),
    fileToAttachment(
      payload.photoLeft,
      `links-${safeName}.${ext(payload.photoLeft)}`,
    ),
    fileToAttachment(
      payload.photoRight,
      `rechts-${safeName}.${ext(payload.photoRight)}`,
    ),
  ]);

  const orderLine = payload.orderNumber
    ? `Ordernummer: ${payload.orderNumber}`
    : "Ordernummer: niet ingevuld";

  const hasSkinNotes = payload.skinCondition.trim().length > 0;
  const skinLine = hasSkinNotes
    ? payload.skinCondition.trim()
    : "Niet ingevuld door de klant.";

  const teamText = [
    "Nieuwe LED Passport foto-inzending via skincomplete.eu",
    "",
    `Naam: ${payload.firstName}`,
    `E-mail: ${payload.email}`,
    orderLine,
    "",
    "========== OVER DE HUIDCONDITIE ==========",
    skinLine,
    "=========================================",
    "",
    "Bijlagen: voorkant, links, rechts",
    "",
    "Antwoord direct naar de klant via reply-to.",
  ].join("\n");

  const teamHtml = `
    <div style="font-family:sans-serif;max-width:640px;margin:0 auto;padding:24px;">
      <p style="margin:0 0 16px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#8E847A;">
        LED Passport · Nieuwe foto-inzending
      </p>
      <p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:#2C2217;"><strong>Naam:</strong> ${escapeHtml(payload.firstName)}</p>
      <p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:#2C2217;"><strong>E-mail:</strong> ${escapeHtml(payload.email)}</p>
      <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#2C2217;"><strong>${escapeHtml(orderLine)}</strong></p>
      <div style="margin:0 0 20px;padding:16px 18px;background:#F5F0EA;border:1px solid rgba(44,34,23,0.12);border-radius:10px;">
        <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#8E847A;">
          Over de huidconditie
        </p>
        <p style="margin:0;font-size:15px;line-height:1.7;color:#2C2217;white-space:pre-wrap;">${escapeHtml(skinLine)}</p>
      </div>
      <p style="margin:0;font-size:13px;line-height:1.6;color:#8E847A;">Drie huidfoto's staan als bijlage bij deze e-mail.</p>
    </div>
  `;

  const teamSend = await resend.emails.send({
    from: resolveFromEmail(),
    to: resolveTeamEmail(),
    replyTo: payload.email,
    subject: hasSkinNotes
      ? `LED Passport foto's + huidnotitie: ${payload.firstName}`
      : `LED Passport foto's ontvangen: ${payload.firstName}`,
    text: teamText,
    html: teamHtml,
    attachments,
  });

  if (teamSend.error) {
    throw new Error(teamSend.error.message);
  }

  const customerText = [
    `Hoi ${payload.firstName},`,
    "",
    "Bedankt voor het insturen van je huidfoto's voor je persoonlijke LED Passport.",
    "",
    "Onze huidtherapeuten bekijken je foto's en stellen op basis daarvan je 12-weken LED-protocol samen.",
    `Je ontvangt je LED Passport per e-mail binnen ${responseDays} werkdagen.`,
    "",
    "Heb je vragen? Antwoord gerust op deze e-mail.",
    "",
    "Het Skin Complete Team",
    "Clinically inspired, home approved.",
    "www.skincomplete.eu",
  ].join("\n");

  const customerHtml = `
    <div style="font-family:sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#2C2217;">
      <p style="margin:0 0 16px;font-size:14px;line-height:1.7;">Hoi ${escapeHtml(payload.firstName)},</p>
      <p style="margin:0 0 16px;font-size:14px;line-height:1.7;">Bedankt voor het insturen van je huidfoto's voor je persoonlijke <strong>LED Passport</strong>.</p>
      <p style="margin:0 0 16px;font-size:14px;line-height:1.7;">Onze huidtherapeuten bekijken je foto's en stellen op basis daarvan je 12-weken LED-protocol samen.</p>
      <p style="margin:0 0 24px;font-size:14px;line-height:1.7;">Je ontvangt je LED Passport per e-mail binnen <strong>${responseDays} werkdagen</strong>.</p>
      <p style="margin:0 0 24px;font-size:14px;line-height:1.7;">Heb je vragen? Antwoord gerust op deze e-mail.</p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:#8E847A;">
        Het Skin Complete Team<br>
        Clinically inspired, home approved.<br>
        www.skincomplete.eu
      </p>
    </div>
  `;

  const customerSend = await resend.emails.send({
    from: resolveFromEmail(),
    to: payload.email,
    replyTo: resolveTeamEmail(),
    subject: "We hebben je foto's ontvangen. Je LED Passport volgt",
    text: customerText,
    html: customerHtml,
  });

  return {
    teamNotified: true,
    customerNotified: !customerSend.error,
  };
}
