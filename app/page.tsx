import { Suspense } from "react";

import { CoffeeApp } from "@/app/components/coffee-app";

export default function Home() {
  return (
    <Suspense fallback={null}>
      <CoffeeApp />
    </Suspense>
  );
}
