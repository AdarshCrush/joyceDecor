'use client';
import { useEffect, useRef, useState } from "react";

const OwnerProfileSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-4 sm:py-8 bg-gradient-to-b from-amber-50 to-white"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Compact Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
            The <span className="text-amber-600">Artist</span> Behind Your Dreams
          </h2>
          <div className={`w-10 h-0.5 bg-gradient-to-r from-amber-400 to-orange-400 mx-auto rounded-full transition-all duration-300 ${isVisible ? 'scale-100' : 'scale-0'}`} />
        </div>

        {/* Mobile-Optimized Layout */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-center">
          
          {/* Left - Image Section - More Compact */}
          <div className="w-full lg:w-4/12">
            <div className={`relative transition-all duration-500 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
              {/* Compact Image Container */}
              <div className="relative mx-auto max-w-[200px] sm:max-w-xs lg:max-w-sm">
                <div className="aspect-square rounded-lg sm:rounded-xl overflow-hidden border-2 sm:border-3 border-white shadow-md">
                  <img
                    src="/images/singh.png"
                    alt="Prayer Singh"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                
                {/* Floating Elements - Very Small */}
                <div className={`absolute -top-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 bg-amber-400 rounded-lg rotate-12 shadow-sm transition-all duration-600 delay-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs">
                    9+
                  </div>
                </div>
                
                <div className={`absolute -bottom-2 -left-2 w-8 h-8 sm:w-10 sm:h-10 bg-orange-400 rounded-lg -rotate-12 shadow-sm transition-all duration-600 delay-400 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs">
                    500+
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Content Section */}
          <div className="w-full lg:w-8/12 space-y-3 sm:space-y-4">
            {/* Name & Title */}
            <div className={`transition-all duration-400 delay-100 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Prayer <span className="text-amber-600">Singh</span>
              </h1>
              <p className="text-sm sm:text-base text-orange-500 font-semibold mt-0.5">
                Master Decorator
              </p>
            </div>

            {/* Quote */}
            <div className={`border-l-2 border-amber-400 pl-2 sm:pl-3 transition-all duration-400 delay-150 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
              <p className="text-gray-600 text-xs sm:text-sm italic">
                "Crafting unforgettable experiences through perfect decorations"
              </p>
            </div>

            {/* Stats Grid */}
            <div className={`grid grid-cols-3 gap-2 sm:gap-3 transition-all duration-400 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}>
              <div className="text-center bg-white p-2 sm:p-3 rounded-lg shadow-sm border border-gray-100">
                <div className="text-base sm:text-lg font-bold text-amber-600">9+</div>
                <div className="text-xs text-gray-500">Years</div>
              </div>
              <div className="text-center bg-white p-2 sm:p-3 rounded-lg shadow-sm border border-gray-100">
                <div className="text-base sm:text-lg font-bold text-amber-600">500+</div>
                <div className="text-xs text-gray-500">Events</div>
              </div>
              <div className="text-center bg-white p-2 sm:p-3 rounded-lg shadow-sm border border-gray-100">
                <div className="text-base sm:text-lg font-bold text-amber-600">100%</div>
                <div className="text-xs text-gray-500">Satisfaction</div>
              </div>
            </div>

            {/* Personal Info - Ultra Compact */}
            <div className={`space-y-2 transition-all duration-400 delay-250 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 bg-amber-100 rounded-md flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-600 text-xs sm:text-sm">👑</span>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Founded 2015</p>
                  <p className="text-gray-900 font-medium text-xs sm:text-sm">Owner & Creative Director</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 bg-amber-100 rounded-md flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-600 text-xs sm:text-sm">⚡</span>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Specializes in</p>
                  <p className="text-gray-900 font-medium text-xs sm:text-sm">Weddings & Grand Events</p>
                </div>
              </div>
            </div>

            {/* Expertise Tags - Micro */}
            <div className={`transition-all duration-400 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex flex-wrap gap-1.5">
                {["Wedding", "Party", "Corporate", "Festival", "Custom"].map((tag, i) => (
                  <span 
                    key={i} 
                    className="px-1.5 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-full border border-amber-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Micro Signature */}
        <div className={`text-center mt-4 sm:mt-6 transition-all duration-400 delay-400 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="inline-flex flex-col items-center">
            <div className="text-gray-400 text-xs">Creating memories since 2015</div>
            <div className="text-amber-600 font-semibold text-sm">Prayer Singh</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OwnerProfileSection;