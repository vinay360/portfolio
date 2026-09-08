import Link from "next/link";

import Container from "@/components/common/Container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container>
      <section className="animate-in-up flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
        <p className="font-mono text-sm text-muted-foreground">404</p>
        <h1 className="text-2xl font-bold tracking-tight">Page not found</h1>
        <p className="max-w-md text-secondary">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Button variant="outline" asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </section>
    </Container>
  );
}
