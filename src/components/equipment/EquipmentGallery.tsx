"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface EquipmentGalleryProps {
  images: string[];
  title: string;
}

export function EquipmentGallery({ images, title }: EquipmentGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const currentImage = images[activeIndex] || images[0];

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-3">
      {/* Main Large Image */}
      <div className="relative aspect-16/10 w-full rounded-sm overflow-hidden border border-[#DCDBCF] bg-[#EAE8DE] shadow-xs group">
        <Image
          src={currentImage}
          alt={`${title} - View ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover object-center transition-all duration-300"
        />

        {/* Carousel Prev/Next Controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-[#183C32] hover:bg-white flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-[#183C32] hover:bg-white flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Next Image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Fullscreen Expand Action */}
        <button
          onClick={() => setModalOpen(true)}
          className="absolute right-3 bottom-3 p-2 rounded-xs bg-[#11231D]/80 hover:bg-[#11231D] text-white backdrop-blur-xs transition-colors shadow-xs"
          title="Expand View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Slide Counter Indicator */}
        <div className="absolute left-3 bottom-3 px-2.5 py-1 rounded-xs bg-[#11231D]/80 backdrop-blur-xs text-[11px] font-mono font-medium text-white">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative aspect-16/10 rounded-xs overflow-hidden border-2 transition-all cursor-pointer ${
                activeIndex === idx
                  ? "border-[#183C32] ring-2 ring-[#D99A42]/50 scale-[1.02]"
                  : "border-[#E5E4DC] hover:border-[#8A948D] opacity-75 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal View */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setModalOpen(false)}
            className="absolute top-4 right-4 text-white text-sm font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xs"
          >
            ✕ Close View
          </button>
          <div className="relative max-w-5xl max-h-[85vh] w-full h-[70vh]">
            <Image
              src={currentImage}
              alt={title}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
