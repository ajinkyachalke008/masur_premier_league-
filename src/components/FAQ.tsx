import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "Who can register for MPL 2026?",
      answer: "Any cricket player aged 16 and above can register for the Masur Premier League 2026. We welcome players from all playing levels, from rookies to experienced cricketers."
    },
    {
      question: "What documents do I need to submit?",
      answer: "You'll need to upload: 1) A clear profile photo, 2) Government-issued ID (Aadhaar, Passport, or Driving License), 3) Medical fitness certificate. Optional documents include performance videos and player résumé."
    },
    {
      question: "Is there a registration fee?",
      answer: "Registration for MPL 2026 is completely free. However, selected players will need to declare their auction base price during the registration process."
    },
    {
      question: "How will I know if my registration is approved?",
      answer: "After submitting your registration, you'll receive a unique Registration ID. You can check your status anytime using this ID on our Status Check page. You'll see Pending, Verified, or Rejected status."
    },
    {
      question: "What happens after I'm verified?",
      answer: "Once verified, you'll be eligible for the MPL 2026 auction. Your player profile will be available to team owners and franchises for selection during the official auction event."
    },
    {
      question: "Can I edit my registration after submission?",
      answer: "Once submitted, you cannot directly edit your registration. However, if the admin finds any issues, they may request corrections. Contact our support team if you need to make urgent changes."
    },
    {
      question: "What are the auction categories?",
      answer: "Players can choose from four auction categories: Platinum (highest base price), Gold, Silver, and Rookie (entry-level). Your category affects your starting bid during the auction."
    },
    {
      question: "When is the registration deadline?",
      answer: "Registration closes on March 31, 2026 at 11:59 PM. Make sure to complete your registration before the countdown reaches zero!"
    }
  ];

  return (
    <section className="py-20 px-4 bg-card/30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-foreground">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about MPL 2026 registration
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="card-mpl border-border hover:border-primary/50 transition-colors"
            >
              <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary px-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground px-6 pb-6 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
