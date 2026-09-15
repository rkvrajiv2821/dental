import { SectionHeading } from "@/components/website/section-heading";
import { FadeIn } from "@/components/animations/fade-in";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getPublishedFAQs } from "@/lib/data/misc";

export async function FAQSection({ title, subtitle, content }: { title?: string | null; subtitle?: string | null; content: { category?: string; limit?: number } }) {
  const faqs = await getPublishedFAQs(content.category, content.limit ?? 8);
  if (faqs.length === 0) return null;

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={subtitle} title={title} align="center" className="mx-auto" />
        <FadeIn delay={0.1} className="mt-10">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f) => (
              <AccordionItem key={f.id} value={f.id}>
                <AccordionTrigger className="text-left font-heading text-base">{f.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </div>
    </section>
  );
}
