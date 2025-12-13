import React, { useEffect, useState } from "react";
import { MessageCircle, ChevronRight } from "lucide-react";

export default function Section() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const heroImages = [
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&h=800&fit=crop",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      id="home"
      className="relative py-10 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[90vh] flex items-center"
    >
      {/* Background Slideshow */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-2000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image}
              alt={`Hero Background ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        ))}
      </div>

      {/* Animated Content */}
      <div className="max-w-7xl mx-auto relative text-center px-2">
        <div
          className={`transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* ✅ Responsive Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Make Your
            <span className="block bg-gradient-to-r from-amber-300 to-pink-300 bg-clip-text text-transparent">
              Events Shine
            </span>
          </h1>

          {/* ✅ Responsive Subtitle */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 font-light px-2">
            Professional event decoration services that transform your vision
            into breathtaking reality — from intimate gatherings to grand
            celebrations.
          </p>

          {/* ✅ Responsive Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <button className="group bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:from-amber-600 hover:to-amber-700">
              <span className="flex items-center">
                Explore Gallery
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            <a
              href="https://wa.me/918072287335"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white/20 backdrop-blur-sm text-white border border-white/30 px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
            >
              <span className="flex items-center">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:scale-110 transition-transform" />
                WhatsApp Consultation
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
