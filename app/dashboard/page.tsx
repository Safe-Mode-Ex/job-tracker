import { Suspense } from "react";
import ApplicationsBoard from "@/components/applications-board";

export default async function Dashboard() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ApplicationsBoard />
    </Suspense>
  );
}
