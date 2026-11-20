import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  CalendarDays,
  FileCheck2,
  Lock,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export function WhyChooseUs() {
  const steps = [
    {
      number: "01",
      title: "Discover Equipment",
      description:
        "Filter industrial machinery, cinema kits, and heavy haulers by proximity, technical capacity, and immediate jobsite availability.",
      highlights: ["Live telematics inspection", "Transparent daily/weekly rates"],
    },
    {
      number: "02",
      title: "Book & Lock Contract",
      description:
        "Submit required contractor licenses or COI credentials, select delivery window, and complete secure escrow payment.",
      highlights: ["Automated standard rental agreement", "Protected contractor escrow"],
    },
    {
      number: "03",
      title: "Get to Work",
      description:
        "Receive scheduled yard dispatch or on-site hauler drop-off with complete operator orientation and 24/7 hotline standby.",
      highlights: ["Same-day yard dispatch", "24/7 emergency site support"],
    },
  ];

  const pillars = [
    {
      icon: ShieldCheck,
      title: "Vetted Fleet Owners",
      description:
        "Every machine undergoes mechanical service audit and maintenance log verification before listing.",
    },
    {
      icon: CalendarDays,
      title: "Flexible Rental Horizons",
      description:
        "Rent by day, shift, week, or multi-month project phases with seamless digital extensions.",
    },
    {
      icon: FileCheck2,
      title: "Transparent Industrial Pricing",
      description:
        "All fees, security deposits, and transport costs clearly disclosed upfront. Zero hidden surcharges.",
    },
    {
      icon: Lock,
      title: "Escrow-Secured Transactions",
      description:
        "Payments held securely and only disbursed once equipment arrives on-site and passes optical check.",
    },
  ];

  return (
    <>
      {/* Editorial Why Choose Us Section */}
      <section id="why-us" className="py-20 sm:py-28 bg-[#F7F6F1] border-b border-[#E7E7DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D99A42]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#183C32]" />
                <span>The Rentora Difference</span>
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#183C32] tracking-tight leading-[1.12]">
                Industrial Reliability,
                <br />
                <span className="text-[#202824]">Re-engineered From the Ground Up.</span>
              </h2>

              <p className="text-base text-[#525B55] leading-relaxed">
                Traditional equipment rental involves outdated paper contracts, unverified machinery condition, and unpredictable yard dispatch delays. Rentora pairs peer-to-peer fleet capacity with enterprise-grade contractor safeguards.
              </p>

              {/* 4 Editorial Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                {pillars.map((pillar) => {
                  const Icon = pillar.icon;
                  return (
                    <div
                      key={pillar.title}
                      className="p-5 rounded-xs bg-white border border-[#E5E4DC] hover:border-[#183C32] transition-colors shadow-2xs space-y-2"
                    >
                      <div className="w-9 h-9 rounded-xs bg-[#EBEAE3] flex items-center justify-center text-[#183C32]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-heading text-sm font-bold text-[#183C32]">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-[#6A726B] leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Asymmetric Image Composition */}
            <div className="lg:col-span-6 relative">
              <div className="relative h-[480px] sm:h-[520px] rounded-sm overflow-hidden border border-[#DCDBCF] shadow-xl bg-[#EAE8DE]">
                <Image
                  src="https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=1200&q=80"
                  alt="Professional construction engineers inspecting heavy telescopic machinery"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#11231D]/80 via-transparent to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-xs bg-[#11231D]/90 backdrop-blur-md border border-[#234A3C] text-white space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#D99A42]">
                    Site Certified Fleet
                  </span>
                  <p className="text-sm font-semibold leading-snug">
                    &ldquo;Rentora eliminated equipment downtime on our 14-month downtown infrastructure project. The telematics transparency alone saved us hundreds of man-hours.&rdquo;
                  </p>
                  <p className="text-xs text-[#9AA39C]">
                    — David K., Operations Director, Bay Area Civil Contractors
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Visual Storytelling Section */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-white border-b border-[#E7E7DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D99A42]">
              Three-Step Operational Flow
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#183C32] tracking-tight">
              How Equipment Rental Works
            </h2>
            <p className="text-sm sm:text-base text-[#6A726B]">
              From digital requisition to jobsite ignition in three seamless, friction-free phases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative p-8 rounded-sm bg-[#F7F6F1] border border-[#E5E4DC] hover:border-[#183C32] transition-colors flex flex-col justify-between space-y-6"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-heading text-3xl font-extrabold text-[#183C32]/30">
                      {step.number}
                    </span>
                    <span className="w-8 h-8 rounded-full bg-[#EBEAE3] flex items-center justify-center text-[#183C32] text-xs font-bold">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="font-heading text-xl font-bold text-[#183C32] mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#5C665F] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E5E4DC] space-y-2">
                  {step.highlights.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs text-[#202824]">
                      <CheckCircle className="w-3.5 h-3.5 text-[#2E6B4F] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/equipment"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#183C32] hover:bg-[#245344] text-[#F7F6F1] text-sm font-semibold rounded-xs shadow-xs transition-colors"
            >
              <span>Explore Fleet Catalog Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
