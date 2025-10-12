import Header from "@/components/Landing/Header";
import Hero from "@/components/Landing/Hero";
import HowItWorks from "@/components/Landing/HowItWorks";
import WhatToAsk from "@/components/Landing/WhatToAsk";
import Pricing from "@/components/Landing/Pricing";
import CTA from "@/components/Landing/CTA";
import Footer from "@/components/Landing/Footer";
import { syncUser } from "@/lib/actions/users";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();

  await syncUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <HowItWorks />
      <WhatToAsk />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}
