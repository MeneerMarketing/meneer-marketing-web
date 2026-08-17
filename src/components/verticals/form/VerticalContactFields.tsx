"use client";

import { Mail, MapPin, Phone, Sparkles } from "lucide-react";

import { verticalInputClass, verticalSectionClass } from "@/components/verticals/form/vertical-form-styles";

interface VerticalContactFieldsProps {
  heading: string;
  nameLabel: string;
  namePlaceholder: string;
  name: string;
  onNameChange: (value: string) => void;
  city: string;
  onCityChange: (value: string) => void;
  email: string;
  onEmailChange: (value: string) => void;
  phone: string;
  onPhoneChange: (value: string) => void;
  onFocusStart?: () => void;
}

export function VerticalContactFields({
  heading,
  nameLabel,
  namePlaceholder,
  name,
  onNameChange,
  city,
  onCityChange,
  email,
  onEmailChange,
  phone,
  onPhoneChange,
  onFocusStart,
}: VerticalContactFieldsProps) {
  return (
    <div className={`${verticalSectionClass} bg-slate-50/60`}>
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-[#FF5722]" aria-hidden />
        <p className="text-base font-extrabold tracking-tight text-slate-900">
          {heading}
        </p>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        Ik reageer rechtstreeks. Geen callcenter, geen doorverwijzing.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <Sparkles className="size-3.5 text-slate-400" aria-hidden />
            {nameLabel}
          </span>
          <input
            required
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            onFocus={onFocusStart}
            placeholder={namePlaceholder}
            className={verticalInputClass}
            autoComplete="organization"
          />
        </label>
        <label className="block text-sm">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <MapPin className="size-3.5 text-slate-400" aria-hidden />
            Plaats
          </span>
          <input
            required
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            onFocus={onFocusStart}
            placeholder="Stad of regio"
            className={verticalInputClass}
            autoComplete="address-level2"
          />
        </label>
        <label className="block text-sm">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <Mail className="size-3.5 text-slate-400" aria-hidden />
            E-mail
          </span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            onFocus={onFocusStart}
            placeholder="jij@bedrijf.nl"
            className={verticalInputClass}
            autoComplete="email"
          />
        </label>
        <label className="block text-sm">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <Phone className="size-3.5 text-slate-400" aria-hidden />
            Telefoon{" "}
            <span className="font-normal text-slate-400">optioneel</span>
          </span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            onFocus={onFocusStart}
            placeholder="06…"
            className={verticalInputClass}
            autoComplete="tel"
          />
        </label>
      </div>
    </div>
  );
}
