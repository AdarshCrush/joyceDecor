"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const eventPackages = [
  {
    id: "1",
    title: "🍽️Premium Catering",
    description: "Veg & Non-Veg Delicacies",
     features: [
      "Live Veg & Non-Veg Counters",
      "Hygienic Food Preparation",
      "Custom Menu Planning",
      "Professional Serving Staff",
    ],
    imageUrl: "./images/catering.webp",
   },
  {
    id: "2",
    title: "🚗Marriage Car Service",
    description: "Luxury Wedding Fleet",
     features: [
      "Decorated Wedding Cars",
      "Professional Chauffeurs",
      "Punctual & Reliable",
      "Multiple Vehicle Options",
    ],
    imageUrl: "./images/Audi-A6-1.jpg",
   },
  {
    id: "3",
    title: "🎵Live Orchestra",
    description: "Music & Entertainment",
     features: [
      "Live Band Performance",
      "DJ with Sound System",
      "Traditional & Modern Music",
      "Custom Playlist Setup",
    ],
    imageUrl: "./images/maxresdefault.jpg",
   },
];

const ChevronRight = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

export default function EventServicesShowcase() {
  const [currentPackage, setCurrentPackage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPackage((prev) => (prev + 1) % eventPackages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-10 bg-gradient-to-br from-amber-50 via-white to-orange-50 relative overflow-hidden">
      {/* Decorative glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,200,150,0.2),transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center relative z-10">
        {/* Left Content */}
        <motion.div
          className="space-y-6 sm:space-y-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
            Complete <span className="text-amber-600">Event</span>{" "}
            <span className="text-orange-500">Services</span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-xl">
            From gourmet catering to luxury transportation and live entertainment, 
            we provide comprehensive solutions for your perfect celebration.
          </p>

          {/* Service Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-amber-100 shadow-sm">
              <div className="text-amber-600 text-xl mb-1">👨‍🍳</div>
              <div className="font-semibold text-gray-900 text-sm sm:text-base">Expert Chefs</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-amber-100 shadow-sm">
              <div className="text-amber-600 text-xl mb-1">🚘</div>
              <div className="font-semibold text-gray-900 text-sm sm:text-base">Luxury Fleet</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-amber-100 shadow-sm col-span-2 sm:col-span-1">
              <div className="text-amber-600 text-xl mb-1">🎶</div>
              <div className="font-semibold text-gray-900 text-sm sm:text-base">Live Music</div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 sm:px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"
          >
            Book All Services
          </motion.button>
        </motion.div>

        {/* Right Content - Carousel */}
        <motion.div
          className="relative h-[350px] sm:h-[450px] lg:h-[550px]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {/* Background Rings */}
          <div
            className="absolute inset-0 rounded-full border-2 border-amber-500/20 animate-spin-slow"
            style={{ animationDuration: "20s" }}
          />
          <div
            className="absolute inset-4 sm:inset-8 rounded-full border-2 border-orange-500/20 animate-spin-slow"
            style={{ animationDuration: "15s", animationDirection: "reverse" }}
          />

          {/* Cards Carousel */}
          <div className="relative h-full flex items-center justify-center">
            {eventPackages.map((pkg, index) => {
              const isActive = index === currentPackage;
              const isPrev =
                index ===
                (currentPackage - 1 + eventPackages.length) % eventPackages.length;
              const isNext =
                index === (currentPackage + 1) % eventPackages.length;

              const getTransform = () => {
                if (isActive) return "translateX(0) scale(1) rotateY(0deg)";
                if (isPrev)
                  return "translateX(-100%) scale(0.7) rotateY(45deg)";
                if (isNext)
                  return "translateX(100%) scale(0.7) rotateY(-45deg)";
                return "translateX(0) scale(0.6)";
              };

              return (
                <div
                  key={pkg.id}
                  className="absolute w-[260px] sm:w-[300px] lg:w-[280px] h-[320px] sm:h-[380px] lg:h-[360px] transition-all duration-700 ease-out"
                  style={{
                    transform: getTransform(),
                    zIndex: isActive ? 30 : isPrev || isNext ? 20 : 10,
                    opacity: isActive ? 1 : isPrev || isNext ? 0.4 : 0,
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Glow for active card */}
                  {isActive && (
                    <div className="absolute -inset-3 sm:-inset-5 lg:-inset-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl blur-xl opacity-30" />
                  )}

                  {/* Card */}
                  <div className="relative flex flex-col justify-between h-full bg-white/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 shadow-xl group hover:shadow-2xl transition-all duration-300">
                    {/* Image Section */}
                    <div className="relative h-32 sm:h-40 lg:h-36 overflow-hidden">
                      <img
                        src={pkg.imageUrl}
                        alt={pkg.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent" />
                      
                      
                      
                    
                    </div>

                    {/* Content */}
                    <div className="p-3 sm:p-4 flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {pkg.title}
                        </h3>
                        <p className="text-sm text-amber-600 font-medium mb-2">
                          {pkg.description}
                        </p>
                        <ul className="text-gray-600 text-xs sm:text-sm mb-3 space-y-1">
                          {pkg.features.map((feature, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-amber-500 mr-2">•</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button className="w-full py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm">
                        Book This Service
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="absolute -bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 sm:gap-4">
            <button
              onClick={() =>
                setCurrentPackage(
                  (prev) =>
                    (prev - 1 + eventPackages.length) % eventPackages.length
                )
              }
              className="w-7 h-7 sm:w-9 sm:h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white hover:shadow-lg transition-all border border-amber-200 hover:border-amber-300"
            >
              <ChevronRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rotate-180" />
            </button>

            <div className="flex gap-1.5 sm:gap-2">
              {eventPackages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPackage(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                    index === currentPackage
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 w-4 sm:w-5"
                      : "bg-gray-300 hover:bg-amber-400"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() =>
                setCurrentPackage((prev) => (prev + 1) % eventPackages.length)
              }
              className="w-7 h-7 sm:w-9 sm:h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white hover:shadow-lg transition-all border border-amber-200 hover:border-amber-300"
            >
              <ChevronRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>

     
    </section>
  );
}