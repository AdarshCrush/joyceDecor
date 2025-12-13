import React, { useEffect, useState } from "react";

export default function Section() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
   <section className="relative py-20 overflow-hidden min-h-screen flex items-center bg-white">
  {/* Animated Background Elements */}
  <div className="absolute inset-0 opacity-10">
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-200 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-200 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
  </div>

  <div className="container mx-auto px-6 relative z-10">
    <div className="text-center mb-16">
    
      <h2 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900">
        Event Management
        <br />
        <span className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">
          Excellence
        </span>
      </h2>
      <p className="text-gray-700 text-lg max-w-2xl mx-auto">
        From intimate gatherings to grand celebrations, we orchestrate every detail perfectly
      </p>
    </div>

    {/* Photo Collage Grid */}
    <div className="grid grid-cols-12 gap-4 max-w-7xl mx-auto">
      {/* Corporate Events - Large */}
      <div className="col-span-12 md:col-span-5 row-span-2 group relative overflow-hidden rounded-3xl cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300"
           style={{animation: 'fadeInScale 0.8s ease-out 0.1s both'}}>
        <img 
          src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=900&fit=crop" 
          alt="Corporate Events"
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          style={{minHeight: '500px'}}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <div className="inline-block bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-1 rounded-full text-xs font-semibold mb-3 transform -translate-x-4 group-hover:translate-x-0 transition-transform duration-500">
              CORPORATE
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">Corporate Events</h3>
            <p className="text-white/80 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
              Professional conferences, seminars & product launches
            </p>
            <button className="bg-white text-amber-900 px-6 py-2 rounded-full font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 hover:bg-amber-50">
              View Details →
            </button>
          </div>
        </div>
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold">
          50+ Events
        </div>
      </div>

      {/* Birthday Parties - Medium */}
      <div className="col-span-6 md:col-span-4 group relative overflow-hidden rounded-3xl cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300"
           style={{animation: 'fadeInScale 0.8s ease-out 0.2s both'}}>
        <img 
          src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=400&fit=crop" 
          alt="Birthday Parties"
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          style={{minHeight: '240px'}}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="inline-block bg-gradient-to-r from-pink-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold mb-2">
              CELEBRATIONS
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">Birthday Parties</h3>
            <p className="text-white/70 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              Themed parties & milestone celebrations
            </p>
          </div>
        </div>
      </div>

      {/* Social Gatherings - Medium */}
      <div className="col-span-6 md:col-span-3 group relative overflow-hidden rounded-3xl cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300"
           style={{animation: 'fadeInScale 0.8s ease-out 0.3s both'}}>
        <img 
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&h=400&fit=crop" 
          alt="Social Events"
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          style={{minHeight: '240px'}}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="inline-block bg-gradient-to-r from-rose-500 to-rose-600 text-white px-3 py-1 rounded-full text-xs font-semibold mb-2">
              SOCIAL
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Social Events</h3>
            <p className="text-white/70 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              Engagement parties & reunions
            </p>
          </div>
        </div>
      </div>

      {/* Cultural Events - Medium Tall */}
      <div className="col-span-6 md:col-span-3 row-span-2 group relative overflow-hidden rounded-3xl cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300"
           style={{animation: 'fadeInScale 0.8s ease-out 0.4s both'}}>
        <img 
          src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500&h=700&fit=crop" 
          alt="Cultural Events"
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          style={{minHeight: '500px'}}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <div className="inline-block bg-gradient-to-r from-amber-400 to-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold mb-2">
              TRADITIONAL
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Cultural Events</h3>
            <p className="text-white/70 text-sm mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
              Festivals, traditional ceremonies & religious events
            </p>
            <button className="bg-white text-amber-900 px-4 py-2 rounded-full text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 hover:bg-amber-50">
              Explore →
            </button>
          </div>
        </div>
      </div>

      {/* Anniversary - Medium */}
      <div className="col-span-6 md:col-span-4 group relative overflow-hidden rounded-3xl cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300"
           style={{animation: 'fadeInScale 0.8s ease-out 0.5s both'}}>
        <img 
          src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop" 
          alt="Anniversary"
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          style={{minHeight: '240px'}}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="inline-block bg-gradient-to-r from-pink-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold mb-2">
              ROMANTIC
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">Anniversary</h3>
            <p className="text-white/70 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              Celebrating love & togetherness
            </p>
          </div>
        </div>
      </div>

      {/* Product Launch - Small */}
      <div className="col-span-6 md:col-span-4 group relative overflow-hidden rounded-3xl cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300"
           style={{animation: 'fadeInScale 0.8s ease-out 0.6s both'}}>
        <img 
          src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=350&fit=crop" 
          alt="Product Launch"
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          style={{minHeight: '200px'}}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="inline-block bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-full text-xs font-semibold mb-2">
              BUSINESS
            </div>
            <h3 className="text-xl font-bold text-white">Product Launches</h3>
          </div>
        </div>
      </div>

      {/* Charity Events - Small */}
      <div className="col-span-6 md:col-span-3 group relative overflow-hidden rounded-3xl cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300"
           style={{animation: 'fadeInScale 0.8s ease-out 0.7s both'}}>
        <img 
          src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=350&fit=crop" 
          alt="Charity Events"
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          style={{minHeight: '200px'}}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="inline-block bg-gradient-to-r from-rose-500 to-rose-600 text-white px-3 py-1 rounded-full text-xs font-semibold mb-2">
              GIVING BACK
            </div>
            <h3 className="text-xl font-bold text-white">Charity Events</h3>
          </div>
        </div>
      </div>

      {/* Concerts & Shows - Wide */}
      <div className="col-span-12 md:col-span-5 group relative overflow-hidden rounded-3xl cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300"
           style={{animation: 'fadeInScale 0.8s ease-out 0.8s both'}}>
        <img 
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=350&fit=crop" 
          alt="Concerts"
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          style={{minHeight: '200px'}}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/40 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="inline-block bg-gradient-to-r from-amber-500 to-pink-500 text-white px-4 py-1 rounded-full text-xs font-semibold mb-2">
              ENTERTAINMENT
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">Concerts & Shows</h3>
            <p className="text-white/70 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              Live performances, music festivals & entertainment events
            </p>
          </div>
        </div>
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold">
            Book Now
          </div>
        </div>
      </div>
    </div>

    {/* Bottom CTA */}
    <div className="text-center mt-16">
      <button className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-10 py-4 rounded-full text-lg font-bold hover:shadow-2xl transition-all transform hover:scale-105 shadow-lg">
        Explore All Event Services
      </button>
    </div>
  </div>
</section>
  );
}