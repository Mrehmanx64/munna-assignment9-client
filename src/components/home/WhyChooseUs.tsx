"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  CalendarDays,
  BadgeDollarSign,
  Lock,
  ArrowRight,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

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
      icon: BadgeDollarSign,
      title: "Affordable Rental Prices",
      badge: "Cost Efficiency",
      description:
        "Transparent industrial pricing with zero hidden surcharges, competitive contractor day rates, and clear deposit terms upfront.",
    },
    {
      icon: ShieldCheck,
      title: "Verified Equipment Owners",
      badge: "100% Vetted",
      description:
        "Every equipment supplier undergoes our mandatory 5-point mechanical audit, maintenance record review, and identity certification.",
    },
    {
      icon: CalendarDays,
      title: "Flexible Rental Periods",
      badge: "Dynamic Scheduling",
      description:
        "Lease on your timeline: by the single day, shift, week, or multi-month construction phase with instant digital extensions.",
    },
    {
      icon: Lock,
      title: "Secure Payments & Escrow",
      badge: "Escrow Protected",
      description:
        "Payments are held safely in escrow and only disbursed once the machinery arrives on your jobsite and passes optical sign-off.",
    },
  ];

  return (
    <>
      {/* Editorial Why Choose Us Section */}
      <section id="why-us" className="py-20 sm:py-28 bg-[#F7F6F1] border-b border-[#E7E7DF] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 space-y-6"
            >
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D99A42]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Why Choose Rentora</span>
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#183C32] tracking-tight leading-[1.12]">
                Industrial Reliability,
                <br />
                <span className="text-[#202824]">Re-engineered From the Ground Up.</span>
              </h2>

              <p className="text-base text-[#525B55] leading-relaxed">
                Traditional equipment rental involves outdated paper contracts, unverified machinery condition, and unpredictable yard dispatch delays. Rentora pairs peer-to-peer fleet capacity with enterprise-grade contractor safeguards.
              </p>

              {/* 4 Core Pillars Required by Specification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3">
                {pillars.map((pillar, idx) => {
                  const Icon = pillar.icon;
                  return (
                    <motion.div
                      key={pillar.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      className="p-5 rounded-xs bg-white border border-[#E5E4DC] hover:border-[#183C32] hover:shadow-md transition-all space-y-2.5 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xs bg-[#EBEAE3] group-hover:bg-[#183C32] group-hover:text-[#D99A42] flex items-center justify-center text-[#183C32] transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6A726B] bg-[#F7F6F1] px-2 py-0.5 rounded-xs border border-[#ECEBE3]">
                          {pillar.badge}
                        </span>
                      </div>
                      <h3 className="font-heading text-sm font-bold text-[#183C32]">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-[#6A726B] leading-relaxed">
                        {pillar.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Right Asymmetric Image Composition */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-6 relative"
            >
              <div className="relative h-[480px] sm:h-[540px] rounded-sm overflow-hidden border border-[#DCDBCF] shadow-xl bg-[#EAE8DE]">
                <Image
                  src="https://images.unsplash.com/photo-1779285756094-85ddc78ead65?q=80&w=1356&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
                  alt="Professional construction engineers inspecting heavy telescopic machinery"
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#11231D]/85 via-transparent to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-xs bg-[#11231D]/90 backdrop-blur-md border border-[#234A3C] text-white space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#D99A42]">
                    Site Certified Fleet
                  </span>
                  <p className="text-sm font-semibold leading-snug">
                    &ldquo;Rentora eliminated equipment downtime on our 14-month downtown infrastructure project. The telematics transparency and verified owner network saved us hundreds of hours.&rdquo;
                  </p>
                  <p className="text-xs text-[#9AA39C]">
                    — David K., Operations Director, Bay Area Civil Contractors
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Visual Storytelling Section */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-white border-b border-[#E7E7DF] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-16 space-y-3"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-[#D99A42]">
              Three-Step Operational Flow
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#183C32] tracking-tight">
              How Equipment Rental Works
            </h2>
            <p className="text-sm sm:text-base text-[#6A726B]">
              From digital requisition to jobsite ignition in three seamless, friction-free phases.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((step, idx) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="relative p-8 rounded-sm bg-[#F7F6F1] border border-[#E5E4DC] hover:border-[#183C32] hover:shadow-md transition-all flex flex-col justify-between space-y-6"
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
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-14 text-center"
          >
            <Link
              href="/equipment"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#183C32] hover:bg-[#245344] text-[#F7F6F1] text-sm font-semibold rounded-xs shadow-xs transition-colors cursor-pointer"
            >
              <span>Explore Fleet Catalog Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
