"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const reviews = [
  {
    id: 1,
    name: "Adarsh",
    role: "Wedding Event",
    review: "Absolutely stunning decoration! Everything was perfectly arranged and exceeded our expectations.",
    rating: 5,
    date: "2 weeks ago",
  },
  {
    id: 2,
    name: "Vishnu",
    role: "Birthday Celebration",
    review: "Professional team with beautiful designs. The setup was elegant and very well managed.",
    rating: 5,
    date: "1 month ago",
  },
  {
    id: 3,
    name: "Sethupathi",
    role: "Corporate Event",
    review: "High-quality work and on-time execution. The decor added a premium touch to our event.",
    rating: 4,
    date: "3 weeks ago",
  },
  {
    id: 4,
    name: "Ajay",
    role: "Anniversary Party",
    review: "They transformed our backyard into a magical space. Attention to detail was incredible.",
    rating: 5,
    date: "2 months ago",
  },
];

export default function CustomerReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (isHovering) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isHovering]);

  return (
    <section className="relative w-full py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our{" "}
            <span className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">
              Clients Say
            </span>
          </h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Real experiences from our happy customers
          </p>
        </motion.div>

        {/* Review Carousel */}
        <div 
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-8 z-20 bg-white/80 backdrop-blur-sm text-gray-900 p-2 sm:p-3 rounded-full shadow-lg border border-gray-200 hover:bg-white hover:scale-110 transition-all"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-8 z-20 bg-white/80 backdrop-blur-sm text-gray-900 p-2 sm:p-3 rounded-full shadow-lg border border-gray-200 hover:bg-white hover:scale-110 transition-all"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Review Card */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8 md:p-10"
              >
                <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 mb-4" />
                
                <p className="text-gray-800 text-lg sm:text-xl leading-relaxed mb-6">
                  "{reviews[currentIndex].review}"
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < reviews[currentIndex].rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">
                        {reviews[currentIndex].name}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {reviews[currentIndex].role} • {reviews[currentIndex].date}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {reviews.map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentIndex 
                            ? 'bg-gradient-to-r from-amber-500 to-pink-500 w-8' 
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

     

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-700 mb-6">Ready to create your own success story?</p>
          <a
            href="https://wa.me/918072287335"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-2xl transition-all transform hover:scale-105"
          >
            Share Your Experience
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}