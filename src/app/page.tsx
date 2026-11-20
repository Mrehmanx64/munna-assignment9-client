import React from "react";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { ReviewsSection } from "@/components/home/ReviewsSection";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F1]">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturedSection />
        <CategoriesSection />
        <WhyChooseUs />
        <ReviewsSection />
      </main>
      <Footer />
    </div>
  );
}
