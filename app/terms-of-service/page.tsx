import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service | Visionary Masters Global", description: "Terms for using Visionary Masters Global services and website." };

export default function TermsPage() {
  return <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 text-slate-700">
    <h1 className="text-3xl font-extrabold text-navy">Terms of Service</h1>
    <p className="mt-3 text-sm text-slate-500">Effective: <time dateTime="2026-09-07">September 7, 2026</time></p>
    <p className="mt-8 leading-relaxed">Visionary Masters Global Pvt Ltd provides AI automation, data, creative and website services agreed with each client. The scope, deliverables, timeline, fees and access required are confirmed before work begins.</p>
    <h2 className="mt-8 text-xl font-bold text-navy">Client responsibilities</h2>
    <p className="mt-3 leading-relaxed">Clients provide accurate information, lawful content and the access needed to build and test a solution. Clients remain responsible for reviewing outputs and approving content before publishing or business use.</p>
    <h2 className="mt-8 text-xl font-bold text-navy">Intellectual property</h2>
    <p className="mt-3 leading-relaxed">Ownership and licensing of custom deliverables are agreed in the project scope. Third-party tools, templates and services remain subject to their own licences.</p>
    <h2 className="mt-8 text-xl font-bold text-navy">Contact</h2>
    <p className="mt-3 leading-relaxed">For questions about these terms, email <a className="text-navy underline" href="mailto:vineet.grover.1990@gmail.com">vineet.grover.1990@gmail.com</a>.</p>
  </article>;
}
