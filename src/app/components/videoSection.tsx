"use client";
import { motion } from "framer-motion";
import { MessageCircle, ChevronRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DecorationVideoSection() {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative w-full h-[600px] overflow-hidden md:pt-10 pt-15 shadow-2xl">
      {/* Background video */}
      <motion.video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <source src="/videos/video1.mp4" type="video/mp4" />
      </motion.video>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {/* Animated Content */}
      <div className="max-w-7xl mx-auto relative text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="transition-all duration-1000 delay-300"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-3 md:px-6 py-1 md:mb-1 mb-3 border border-white/30 overflow-hidden relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ backgroundPosition: "-200% center" }}
                animate={{ backgroundPosition: "200% center" }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "linear",
                }}
                style={{
                  backgroundSize: "200% 100%",
                }}
              />
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse relative z-10" />
              <span className="text-white text-sm font-semibold relative z-10">
                Creating Magical Moments Since 2018
              </span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-1 lg:mb-1 leading-tight">
  Make Your
  <span className="block bg-gradient-to-r from-amber-300 to-pink-300 bg-clip-text text-transparent relative">
    <motion.span
      className="block"
      initial={{ backgroundPosition: "200% center" }}
      animate={{ backgroundPosition: "-200% center" }}
      transition={{
        repeat: Infinity,
        duration: 3,
        ease: "linear",
      }}
      style={{
        backgroundSize: "200% auto",
        backgroundImage: "linear-gradient(90deg, #fbbf24, #f472b6, #fbbf24)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      Events Shine
    </motion.span>
  </span>
</h1>
          </motion.div>

          {/* Paragraph */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-4 md:mb-5 font-light">
              Professional event decoration services that transform your vision
              into breathtaking reality. From intimate gatherings to grand
              celebrations.
            </p>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-row flex-wrap justify-center items-center gap-2 sm:gap-6"
          >
            <motion.button
              onClick={() => router.push("/components/all-decoration-item")}
              className="group bg-gradient-to-r from-amber-500 to-amber-600 text-white
                px-2 py-2 sm:px-8 sm:py-3
                rounded-lg sm:rounded-2xl
                font-medium sm:font-semibold
                text-sm sm:text-lg
                hover:shadow-xl transition-all duration-300 transform
                hover:scale-105 hover:from-amber-600 hover:to-amber-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center">
                Explore Gallery
                <ChevronRight className="w-3 h-3 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>

            <motion.a
              href="https://wa.me/918072287335"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white/20 backdrop-blur-sm text-white border border-white/30
               px-2 py-2 sm:px-8 sm:py-3
               rounded-lg sm:rounded-2xl
               font-medium sm:font-semibold
               text-sm sm:text-lg
               hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center">
                <MessageCircle className="w-3 h-3 sm:w-5 sm:h-5 mr-2 group-hover:scale-110 transition-transform" />
                WhatsApp Consultation
              </span>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}