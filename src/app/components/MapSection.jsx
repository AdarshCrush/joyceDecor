 import React from 'react';

const GoogleMapSection = () => {
  return (
    <section className="py-8 px-4 md:px-8 bg-gradient-to-br from-amber-50 to-white">
      <div className="max-w-4xl mx-auto">
        {/* Section Header - More Compact */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-serif text-gray-900 mb-3">
            Our Location
          </h2>
          <p className="text-gray-700 text-sm md:text-base max-w-xl mx-auto px-2">
            Located conveniently for easy access. Visit our studio to discover our 
            exquisite wedding decoration collections.
          </p>
        </div>

        {/* Map Container - More Compact */}
        <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-xl md:shadow-2xl border border-amber-200">
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100/20 to-rose-100/10 z-0"></div>
          
          {/* Map - Adjusted Height */}
          <div className="relative z-10 w-full h-[250px] sm:h-[350px] md:h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3936.123456789012!2d77.4385452!3d8.1699858!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b04f12b2d1c6f9b%3A0x3822147d4690275c!2sJoyce%20Decors!5e0!3m2!1sen!2sin!4v1744298633985!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Joyce Decors - Wedding Decor Studio"
              className="w-full h-full"
            />
          </div>

          {/* Overlay Info Card - Mobile Optimized */}
          <div className="absolute bottom-3 left-3 right-3 md:bottom-6 md:left-6 md:right-auto bg-white/95 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 shadow-xl max-w-full md:max-w-xs border border-amber-100">
            <div className="flex items-start gap-2 md:gap-3 mb-2 md:mb-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-amber-400 to-rose-400 rounded md:rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm md:text-lg">🎨</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base md:text-lg text-gray-900 truncate">Joyce Decors</h3>
                <p className="text-amber-600 text-xs md:text-sm font-medium">Wedding Decor Studio</p>
              </div>
            </div>
            
            <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
              <p className="text-gray-700 line-clamp-2">
                <span className="font-medium text-gray-900">📍 </span>
                South Street, Chetti Street Area
              </p>
              
              <div className="flex flex-wrap items-center gap-1.5 md:gap-2 pt-1 md:pt-2">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 font-medium text-xs md:text-sm">Open</span>
                </div>
                <span className="text-gray-400 hidden md:inline">•</span>
                <span className="text-gray-600 text-xs md:text-sm">Mon-Sat: 9AM-7PM</span>
              </div>
              
              <div className="flex items-center gap-1.5 md:gap-2">
                <span className="text-amber-500 text-xs md:text-sm">📞</span>
                <a href="tel:+918072287335" className="text-gray-700 hover:text-amber-600 text-xs md:text-sm truncate">
                  +91-8072287335
                </a>
              </div>
            </div>
          </div>

          {/* Map Controls Hint - Mobile Optimized */}
          <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-black/80 backdrop-blur-sm text-white px-2 py-1 md:px-3 md:py-1.5 rounded-full text-[10px] md:text-xs">
            🔍 Drag
          </div>
        </div>

        {/* Action Buttons - Mobile Optimized */}
      {/* Action Buttons - Compact on Mobile */}
        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 mt-6 md:mt-8">
          <a
            href="https://www.google.com/maps/dir//8.1699858,77.4401919/@8.169986,77.440192,17z"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 md:gap-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium px-4 py-2 md:px-6 md:py-3 rounded-lg transition-all duration-300 shadow hover:shadow-md md:shadow-lg hover:scale-105 active:scale-95 text-sm md:text-base whitespace-nowrap"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">Get Directions</span>
            <span className="sm:hidden">Directions</span>
          </a>
          
          <a
            href="https://www.google.com/maps/place/Joyce+Decors/@8.1699942,77.4401459,88m/data=!3m1!1e3!4m6!3m5!1s0x3b04f12b2d1c6f9b:0x3822147d4690275c!8m2!3d8.1699858!4d77.4401919!16s%2Fg%2F11yc1kwdjn?entry=ttu&g_ep=EgoyMDI1MTAyOS4yIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 md:gap-3 bg-white border border-amber-300 text-amber-700 hover:bg-amber-50 font-medium px-4 py-2 md:px-6 md:py-3 rounded-lg transition-all duration-300 shadow hover:shadow-md md:shadow-lg hover:scale-105 active:scale-95 text-sm md:text-base whitespace-nowrap"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">View on Maps</span>
            <span className="sm:hidden">Maps</span>
          </a>
          
          <a
            href="tel:+918072287335"
            className="inline-flex items-center justify-center gap-1.5 md:gap-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-4 py-2 md:px-6 md:py-3 rounded-lg transition-all duration-300 shadow hover:shadow-md md:shadow-lg hover:scale-105 active:scale-95 text-sm md:text-base whitespace-nowrap"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <span className="hidden sm:inline">Call Now</span>
            <span className="sm:hidden">Call</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default GoogleMapSection;