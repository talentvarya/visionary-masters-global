import type { Metadata } from "next";

export const metadata: Metadata = { title: "Editorial Policy | Visionary Masters Global", description: "Our standards for accurate, useful AI and business automation content." };

export default function EditorialPolicyPage() {
  return <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 text-slate-700">
    <h1 className="text-3xl font-extrabold text-navy">Editorial Policy</h1>
    <p className="mt-3 text-sm text-slate-500">Reviewed: <time dateTime="2026-09-07">September 7, 2026</time></p>
    <p className="mt-8 leading-relaxed">Our website explains practical AI automation, Excel, Power BI and creative solutions in clear language. Content is written and reviewed by Vineet Grover, Founder &amp; Director, using hands-on operational experience and ongoing AI training.</p>
    <h2 className="mt-8 text-xl font-bold text-navy">Our standards</h2>
    <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed"><li>We aim for accurate, useful guidance and explain when an example is illustrative.</li><li>We update pages when tools, workflows or service details change.</li><li>We do not promise a particular business result; outcomes depend on the client’s process, data and implementation.</li><li>Readers can request a correction by emailing <a className="text-navy underline" href="mailto:vineet.grover.1990@gmail.com">vineet.grover.1990@gmail.com</a>.</li></ul>
  </article>;
}
