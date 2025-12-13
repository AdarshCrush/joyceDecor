import React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Share2,
  ShoppingCart,
  Star,
  Play,
  Pause,
} from "lucide-react";

interface Decoration {
  id: string;
  title: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  video: string[];
  images: string[];
  description: string;
  features: string[];
  createdAt: string;
}

interface ImageGalleryProps {
  servicesdata: Decoration[];
  filteredDecorations: Decoration[];
  onShare: (decoration: Decoration) => void;
  isAdmin: boolean;
  onWhatsAppEnquiry: (decoration: Decoration) => void;
  loading?: boolean;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  servicesdata,
  filteredDecorations,
  onShare,
  isAdmin,
  onWhatsAppEnquiry,
  loading = false,
}) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const [currentMediaIndexes, setCurrentMediaIndexes] = useState<{
    [key: string]: number;
  }>({});
  
  const [isVideoPlaying, setIsVideoPlaying] = useState<{
    [key: string]: boolean;
  }>({});
  
  const [isAutoRotating, setIsAutoRotating] = useState<{
    [key: string]: boolean;
  }>({});
  
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const rotationIntervals = useRef<Map<string, NodeJS.Timeout>>(new Map());
  
  const router = useRouter();

  const categories = [
    { id: "All", name: "All Services", icon: "🎉" },
    { id: "Wedding", name: "Marriage Decor", icon: "💒" },
    { id: "Table", name: "Table Decoration", icon: "🍽️" },
    { id: "Chair", name: "Chair Covers", icon: "🪑" },
    { id: "Catering", name: "Catering", icon: "🍴" },
    { id: "Popcorn", name: "Popcorn Stall", icon: "🍿" },
    { id: "Cotton Candy", name: "Cotton Candy", icon: "🍭" },
    { id: "Balloon Decor", name: "Balloon Decor", icon: "🎈" },
    { id: "Stage Decor", name: "Stage Setup", icon: "🎭" },
    { id: "Lighting", name: "Lighting", icon: "💡" },
  ];

  // Function to get total media count
  const getTotalMedia = (decoration: Decoration) => {
    return decoration.images.length + decoration.video.length;
  };

  // Function to get current media type and URL
  const getCurrentMedia = (decoration: Decoration, currentIndex: number) => {
    if (currentIndex < decoration.images.length) {
      return {
        type: 'image' as const,
        url: decoration.images[currentIndex],
        index: currentIndex
      };
    } else {
      const videoIndex = currentIndex - decoration.images.length;
      return {
        type: 'video' as const,
        url: decoration.video[videoIndex],
        index: videoIndex
      };
    }
  };

  // Function to set video ref
  const setVideoRef = (decorationId: string, element: HTMLVideoElement | null) => {
    if (element) {
      videoRefs.current.set(decorationId, element);
    } else {
      videoRefs.current.delete(decorationId);
    }
  };

  // Function to get video ref
  const getVideoRef = (decorationId: string): HTMLVideoElement | null => {
    return videoRefs.current.get(decorationId) || null;
  };

  // Start automatic rotation for a decoration
  const startAutoRotation = (decorationId: string) => {
    const decoration = servicesdata.find(d => d.id === decorationId);
    if (!decoration) return;

    const totalMedia = getTotalMedia(decoration);
    if (totalMedia <= 1) return;

    // Clear existing interval
    const existingInterval = rotationIntervals.current.get(decorationId);
    if (existingInterval) {
      clearInterval(existingInterval);
    }

    // Start new interval
    const interval = setInterval(() => {
      setCurrentMediaIndexes(prev => {
        const currentIndex = prev[decorationId] || 0;
        const nextIndex = (currentIndex + 1) % totalMedia;
        
        // Stop current video if playing
        if (isVideoPlaying[decorationId]) {
          const video = getVideoRef(decorationId);
          if (video) {
            video.pause();
            setIsVideoPlaying(prevState => ({
              ...prevState,
              [decorationId]: false
            }));
          }
        }

        return {
          ...prev,
          [decorationId]: nextIndex
        };
      });
    }, 4000); // Change every 4 seconds

    rotationIntervals.current.set(decorationId, interval);
    setIsAutoRotating(prev => ({
      ...prev,
      [decorationId]: true
    }));
  };

  // Stop automatic rotation for a decoration
  const stopAutoRotation = (decorationId: string) => {
    const interval = rotationIntervals.current.get(decorationId);
    if (interval) {
      clearInterval(interval);
      rotationIntervals.current.delete(decorationId);
    }
    setIsAutoRotating(prev => ({
      ...prev,
      [decorationId]: false
    }));
  };

  // Function to handle media navigation
  const handleMediaNavigation = (
    decorationId: string,
    direction: "next" | "prev" | number
  ) => {
    // Stop auto rotation temporarily when user interacts
    stopAutoRotation(decorationId);

    setCurrentMediaIndexes((prev) => {
      const decoration = servicesdata.find((d) => d.id === decorationId);
      if (!decoration) return prev;

      const currentIndex = prev[decorationId] || 0;
      const totalMedia = getTotalMedia(decoration);
      let newIndex;

      if (direction === "next") {
        newIndex = (currentIndex + 1) % totalMedia;
      } else if (direction === "prev") {
        newIndex = currentIndex === 0 ? totalMedia - 1 : currentIndex - 1;
      } else {
        newIndex = direction;
      }

      // Stop current video if playing
      if (isVideoPlaying[decorationId]) {
        const video = getVideoRef(decorationId);
        if (video) {
          video.pause();
          setIsVideoPlaying(prevState => ({
            ...prevState,
            [decorationId]: false
          }));
        }
      }

      return {
        ...prev,
        [decorationId]: newIndex,
      };
    });

    // Restart auto rotation after 10 seconds
    setTimeout(() => {
      startAutoRotation(decorationId);
    }, 10000);
  };

  // Function to handle video play/pause
  const handleVideoToggle = (decorationId: string) => {
    const video = getVideoRef(decorationId);
    if (video) {
      if (video.paused) {
        // Stop auto rotation when video starts playing
        stopAutoRotation(decorationId);
        video.play().catch(error => {
          console.log('Video play failed:', error);
        });
        setIsVideoPlaying(prev => ({
          ...prev,
          [decorationId]: true
        }));
      } else {
        video.pause();
        setIsVideoPlaying(prev => ({
          ...prev,
          [decorationId]: false
        }));
        // Restart auto rotation when video is paused
        startAutoRotation(decorationId);
      }
    }
  };

  // Handle video end - move to next media when video ends
  const handleVideoEnd = (decorationId: string) => {
    setIsVideoPlaying(prev => ({
      ...prev,
      [decorationId]: false
    }));
    
    // Move to next media after video ends
    setTimeout(() => {
      handleMediaNavigation(decorationId, "next");
      // Restart auto rotation
      startAutoRotation(decorationId);
    }, 1000);
  };

  // Initialize auto rotation for all decorations with multiple media
  useEffect(() => {
    if (servicesdata.length > 0) {
      servicesdata.forEach(decoration => {
        const totalMedia = getTotalMedia(decoration);
        if (totalMedia > 1) {
          startAutoRotation(decoration.id);
        }
      });
    }

    // Cleanup intervals on component unmount
    return () => {
      rotationIntervals.current.forEach((interval) => {
        clearInterval(interval);
      });
      rotationIntervals.current.clear();
    };
  }, [servicesdata]);

  // Auto-play videos when they come into view and are the current media
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const decorationId = entry.target.getAttribute('data-decoration-id');
          if (!decorationId) return;

          const decoration = servicesdata.find(d => d.id === decorationId);
          const currentIndex = currentMediaIndexes[decorationId] || 0;
          
          if (decoration && entry.isIntersecting) {
            const currentMedia = getCurrentMedia(decoration, currentIndex);
            
            if (currentMedia.type === 'video') {
              const video = getVideoRef(decorationId);
              if (video && video.paused) {
                // Stop auto rotation when video starts playing automatically
                stopAutoRotation(decorationId);
                video.play().catch(error => {
                  console.log('Autoplay blocked for video:', decorationId);
                });
                setIsVideoPlaying(prev => ({
                  ...prev,
                  [decorationId]: true
                }));
              }
            }
          } else if (decorationId) {
            // Pause video when not in view
            const video = getVideoRef(decorationId);
            if (video && !video.paused) {
              video.pause();
              setIsVideoPlaying(prev => ({
                ...prev,
                [decorationId]: false
              }));
              // Restart auto rotation when video goes out of view
              if (!isVideoPlaying[decorationId]) {
                startAutoRotation(decorationId);
              }
            }
          }
        });
      },
      {
        threshold: 0.7,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    // Observe all video elements
    videoRefs.current.forEach((video, decorationId) => {
      observer.observe(video);
    });

    return () => {
      observer.disconnect();
    };
  }, [servicesdata, currentMediaIndexes]);

  // Initialize states when servicesdata are loaded
  useEffect(() => {
    const initialIndexes: { [key: string]: number } = {};
    const initialVideoStates: { [key: string]: boolean } = {};
    const initialRotationStates: { [key: string]: boolean } = {};
    
    servicesdata.forEach((decoration) => {
      initialIndexes[decoration.id] = 0;
      initialVideoStates[decoration.id] = false;
      initialRotationStates[decoration.id] = getTotalMedia(decoration) > 1;
    });
    
    setCurrentMediaIndexes(initialIndexes);
    setIsVideoPlaying(initialVideoStates);
    setIsAutoRotating(initialRotationStates);
  }, [servicesdata]);

  // Fixed function with proper TypeScript typing
  const filterByCategories = (
    decorations: Decoration[],
    categoriesToFilter: string[]
  ): Decoration[] => {
    return decorations.filter((item) =>
      categoriesToFilter.includes(item.category)
    );
  };

  // Fixed categories array - removed the empty element at the beginning
  const weddingBirthdayData = filterByCategories(servicesdata, [
    "Wedding",
    "Table",
    "Chair",
    "Catering",
    "Popcorn",
    "Cotton-candy",
    "Balloon",
    "Stage",
    "Lighting",
  ]);

  // Filter services based on active category and search query
  const filteredServices = weddingBirthdayData.filter((service) => {
    const matchesCategory =
      activeCategory === "All" || service.category === activeCategory;
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.features.some((feature) =>
        feature.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white" id="services">
      <div className="flex justify-end py-3"></div>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-6">
            Explore Our <span className="text-amber-600">Services</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            Discover our comprehensive range of event decoration services
            tailored to make your celebrations unforgettable.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800">Categories</h3>
            <div className="flex items-center space-x-1 md:space-x-2 text-gray-600">
              <Filter size={16} className="md:w-5 md:h-5" />
              <span className="text-sm md:text-base font-medium">Filter</span>
            </div>
          </div>

          <div className="flex overflow-x-auto space-x-2 md:space-x-3 pb-2 md:pb-3 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 flex items-center space-x-1 md:space-x-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                  activeCategory === cat.id
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg md:shadow-xl"
                    : "bg-white text-gray-700 hover:bg-amber-50 border border-amber-100 shadow-sm md:shadow-md"
                }`}
              >
                <span className="text-base md:text-lg">{cat.icon}</span>
                <span className="text-xs md:text-sm whitespace-nowrap">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid - EXACT SAME AS DecorationEventApp */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.slice(0, 6).map((decoration, index) => {
            const currentIndex = currentMediaIndexes[decoration.id] || 0;
            const totalMedia = getTotalMedia(decoration);
            const hasMultipleMedia = totalMedia > 1;
            const currentMedia = getCurrentMedia(decoration, currentIndex);
            const isVideo = currentMedia.type === 'video';

            return (
              <div
                key={decoration.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 flex flex-col"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
                onMouseEnter={() => stopAutoRotation(decoration.id)}
                onMouseLeave={() => {
                  if (!isVideoPlaying[decoration.id]) {
                    startAutoRotation(decoration.id);
                  }
                }}
              >
                {/* Media Section with Auto-Rotation - EXACT SAME */}
                <div className="relative h-60 overflow-hidden">
                  {/* Main Media (Image or Video) */}
                  {isVideo ? (
                    <div className="relative w-full h-full">
                      <video
                        ref={(el) => setVideoRef(decoration.id, el)}
                        data-decoration-id={decoration.id}
                        src={currentMedia.url}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        onPlay={() => setIsVideoPlaying(prev => ({...prev, [decoration.id]: true}))}
                        onPause={() => setIsVideoPlaying(prev => ({...prev, [decoration.id]: false}))}
                        onEnded={() => handleVideoEnd(decoration.id)}
                        onError={(e) => {
                          console.error('Video loading error:', e);
                          const video = e.target as HTMLVideoElement;
                          console.log('Video src:', video.src);
                          console.log('Video error:', video.error);
                        }}
                        onLoadedData={() => {
                          console.log('Video loaded successfully:', decoration.id, currentMedia.url);
                        }}
                      />
                      {/* Video Controls Overlay */}
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                        <button
                          onClick={() => handleVideoToggle(decoration.id)}
                          className="opacity-0 group-hover:opacity-100 bg-black/50 text-white p-2 rounded-full transition-all duration-300 transform hover:scale-110"
                        >
                          {isVideoPlaying[decoration.id] ? (
                            <Pause size={16} />
                          ) : (
                            <Play size={16} />
                          )}
                        </button>
                      </div>
                      {/* Video Badge */}
                      <div className="absolute top-2 right-2 bg-black/20 text-white px-2 py-1 rounded text-xs font-medium">
                        VIDEO
                      </div>
                    </div>
                  ) : (
                    <img
                      src={currentMedia.url}
                      alt={decoration.title || "Decoration image"}
                      className="w-full h-full object-cover transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300/ffffff/cccccc?text=No+Image";
                      }}
                    />
                  )}

                  {/* Media Dots and Navigation - EXACT SAME */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-full flex justify-between z-10 px-2">
                    {/* Category Badge */}
                    <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap shadow-sm">
                      {decoration.category}
                    </span>
                    
                    {hasMultipleMedia && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center justify-center space-x-2 z-10">
                        {/* Left Arrow */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMediaNavigation(decoration.id, "prev");
                          }}
                          className="bg-black/30 text-white p-1 rounded-full hover:bg-black/50 transition-all duration-300 transform hover:scale-110"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>

                        {/* Dots - Images are white, Videos are blue */}
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: totalMedia }).map((_, index) => {
                            const mediaType = index < decoration.images.length ? 'image' : 'video';
                            const isActive = index === currentIndex;
                            
                            return (
                              <button
                                key={index}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMediaNavigation(decoration.id, index);
                                }}
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                  isActive
                                    ? mediaType === 'video' 
                                      ? "bg-blue-400 scale-125" 
                                      : "bg-white scale-125"
                                    : "bg-white/50 hover:bg-white/80"
                                }`}
                                title={mediaType === 'video' ? 'Video' : 'Image'}
                              />
                            );
                          })}
                        </div>

                        {/* Right Arrow */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMediaNavigation(decoration.id, "next");
                          }}
                          className="bg-black/30 text-white p-1 rounded-full hover:bg-black/50 transition-all duration-300 transform hover:scale-110"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                    )}

                    {/* Rating Badge - Show only rating number (no reviews count) */}
                    <div className="flex items-center gap-0.5 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-gray-800 text-[10px] font-semibold">
                        {decoration.rating}
                      </span>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Compact Content - EXACT SAME */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors duration-300 line-clamp-1">
                    {decoration.title}
                  </h3>

                  <p className="text-gray-600 mb-3 leading-relaxed line-clamp-2 text-sm">
                    {decoration.description}
                  </p>

                  {/* Features - Compact */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {decoration.features.slice(0, 2).map((feature, index) => (
                      <span
                        key={index}
                        className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                    {decoration.features.length > 2 && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-medium">
                        +{decoration.features.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Compact WhatsApp Button */}
                  <div className="mt-auto">
                    <div className="flex space-x-2 items-center">
                      <button
                        onClick={() => onWhatsAppEnquiry(decoration)}
                        className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white py-2 rounded-lg font-semibold hover:shadow-md transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-1.5 text-xs"
                      >
                        <ShoppingCart size={12} />
                        <span>Book Now</span>
                      </button>
                      <button 
                        className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition-all duration-300 hover:scale-105" 
                        onClick={() => onShare(decoration)}
                      >
                        <Share2 size={12} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View More Collection Button */}
        {filteredDecorations.length > 0 && (
          <div className="text-center mt-8 mb-6">
            <button
              onClick={() => router.push("/components/all-decoration-item")}
              className="group relative bg-gradient-to-r from-amber-500 to-amber-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-xl transition-all duration-500 transform hover:scale-105 hover:from-amber-600 hover:to-amber-700 inline-flex items-center justify-center space-x-2 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>

              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

              <span className="text-sm relative z-10">
                View All Collection
              </span>
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 relative z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>

            {/* Small decorative text */}
            <p className="text-gray-500 text-xs mt-2">
              Discover {filteredDecorations.length * 3}+ more stunning designs
            </p>
          </div>
        )}

        {/* No Results Message */}
        {filteredServices.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-400 mb-6">
              <Search className="w-20 h-20 mx-auto mb-4 opacity-50" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              No services found
            </h3>
            <p className="text-gray-600 text-lg">
              Try adjusting your search or filter criteria to find what you're
              looking for.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ImageGallery;