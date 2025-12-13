import React from 'react'
import { Check, Clock, Crown, Flower2, Palette, PartyPopper, Sparkles } from 'lucide-react';

export default function ServiceSection() {
  return (
    <section
      id="services"
      className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 to-pink-50"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our <span className="text-amber-600">Services</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive event decoration services tailored to make your special moments unforgettable
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <Flower2 className="w-8 h-8" />,
              title: "Wedding Decorations",
              description: "Complete wedding decoration services including mandap, venue decoration, and theme-based designs.",
              features: ["Mandap Decoration", "Venue Setup", "Theme Design", "Floral Arrangements"],
            },
            {
              icon: <PartyPopper className="w-8 h-8" />,
              title: "Birthday Parties",
              description: "Vibrant and creative birthday decorations for all ages with custom themes and props.",
              features: ["Theme Parties", "Balloon Decor", "Photo Booths", "Custom Cakes"],
            },
            {
              icon: <Palette className="w-8 h-8" />,
              title: "Corporate Events",
              description: "Professional decoration for corporate events, conferences, and business gatherings.",
              features: ["Brand Integration", "Stage Setup", "Lighting", "Audio Visual"],
            },
            {
              icon: <Sparkles className="w-8 h-8" />,
              title: "Engagement & Anniversary",
              description: "Romantic and elegant decorations for engagement ceremonies and anniversary celebrations.",
              features: ["Romantic Setup", "Candle Decor", "Flower Arrangements", "Personalized Touches"],
            },
            {
              icon: <Crown className="w-8 h-8" />,
              title: "Premium Packages",
              description: "Luxury decoration packages with premium materials and exclusive designs.",
              features: ["Premium Materials", "Exclusive Designs", "VIP Treatment", "Custom Creation"],
            },
            {
              icon: <Clock className="w-8 h-8" />,
              title: "Event Planning",
              description: "End-to-end event planning and decoration services for stress-free celebrations.",
              features: ["Full Planning", "Vendor Management", "Day Coordination", "Setup & Cleanup"],
            },
          ].map((service, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 border border-white/20"
            >
              <div className="text-amber-500 mb-4 group-hover:scale-105 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                {service.description}
              </p>
              <ul className="space-y-1">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-700 text-sm">
                    <Check className="w-3 h-3 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}