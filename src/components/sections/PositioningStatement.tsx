import { Heading } from "@/components/ui/Heading";

export function PositioningStatement() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
      <Heading as="h2" size="lg" className="text-balance">
        Alcon is a Dubai-based creative agency for brands that need to move
        fast without losing their{" "}
        <span className="text-gradient">point of view</span>.
      </Heading>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary">
        We work as an embedded creative partner — combining strategy,
        design, and AI-accelerated production to take a brand from a clear
        idea to a finished, high-performing experience.
      </p>
    </section>
  );
}
