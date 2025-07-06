import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const pricingTiers = {
  free: {
    name: "Free",
    price: "$0",
    description: "Forever free",
    buttonText: "Download Free",
    buttonVariant: "outline" as const,
    features: [
      { text: "View up to 3 sensors", included: true },
      { text: "Basic DTC scanning", included: true },
      { text: "See diagnostic trouble codes", included: true },
      { text: "Clear DTCs", included: false },
      { text: "Web dashboard access", included: false },
      { text: "Historical data tracking", included: false },
    ],
  },
  pro: {
    name: "Pro",
    price: "$9.99",
    description: "One-time purchase",
    buttonText: "Unlock Pro",
    buttonVariant: "default" as const,
    popular: true,
    features: [
      { text: "Everything in Free plus:", included: true, isHeader: true },
      { text: "Unlimited sensor viewing", included: true },
      { text: "Clear & reset DTCs", included: true },
      { text: "Full web dashboard access", included: true },
      { text: "Historical data tracking", included: true },
      { text: "Advanced diagnostic reports", included: true },
      { text: "Export diagnostic data", included: true },
      { text: "Predictive maintenance alerts", included: true },
      { text: "Priority email support", included: true },
    ],
  },
  enterprise: {
    name: "Enterprise",
    price: "Custom",
    description: "Tailored for your organization",
    features: [
      { text: "Everything in Pro plus:", included: true, isHeader: true },
      { text: "Access to all registered vehicles", included: true },
      { text: "Fleet-wide historical data", included: true },
      { text: "Multi-user dashboard access", included: true },
      { text: "Custom integration support", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "SLA guarantees", included: true },
      { text: "Volume discounts", included: true },
      { text: "White-label options", included: true },
      { text: "API access for integrations", included: true },
    ],
  },
};

export default function Pricing() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleEnterpriseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@"))
      return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <section id="pricing" className="py-16 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h1 className="text-center text-4xl font-semibold lg:text-5xl">Simple, Transparent Pricing</h1>
          <p>Start for free with basic diagnostic scanning, then unlock the full power of CarSense. Enterprise solutions available for insurance companies and service workshops.</p>
        </div>

        <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-3">
          {/* Free Tier */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-medium">{pricingTiers.free.name}</CardTitle>
              <span className="my-3 block text-2xl font-semibold">{pricingTiers.free.price}</span>
              <CardDescription className="text-sm">{pricingTiers.free.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <hr className="border-dashed" />

              <ul className="list-outside space-y-3 text-sm">
                {pricingTiers.free.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2"
                  >
                    {feature.included
                      ? (
                          <Check className="size-3 text-green-600" />
                        )
                      : (
                          <X className="size-3 text-red-500" />
                        )}
                    <span className={!feature.included ? "text-muted-foreground" : ""}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="mt-auto">
              <Button
                asChild
                variant={pricingTiers.free.buttonVariant}
                className="w-full"
              >
                <Link to="/download">{pricingTiers.free.buttonText}</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Tier */}
          <Card className="relative">
            <span className="bg-linear-to-br/increasing absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full from-purple-400 to-amber-300 px-3 py-1 text-xs font-medium text-amber-950 ring-1 ring-inset ring-white/20 ring-offset-1 ring-offset-gray-950/5">Popular</span>

            <CardHeader>
              <CardTitle className="font-medium">{pricingTiers.pro.name}</CardTitle>
              <span className="my-3 block text-2xl font-semibold">{pricingTiers.pro.price}</span>
              <CardDescription className="text-sm">{pricingTiers.pro.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <hr className="border-dashed" />

              <ul className="list-outside space-y-3 text-sm">
                {pricingTiers.pro.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2"
                  >
                    <Check className="size-3 text-green-600" />
                    <span className={feature.isHeader ? "font-medium" : ""}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="mt-auto">
              <Button
                asChild
                className="w-full"
              >
                <Link to="">{pricingTiers.pro.buttonText}</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Enterprise Tier */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-medium">{pricingTiers.enterprise.name}</CardTitle>
              <span className="my-3 block text-2xl font-semibold">{pricingTiers.enterprise.price}</span>
              <CardDescription className="text-sm">{pricingTiers.enterprise.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <hr className="border-dashed" />

              <ul className="list-outside space-y-3 text-sm">
                {pricingTiers.enterprise.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2"
                  >
                    <Check className="size-3 text-green-600" />
                    <span className={feature.isHeader ? "font-medium" : ""}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {!submitted && (
                <form onSubmit={handleEnterpriseSubmit} className="space-y-3 pt-4">
                  <div className="space-y-2">
                    <Input
                      id="enterprise-email"
                      type="email"
                      placeholder="your.email@company.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                </form>
              )}

              {submitted && (
                <div className="pt-4 text-center">
                  <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-3">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Thank you! We'll contact you within 24 hours.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="mt-auto">
              {!submitted
                ? (
                    <Button
                      onClick={handleEnterpriseSubmit}
                      disabled={!email || !email.includes("@") || isSubmitting}
                      variant="outline"
                      className="w-full"
                    >
                      {isSubmitting
                        ? (
                            "Submitting..."
                          )
                        : (
                            <>
                              Request Quote
                              <ArrowRight className="ml-2 size-4" />
                            </>
                          )}
                    </Button>
                  )
                : (
                    <Button
                      disabled
                      variant="outline"
                      className="w-full"
                    >
                      Quote Requested ✓
                    </Button>
                  )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
