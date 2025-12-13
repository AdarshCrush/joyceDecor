import React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Plus,
   Share2,
  Edit,
  ShoppingCart,
  Trash2,
  Star,
   Play,
  Pause,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Decoration {
  id: string;
  title: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  images: string[];
  video: string[];
  description: string;
  features: string[];
   createdAt: string;
}

interface ImageGalleryProps {
  servicesdata: Decoration[];
  isAdmin: boolean;
  onEditDecoration: (decoration: Decoration) => void;
  onDeleteDecoration: (id: string) => void;
  onWhatsAppEnquiry: (decoration: Decoration) => void;
  setShowAddForm: (show: boolean) => void;
  loading?: boolean;
  refreshTrigger?: number;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  servicesdata,
  setShowAddForm,
  onEditDecoration,
  onDeleteDecoration,
  isAdmin,
  onWhatsAppEnquiry,
  loading = false,
  refreshTrigger = 0,
}) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  
  const router = useRouter();
  
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
  }, [servicesdata, refreshTrigger]);

  const categories = [
    { id: "All", name: "All Services", icon: "🎉" },
    { id: "Wedding", name: "Wedding Decor", icon: "💒" },
    { id: "Birthday", name: "Birthday Party", icon: "🎂" },
    { id: "Corporate", name: "Corporate Events", icon: "🏢" },
    { id: "Engagement", name: "Engagement Ceremony", icon: "💍" },
    { id: "Anniversary", name: "Anniversary Celebration", icon: "💖" },
    { id: "Baby Shower", name: "Baby Shower", icon: "🍼" },
    { id: "Table", name: "Table Decoration", icon: "🍽️" },
    { id: "Chair", name: "Chair Covers", icon: "🪑" },
    { id: "Catering", name: "Catering Services", icon: "🍴" },
    { id: "Popcorn", name: "Popcorn Stall", icon: "🍿" },
    { id: "Cotton Candy", name: "Cotton Candy Stall", icon: "🍭" },
    { id: "Balloon Decor", name: "Balloon Decoration", icon: "🎈" },
    { id: "Stage Decor", name: "Stage Setup", icon: "🎭" },
    { id: "Lighting", name: "Lighting Setup", icon: "💡" },
  ];

  const handleShare = async (decoration: Decoration) => {
    if (!decoration) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: decoration.title,
          text: decoration.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Filter services with safety checks
  const filteredServices = servicesdata.filter((service) => {
    const matchesCategory =
      activeCategory === "All" || service.category === activeCategory;

    const safeTitle = service.title?.toLowerCase() || "";
    const safeDescription = service.description?.toLowerCase() || "";
    const safeFeatures = service.features || [];
    const safeSearchQuery = searchQuery.toLowerCase();

    const matchesSearch =
      safeTitle.includes(safeSearchQuery) ||
      safeDescription.includes(safeSearchQuery) ||
      safeFeatures.some((feature) =>
        (feature?.toLowerCase() || "").includes(safeSearchQuery)
      );

    return matchesCategory && matchesSearch;
  });

  // Calculate pagination values
  const totalItems = filteredServices.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  // Get current page items
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredServices.slice(startIndex, endIndex);

  // Function to handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of the gallery
    const galleryElement = document.getElementById("gallery");
    if (galleryElement) {
      galleryElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show limited pages with ellipsis
      if (currentPage <= 3) {
        // Show first 4 pages and last page
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show first page and last 4 pages
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Show first, current-1, current, current+1, and last
        pageNumbers.push(1);
        pageNumbers.push("...");
        pageNumbers.push(currentPage - 1);
        pageNumbers.push(currentPage);
        pageNumbers.push(currentPage + 1);
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-5 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto ">
        {/* Search Bar */}
      <div className="flex flex-row" id="services">
          <div className="max-w-xl mx-auto md:mb-0 mb-3 w-2/3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2 md:py-4 border border-gray-200 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-lg transition-all duration-300 text-lg"
            />
          </div>
     
        </div>
             <div className=" ">
            {isAdmin && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center font-semibold"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </button>
            )}
          </div>
      </div>

        {/* Category Filter */}
        <div className="mb-12"         id="gallery"
>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Categories</h3>
            <div className="flex items-center space-x-2 text-gray-600">
              <Filter size={20} />
              <span className="font-medium">Filter</span>
            </div>
          </div>

          <div className="flex overflow-x-auto space-x-3 pb-3 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                  activeCategory === cat.id
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xl"
                    : "bg-white text-gray-700 hover:bg-amber-50 border border-amber-100 shadow-md"
                }`}
              >
                <span className="text-lg">{cat.icon}</span>
                <span className="text-xs sm:text-sm">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.map((decoration) => {
            const currentIndex = currentMediaIndexes[decoration.id] || 0;
            const totalMedia = getTotalMedia(decoration);
            const hasMultipleMedia = totalMedia > 1;
            const currentMedia = getCurrentMedia(decoration, currentIndex);
            const isVideo = currentMedia.type === 'video';

            return (
              <div
                key={decoration.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 group flex flex-col"
                onMouseEnter={() => stopAutoRotation(decoration.id)}
                onMouseLeave={() => {
                  if (!isVideoPlaying[decoration.id]) {
                    startAutoRotation(decoration.id);
                  }
                }}
              >
                {/* Media Section - Reduced Height */}
                <div className="relative overflow-hidden h-56">
                  {/* Main Media (Image or Video) */}
                  {isVideo ? (
                    <div className="relative w-full h-full">
                      {/* Video with proper event handling */}
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
                          className="opacity-0 group-hover:opacity-100 bg-black/50 text-white p-1.5 rounded-full transition-all duration-300 transform hover:scale-105"
                        >
                          {isVideoPlaying[decoration.id] ? (
                            <Pause size={14} />
                          ) : (
                            <Play size={14} />
                          )}
                        </button>
                      </div>
                      {/* Video Badge */}
                      <div className="absolute top-2   left-2 bg-black/20 text-white px-1.5 py-0.5 rounded text-xs font-medium">
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

                 

              

                  {/* Admin Actions - Compact */}
                  {isAdmin && (
                    <div className="absolute top-2 right-2 z-10 flex space-x-1.5">
                      <button
                        onClick={() => onEditDecoration(decoration)}
                        className="bg-blue-500 text-white p-1.5 rounded-full hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 shadow-md"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteDecoration(decoration.id)}
                        className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-md"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Media Navigation - Compact */}
                  {hasMultipleMedia && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-full flex justify-between z-10 px-2">
                      <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-semibold whitespace-nowrap shadow-sm">
                        {decoration.category}
                      </span>

                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center justify-center space-x-1.5 z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMediaNavigation(decoration.id, "prev");
                          }}
                          className="bg-black/30 text-white p-1 rounded-full hover:bg-black/50 transition-all duration-300 transform hover:scale-105"
                        >
                          <svg
                            className="w-2.5 h-2.5"
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
                        <div className="flex items-center space-x-0.5">
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
                                className={`w-1 h-1 rounded-full transition-all duration-300 ${
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

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMediaNavigation(decoration.id, "next");
                          }}
                          className="bg-black/30 text-white p-1 rounded-full hover:bg-black/50 transition-all duration-300 transform hover:scale-105"
                        >
                          <svg
                            className="w-2.5 h-2.5"
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

                      <div className="flex items-center gap-0.5 bg-white/80 backdrop-blur-sm px-1.5 py-0.5 rounded-full shadow-sm">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-gray-800 text-xs font-semibold">
                          {decoration.rating || 0}
                        </span>
                        <span className="text-gray-500 text-xs">
                          ({decoration.reviews || 0})
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Content Section - Compact */}
                <div className="p-4 flex-1 flex flex-col">
                  <h4 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors duration-300">
                    {decoration.title}
                  </h4>

                  <p className="text-gray-600 text-sm mb-3 leading-relaxed line-clamp-2">
                    {decoration.description}
                  </p>

                  {/* Features - Compact */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(decoration.features || [])
                      .slice(0, 2)
                      .map((feature, index) => (
                        <span
                          key={index}
                          className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-md font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                    {(decoration.features || []).length > 2 && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-md font-medium">
                        +{(decoration.features || []).length - 2} more
                      </span>
                    )}
                  </div>

                  {/* Rating Section (Price removed) */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1.5">
                      <Star
                        className="fill-yellow-400 text-yellow-400"
                        size={16}
                      />
                      <span className="font-semibold text-gray-800 text-sm">
                        {decoration.rating || 0}
                      </span>
                      <span className="text-gray-500 text-xs">
                        ({decoration.reviews || 0})
                      </span>
                    </div>
                    {/* Price section removed completely */}
                  </div>

                  {/* Buttons - Ultra Compact */}
                  <div className="mt-auto pt-1">
                    <div className="flex space-x-1.5 items-center">
                      {/* View Details Button */}
                      <button
                        onClick={() => router.push(`/components/cards/${decoration.id}`)}
                        className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:shadow-md transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-1 text-xs group/details border border-gray-300 hover:border-amber-300"
                      >
                        <svg className="w-3 h-3 group-hover/details:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>Details</span>
                      </button>

                      {/* Book Now Button */}
                      <button
                        onClick={() => onWhatsAppEnquiry(decoration)}
                        className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white py-2 rounded-lg font-semibold hover:shadow-md transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-1 text-xs"
                      >
                        <ShoppingCart size={12} />
                        <span>Book Now</span>
                      </button>

                      {/* Share Button */}
                      <button className="bg-gray-100 p-1.5 rounded-lg hover:bg-gray-200 transition-all duration-300 hover:scale-105" onClick={()=>handleShare(decoration)}>
                        <Share2 size={12} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

       {/* Pagination - Only show if there are more than 9 items */}
{totalItems > itemsPerPage && (
  <div className="mt-8 sm:mt-12 mb-6 sm:mb-8">
    {/* Pagination Info - Mobile Compact */}
    <div className="text-center mb-3 sm:mb-4">
      <p className="text-gray-600 text-xs sm:text-sm">
        Page <span className="font-semibold">{currentPage}</span> of{" "}
        <span className="font-semibold">{totalPages}</span> •{" "}
        <span className="font-semibold">{startIndex + 1}</span>-{Math.min(endIndex, totalItems)} of {totalItems}
      </p>
    </div>

    {/* Ultra Compact Mobile Row Layout */}
    <div className="flex items-center justify-between sm:justify-center gap-2 sm:gap-4">
      {/* Previous Button - Icon Only on Mobile */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center justify-center p-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-all duration-300 text-xs sm:text-sm ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:shadow-md hover:scale-105"
        }`}
      >
        <ChevronLeft size={16} className="sm:w-4 sm:h-4" />
        <span className="hidden sm:inline ml-1">Previous</span>
      </button>

      {/* Page Numbers - Compact */}
      <div className="flex items-center space-x-1 flex-1 justify-center">
        {getPageNumbers().map((pageNumber, index) => (
          <React.Fragment key={index}>
            {pageNumber === "..." ? (
              <span className="px-1 text-gray-400 text-xs">•••</span>
            ) : (
              <button
                onClick={() => handlePageChange(pageNumber as number)}
                className={`w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg font-medium transition-all duration-300 text-xs sm:text-sm ${
                  currentPage === pageNumber
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
                }`}
              >
                {pageNumber}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Next Button - Icon Only on Mobile */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center justify-center p-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-all duration-300 text-xs sm:text-sm ${
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:shadow-md hover:scale-105"
        }`}
      >
        <span className="hidden sm:inline mr-1">Next</span>
        <ChevronRight size={16} className="sm:w-4 sm:h-4" />
      </button>
    </div>

    {/* Page Jump - Very Compact */}
    <div className="mt-3 flex justify-center">
      <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
        <input
          type="number"
          min="1"
          max={totalPages}
          value={currentPage}
          onChange={(e) => {
            const page = parseInt(e.target.value);
            if (page >= 1 && page <= totalPages) {
              handlePageChange(page);
            }
          }}
          className="w-10 px-1.5 py-1 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-transparent text-xs"
          placeholder="Page"
        />
        <span className="text-xs text-gray-600 px-1.5">/ {totalPages}</span>
      </div>
    </div>
  </div>
)}

        {/* No Results */}
        {filteredServices.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
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