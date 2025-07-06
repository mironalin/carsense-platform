export default function Stats() {
  return (
    <section id="stats" className="py-12 md:py-20">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center">
          <h2 className="text-4xl font-semibold lg:text-5xl">CarSense in numbers</h2>
          <p>CarSense is transforming automotive diagnostics with an intelligent ecosystem connecting car owners, mechanics, and fleet managers with real-time insights and predictive maintenance.</p>
        </div>

        <div className="grid gap-0.5 *:text-center md:grid-cols-3">
          <div className="rounded-(--radius) space-y-4 border py-12">
            <div className="text-5xl font-bold">5K+</div>
            <p>Vehicles Monitored</p>
          </div>
          <div className="rounded-(--radius) space-y-4 border py-12">
            <div className="text-5xl font-bold">80K+</div>
            <p>Diagnostic Scans</p>
          </div>
          <div className="rounded-(--radius) space-y-4 border py-12">
            <div className="text-5xl font-bold">99.8%</div>
            <p>Diagnostic Accuracy</p>
          </div>
        </div>
      </div>
    </section>
  );
}
