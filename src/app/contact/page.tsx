import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { ViewTracker } from "@/components/view-tracker";

export const metadata: Metadata = {
  title: "Contact",
  description: "General inquiries for collaborations, press, or introductions.",
};

export default function ContactPage() {
  return (
    <>
      <ViewTracker path="/contact" resourceType="page" resourceSlug="contact" />
      <div className="mx-auto max-w-xl px-4 py-12 md:px-6 md:py-16">
        <h1 className="font-heading text-4xl font-semibold tracking-tight">
          Contact
        </h1>
        <p className="mt-3 text-muted-foreground">
          Share context and the best way to reach you. Messages are stored
          securely and reviewed regularly.
        </p>
        <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
          <ContactForm />
        </div>
      </div>
    </>
  );
}
