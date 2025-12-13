"use client";
import React from "react";
import { Award, Calendar, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";
import CountUp from "react-countup";

export default function StatsSection() {
  const stats = [
    { icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />, number: 500, suffix: "+", label: "Happy Clients" },
    { icon: <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />, number: 1000, suffix: "+", label: "Events Completed" },
    { icon: <Award className="w-5 h-5 sm:w-6 sm:h-6" />, number: 5, suffix: "+", label: "Years Experience" },
    { icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />, number: 98, suffix: "%", label: "Satisfaction Rate" },
  ];

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white/70 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-4xl md:text-5xl font-bold text-center text-gray-900 mb-8 sm:mb-12"
        >
          Our <span className="text-pink-500">Achievements</span>
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center p-4 sm:p-6 bg-white/70 backdrop-blur-md rounded-2xl border border-white/20 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-pink-500 mb-2 sm:mb-3 flex justify-center">
                {stat.icon}
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-0.5 sm:mb-1">
                <CountUp
                  end={stat.number}
                  duration={2.5}
                  suffix={stat.suffix}
                  enableScrollSpy
                  scrollSpyOnce
                />
              </div>
              <div className="text-gray-700 text-xs sm:text-sm font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
