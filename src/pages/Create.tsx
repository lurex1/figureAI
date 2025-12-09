import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WorkflowContainer } from "@/components/workflow/WorkflowContainer";

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <WorkflowContainer />
      </main>
      <Footer />
    </div>
  );
}
