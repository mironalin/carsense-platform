import type { IconName } from "lucide-react/dynamic";
import type { ReactNode } from "react";

import { Link } from "@tanstack/react-router";
import { DynamicIcon } from "lucide-react/dynamic";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type FAQItem = {
  id: string;
  icon: IconName;
  question: string;
  answer: string | ReactNode;
};

export default function FAQs() {
  const faqItems: FAQItem[] = [
    {
      id: "item-1",
      icon: "usb",
      question: "How do I connect CarSense to my vehicle?",
      answer: (
        <ol className="list-decimal list-inside space-y-2">
          <li>Plug the OBD-II adapter into your car's OBD-II port (usually located under the dashboard)</li>
          <li>Open the CarSense app on your Android device</li>
          <li>Tap 'Scan for devices' in the app</li>
          <li>Select your OBD-II adapter from the list and pair with it</li>
        </ol>
      ),
    },
    {
      id: "item-2",
      icon: "car",
      question: "Which vehicles are compatible with CarSense?",
      answer: "CarSense works with any vehicle manufactured after 1996 that has an OBD-II port. This includes cars, trucks, SUVs, and most motorcycles. The platform supports all major manufacturers including Ford, Toyota, BMW, Mercedes, Volkswagen, and many others.",
    },
    {
      id: "item-3",
      icon: "smartphone",
      question: "Do I need the Pro version to clear diagnostic codes?",
      answer: "Yes, clearing and resetting diagnostic trouble codes (DTCs) is a Pro feature. The free version allows you to view up to 3 sensors and see DTCs, but you'll need the one-time $9.99 Pro upgrade to clear codes and access the full web dashboard.",
    },
    {
      id: "item-4",
      icon: "building-2",
      question: "What enterprise solutions do you offer?",
      answer: "Our Enterprise plan is designed for insurance companies, service workshops, and fleet managers. It provides access to all registered vehicles in your organization, fleet-wide historical data, multi-user dashboards, custom integrations, and dedicated support. Contact us for a custom quote.",
    },
    {
      id: "item-5",
      icon: "shield-check",
      question: "Is my vehicle data secure and private?",
      answer: "Absolutely. CarSense uses end-to-end encryption for all data transmission. Your vehicle data is stored securely and never shared with third parties without your explicit consent. You maintain full control over your data and can delete it at any time from your dashboard.",
    },
    {
      id: "item-6",
      icon: "wifi",
      question: "Why won't my OBD-II adapter connect?",
      answer: (
        <div className="space-y-3">
          <p>Connection issues are usually due to:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Bluetooth pairing problems - make sure your adapter is in pairing mode and discoverable</li>
            <li>Vehicle compatibility - ensure your car is OBD-II compliant (1996 or newer)</li>
            <li>Adapter quality - we recommend ELM327-based adapters for best compatibility</li>
          </ul>
          <p>Check our troubleshooting guide or contact support for assistance.</p>
        </div>
      ),
    },
  ];

  return (
    <section id="faq" className=" py-20">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:gap-16">
          <div className="md:w-1/3">
            <div className="sticky top-20">
              <h2 className="mt-4 text-3xl font-bold">Frequently Asked Questions</h2>
              <p className="text-muted-foreground mt-4">
                Need help with your vehicle diagnostics? Contact our
                {" "}
                <Link
                  to="/"
                  className="text-primary font-medium hover:underline"
                >
                  support team
                </Link>
              </p>
            </div>
          </div>
          <div className="md:w-2/3">
            <Accordion
              type="single"
              collapsible
              className="w-full space-y-2"
            >
              {faqItems.map(item => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="bg-background shadow-xs rounded-lg border px-4 last:border-b"
                >
                  <AccordionTrigger className="cursor-pointer items-center py-5 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="flex size-6">
                        <DynamicIcon
                          name={item.icon}
                          className="m-auto size-4"
                        />
                      </div>
                      <span className="text-base">{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5">
                    <div className="px-9">
                      {typeof item.answer === "string"
                        ? (
                            <p className="text-base">{item.answer}</p>
                          )
                        : (
                            <div className="text-base">{item.answer}</div>
                          )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
