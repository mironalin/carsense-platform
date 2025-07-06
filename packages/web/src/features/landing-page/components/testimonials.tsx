import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

type Testimonial = {
  name: string;
  role: string;
  image: string;
  quote: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Alexandru Popescu",
    role: "Car Enthusiast",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    quote: "I love being able to see what's happening under the hood of my car. CarSense gives me insights into my vehicle's performance that I never had before. It's fascinating to track how different driving styles affect the data.",
  },
  {
    name: "Marco Benedetti",
    role: "Fleet Coordinator",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
    quote: "CarSense helps us track driving patterns across our company vehicles. It's useful for understanding fuel efficiency trends and general vehicle health monitoring. The data helps inform our maintenance scheduling.",
  },
  {
    name: "Lars Andersson",
    role: "Weekend Mechanic",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    quote: "As someone who enjoys working on cars in my spare time, CarSense gives me a convenient way to check basic diagnostics and monitor sensor data. It's a nice complement to my other tools.",
  },
  {
    name: "Mihai Ionescu",
    role: "Insurance Analyst",
    image: "https://randomuser.me/api/portraits/men/8.jpg",
    quote: "We use CarSense data to better understand driving behaviors and vehicle usage patterns. The insights help us make more informed decisions about coverage and risk assessment.",
  },
  {
    name: "Elena Dragomir",
    role: "Auto Shop Assistant",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    quote: "CarSense is handy for quickly checking basic vehicle information when customers come in. It gives us a starting point and helps track vehicle history between visits.",
  },
  {
    name: "François Dubois",
    role: "Delivery Service Manager",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    quote: "The location tracking and basic diagnostic monitoring help us keep an eye on our delivery vehicles. It's useful for understanding usage patterns and planning maintenance schedules.",
  },
  {
    name: "Andreas Mueller",
    role: "Software Developer",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    quote: "I appreciate the clean interface and data visualization. As a tech person, I enjoy having access to my car's data and being able to track trends over time. It satisfies my curiosity about how cars work.",
  },
  {
    name: "Cristian Radu",
    role: "Service Advisor",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    quote: "CarSense helps us show customers basic vehicle data in an easy-to-understand format. It's a nice way to explain certain trends and support our service recommendations with visual data.",
  },
  {
    name: "Giuseppe Romano",
    role: "Car Owner",
    image: "https://randomuser.me/api/portraits/men/10.jpg",
    quote: "I like being able to monitor my car's basic health and understand what the different error codes mean. It gives me confidence when talking to my mechanic about potential issues.",
  },
  {
    name: "Oliver Hartmann",
    role: "Automotive Student",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
    quote: "CarSense has been helpful for learning about automotive systems. Being able to see real sensor data from actual vehicles makes the theory more concrete and understandable.",
  },
  {
    name: "Bogdan Stanescu",
    role: "Small Business Owner",
    image: "https://randomuser.me/api/portraits/men/12.jpg",
    quote: "We use CarSense to monitor our company vehicles and track basic usage patterns. It's a cost-effective way to keep tabs on our fleet without investing in expensive fleet management systems.",
  },
  {
    name: "Henrik Eriksson",
    role: "Driving Instructor",
    image: "https://randomuser.me/api/portraits/men/13.jpg",
    quote: "CarSense is interesting for showing students how their driving affects the vehicle. The data helps demonstrate concepts like fuel efficiency and engine load in real-world scenarios.",
  },
];

function chunkArray(array: Testimonial[], chunkSize: number): Testimonial[][] {
  const result: Testimonial[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

const testimonialChunks = chunkArray(testimonials, Math.ceil(testimonials.length / 3));

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative overflow-hidden py-16 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-title text-3xl font-semibold">Trusted by Automotive Professionals</h2>
          <p className="text-body mt-6">See why mechanics, fleet managers, and car enthusiasts choose CarSense for their diagnostic needs.</p>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 md:mt-12 lg:grid-cols-3">
          {testimonialChunks.map((chunk, chunkIndex) => (
            <div
              key={chunkIndex}
              className="space-y-3"
            >
              {chunk.map(({ name, role, quote, image }, index) => (
                <Card key={index}>
                  <CardContent className="grid grid-cols-[auto_1fr] gap-3 pt-6">
                    <Avatar className="size-9">
                      <AvatarImage
                        alt={name}
                        src={image}
                        loading="lazy"
                        width="120"
                        height="120"
                      />
                      <AvatarFallback>ST</AvatarFallback>
                    </Avatar>

                    <div>
                      <h3 className="font-medium">{name}</h3>

                      <span className="text-muted-foreground block text-sm tracking-wide">{role}</span>

                      <blockquote className="mt-3">
                        <p className="text-gray-700 dark:text-gray-300">{quote}</p>
                      </blockquote>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
