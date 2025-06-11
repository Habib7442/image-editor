import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FaqSection() {
  const faqs = [
    {
      question: "How does PhotoFX work?",
      answer: "PhotoFX lets you transform your photos with stunning visual effects in seconds! Simply upload your photo, choose an effect, adjust the settings to your liking, and download the result. It's that easy! ✨"
    },
    {
      question: "Is my data secure when I use PhotoFX?",
      answer: "Absolutely! 🔒 Your images are processed entirely in your browser and are NOT stored on any server or cloud storage. Once you close the browser tab, your images are gone unless you've downloaded them to your device. We have zero access to your photos."
    },
    {
      question: "What effects are available?",
      answer: "We offer a variety of effects including Motion Blur, Film Strip, Polaroids, Optical Effects, Cinematic Effects, Collages, and more! Each effect has multiple options and settings you can customize to create your perfect look. 🎨"
    },
    {
      question: "Can I use PhotoFX on mobile devices?",
      answer: "Yes! PhotoFX is fully responsive and works on all devices including smartphones and tablets. Create stunning photo effects on the go, wherever you are! 📱 Our mobile experience is just as powerful as desktop."
    },
    {
      question: "Are there any limitations on file size or format?",
      answer: "We support most common image formats (JPG, PNG, WEBP) with a maximum file size of 10MB per image. Since all processing happens in your browser, larger files may cause performance issues on some devices. 🖼️"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-0 w-64 h-64 bg-blue-400/10 dark:bg-blue-900/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-0 w-64 h-64 bg-purple-400/10 dark:bg-purple-900/20 rounded-full blur-3xl -z-10"></div>

      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/30 mb-4">
            <HelpCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-medium text-blue-800 dark:text-blue-300">Got Questions?</span>
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-blue-600 via-purple-500 to-blue-400 text-transparent bg-clip-text">
              Frequently Asked Questions
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Everything you need to know about PhotoFX and how it can transform your photos
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-3xl mt-12 relative">
          <div className="absolute -top-6 -left-6 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full"></div>
          <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full"></div>

          <div className="bg-background/60 backdrop-blur-sm border border-blue-100 dark:border-blue-900/40 rounded-2xl p-6 shadow-lg">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b border-blue-100 dark:border-blue-900/40 last:border-0">
                  <AccordionTrigger className="text-left hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-4 text-lg font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-6">Still have questions? We&apos;re here to help!</p>
          <Button asChild className="rounded-full bg-gradient-to-r from-blue-600 via-purple-500 to-blue-500 hover:from-blue-700 hover:via-purple-600 hover:to-blue-600 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
            <Link href="/contact" className="flex items-center gap-2 px-6 py-2">
              <MessageCircle className="h-4 w-4" />
              <span>Contact Support</span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}