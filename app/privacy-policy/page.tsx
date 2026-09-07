import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy | Visionary Masters Global", description: "How Visionary Masters Global handles enquiries and website information." };

export default function PrivacyPolicyPage() {
  return <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 text-slate-700">
    <h1 className="text-3xl font-extrabold text-navy">Privacy Policy</h1>
    <p className="mt-3 text-sm text-slate-500">Last updated: <time dateTime="2026-09-07">September 7, 2026</time></p>
    <p className="mt-8 leading-relaxed">Visionary Masters Global Pvt Ltd respects your privacy. When you contact us, we use the name, email address and project details you provide only to understand your request, reply to you and deliver agreed services.</p>
    <h2 className="mt-8 text-xl font-bold text-navy">Information we receive</h2>
    <p className="mt-3 leading-relaxed">Our contact form may collect your name, email address and message. We do not sell this information. We keep it only as long as needed for communication, support and legal records.</p>
    <h2 className="mt-8 text-xl font-bold text-navy">Third-party services</h2>
    <p className="mt-3 leading-relaxed">The contact form is delivered through FormSubmit. Our website may use Supabase for securely storing site content and media. These providers process information according to their own policies.</p>
    <h2 className="mt-8 text-xl font-bold text-navy">Contact</h2>
    <p className="mt-3 leading-relaxed">Questions about privacy can be sent to <a className="text-navy underline" href="mailto:vineet.grover.1990@gmail.com">vineet.grover.1990@gmail.com</a>.</p>
  </article>;
}
