import { createFileRoute, redirect } from "@tanstack/react-router";

// Root route simply forwards visitors to the gothic login experience.
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/login" });
  },
  component: () => null,
});
