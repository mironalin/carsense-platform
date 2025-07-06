import { Link } from "@tanstack/react-router";

const links = [
  {
    title: "Stats",
    href: "stats",
  },
  {
    title: "Features",
    href: "features",
  },
  {
    title: "Testimonials",
    href: "testimonials",
  },
  {
    title: "Pricing",
    href: "pricing",
  },
  {
    title: "FAQ",
    href: "faq",
  },
  {
    title: "Contact",
    href: "#",
  },
];

export default function Footer() {
  return (
    <footer className="border-b bg-white py-12 dark:bg-transparent">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-wrap justify-between gap-6">
          <span className="text-muted-foreground order-last block text-center text-sm md:order-first">
            ©
            {new Date().getFullYear()}
            {" "}
            CarSense, All rights reserved
          </span>
          <div className="order-first flex flex-wrap justify-center gap-6 text-sm md:order-last">
            {links.map((link, index) => (
              <Link
                key={index}
                to="/"
                hash={link.href !== "#" ? link.href : undefined}
                hashScrollIntoView={link.href !== "#" ? { behavior: "smooth", block: "start" } : undefined}
                className="text-muted-foreground hover:text-primary block duration-150"
              >
                <span>{link.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
