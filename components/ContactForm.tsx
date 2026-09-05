"use client";

import { useState, type FormEvent } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const CONTACT_EMAIL = "vineet.grover.1990@gmail.com";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const { t } = useLanguage();
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="_subject" value="New inquiry — Visionary Masters Global website" />
      <input type="hidden" name="_captcha" value="false" />
      <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700">
          {t.contact.formName}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          {t.contact.formEmail}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-700">
          {t.contact.formMessage}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-md bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-light transition-colors disabled:opacity-60"
      >
        {status === "sending" ? t.contact.formSending : t.contact.formSubmit}
      </button>

      {status === "success" && (
        <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{t.contact.formSuccess}</p>
      )}
      {status === "error" && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{t.contact.formError}</p>
      )}
    </form>
  );
}
