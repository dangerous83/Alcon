import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <SectionLabel>404</SectionLabel>
      <Heading as="h1" size="lg" className="mt-4">
        This page doesn't exist.
      </Heading>
      <p className="mt-4 text-text-secondary">
        The page you're looking for may have moved. Try starting from the
        homepage or exploring our work.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Button href="/">Back to homepage</Button>
        <Button href="/client-projects" variant="secondary">
          Explore our work
        </Button>
      </div>
    </div>
  );
}
