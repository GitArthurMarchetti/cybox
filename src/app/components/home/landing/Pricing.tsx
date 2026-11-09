import { PlansCard } from "../PlansCard";
import { Eyebrow, Reveal } from "./shared";

export function Pricing() {
  return (
    <section id="pricing" className="relative scroll-mt-16 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center">
            <Eyebrow index="04">Pricing</Eyebrow>
          </div>
          <h2 className="font-display text-2xl font-semibold leading-tight sm:text-4xl lg:text-5xl">Pick your box size.</h2>
          <p className="mt-4 text-white/60">Start small, grow into it. Every plan includes automatic depreciation.</p>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 items-stretch gap-6 md:grid-cols-3 lg:gap-8">
          <Reveal className="h-full">
            <PlansCard
              scale={0}
              size="Small box"
              name="Basic"
              description="For small teams getting their assets out of spreadsheets."
              price={350}
              advantages={["Up to 2 departments", "4 members per department"]}
            />
          </Reveal>
          <Reveal className="h-full" delay={0.08}>
            <PlansCard
              scale={1}
              size="Medium box"
              name="Intermediate"
              description="For growing companies with a mid-sized inventory."
              price={850}
              advantages={["Up to 8 departments", "8 members per department"]}
            />
          </Reveal>
          <Reveal className="h-full" delay={0.16}>
            <PlansCard
              scale={2}
              size="Big box"
              name="Enterprise"
              description="For large organizations with a lot to keep track of."
              price={5000}
              featured
              advantages={["Unlimited departments", "15 members per department"]}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
