'use client';

import { useState, useEffect, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Star, MessageCircle, Share2, Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface Decoration {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  video: string[];
  rating: number;
  reviews: number;
  features: string[];
 }

const DecorationDetail = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [decoration, setDecoration] = useState<Decoration | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [showVideoControls, setShowVideoControls] = useState(false);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);

  useEffect(() => {
    if (id) {
      fetchDecorationById();
    }
  }, [id]);

  // Auto change media every 5 seconds
  useEffect(() => {
    if (!autoPlayEnabled || !decoration) return;

    const allMedia = getAllMedia();
    if (allMedia.length <= 1) return;

    const interval = setInterval(() => {
      if (mediaType === 'video' && isPlaying) return; // Don't auto-change while video is playing

      setCurrentMediaIndex(prev => {
        const nextIndex = prev === allMedia.length - 1 ? 0 : prev + 1;
        setMediaType(allMedia[nextIndex].type);
        setIsPlaying(allMedia[nextIndex].type === 'video');
        return nextIndex;
      });
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [autoPlayEnabled, decoration, mediaType, isPlaying]);

  // Update video playback when isPlaying changes
  useEffect(() => {
    if (videoRef.current && mediaType === 'video') {
      if (isPlaying) {
        videoRef.current.play().catch(console.error);
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, mediaType]);

  const fetchDecorationById = async () => {
    try {
      const response = await fetch(`/api/post/${id}`);
      if (response.ok) {
        const data = await response.json();
        setDecoration(data);
        // Set initial media type based on available content
        if (data.video && data.video.length > 0) {
          setMediaType('video');
        }
      }
    } catch (error) {
      console.error('Failed to fetch decoration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllMedia = () => {
    if (!decoration) return [];
    
    const allMedia: { type: 'image' | 'video'; src: string; index: number }[] = [];
    
    // Add videos first if available (like in cards)
    if (decoration.video && decoration.video.length > 0) {
      decoration.video.forEach((video, index) => {
        allMedia.push({ type: 'video', src: video, index });
      });
    }
    
    // Add images
    if (decoration.images && decoration.images.length > 0) {
      decoration.images.forEach((image, index) => {
        allMedia.push({ type: 'image', src: image, index });
      });
    }
    
    return allMedia;
  };

  const handleMediaNavigation = (direction: 'prev' | 'next') => {
    const allMedia = getAllMedia();
    if (allMedia.length === 0) return;
    
    // Stop auto-play when user manually navigates
    setAutoPlayEnabled(false);
    
    if (direction === 'prev') {
      const newIndex = currentMediaIndex === 0 ? allMedia.length - 1 : currentMediaIndex - 1;
      setCurrentMediaIndex(newIndex);
      setMediaType(allMedia[newIndex].type);
      setIsPlaying(allMedia[newIndex].type === 'video');
    } else {
      const newIndex = currentMediaIndex === allMedia.length - 1 ? 0 : currentMediaIndex + 1;
      setCurrentMediaIndex(newIndex);
      setMediaType(allMedia[newIndex].type);
      setIsPlaying(allMedia[newIndex].type === 'video');
    }
  };

  const handleThumbnailClick = (index: number, type: 'image' | 'video') => {
    // Stop auto-play when user manually selects a thumbnail
    setAutoPlayEnabled(false);
    setCurrentMediaIndex(index);
    setMediaType(type);
    setIsPlaying(type === 'video');
    setShowVideoControls(false);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVideoClick = () => {
    if (mediaType === 'video') {
      togglePlayPause();
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    // Auto-advance to next media if available
    const allMedia = getAllMedia();
    if (currentMediaIndex < allMedia.length - 1) {
      const newIndex = currentMediaIndex + 1;
      setCurrentMediaIndex(newIndex);
      setMediaType(allMedia[newIndex].type);
      setIsPlaying(allMedia[newIndex].type === 'video');
    }
  };

  const handleVideoLoad = () => {
    // Auto-play video when it loads if it's the current media
    if (mediaType === 'video' && isPlaying) {
      videoRef.current?.play().catch(console.error);
    }
  };

  const handleWhatsAppEnquiry = (decoration: Decoration) => {
    const message = `Hi! I'm interested in "${decoration.title}". Please provide more details.`;
    const whatsappUrl = `https://wa.me/918072287335?text=${encodeURIComponent(message)}`;
    window.location.href = whatsappUrl;
  };

  const handleShare = async () => {
    if (!decoration) return;

    if (navigator.share) {
      await navigator.share({
        title: decoration.title,
        text: decoration.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!decoration) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Decoration not found</h2>
          <button
            onClick={() => router.push('/')}
            className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
          >
            Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  const allMedia = getAllMedia();
  const currentMedia = allMedia[currentMediaIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-semibold text-sm">Back</span>
            </button>
            
            <button
              onClick={handleShare}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Compact Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-6">
            {/* Compact Media Gallery */}
            <div className="p-4">
              <div 
                className="relative h-60 sm:h-80 rounded-lg overflow-hidden mb-3 bg-black cursor-pointer"
                onMouseEnter={() => setShowVideoControls(true)}
                onMouseLeave={() => setShowVideoControls(false)}
                onClick={handleVideoClick}
              >
                {currentMedia && (
                  <>
                    {currentMedia.type === 'image' ? (
                      <img
                        src={currentMedia.src}
                        alt={decoration.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        <video
                          ref={videoRef}
                          src={currentMedia.src}
                          className="w-full h-full object-cover"
                          muted={isMuted}
                          loop
                          onEnded={handleVideoEnd}
                          onLoadedData={handleVideoLoad}
                          playsInline
                          preload="metadata"
                        />
                        
                        {/* Video Play/Pause Overlay - Similar to card view */}
                        {!isPlaying && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300">
                            <div className="bg-white/90 hover:bg-white text-gray-900 p-3 sm:p-4 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300">
                              <Play className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                          </div>
                        )}
                        
                        {/* Video Controls Overlay - Shows on hover */}
                        {(showVideoControls || !isPlaying) && mediaType === 'video' && (
                          <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-3 sm:space-x-4 bg-black/70 rounded-full px-3 sm:px-4 py-1 sm:py-2 transition-opacity duration-300">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePlayPause();
                              }}
                              className="text-white hover:text-amber-400 transition-colors"
                            >
                              {isPlaying ? <Pause className="w-3 h-3 sm:w-4 sm:h-4" /> : <Play className="w-3 h-3 sm:w-4 sm:h-4" />}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleMute();
                              }}
                              className="text-white hover:text-amber-400 transition-colors"
                            >
                              {isMuted ? <VolumeX className="w-3 h-3 sm:w-4 sm:h-4" /> : <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />}
                            </button>
                          </div>
                        )}
                        
                        {/* Video Badge - Always visible */}
                        {mediaType === 'video' && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold z-10 flex items-center space-x-1">
                            <Play className="w-3 h-3" />
                            <span className="hidden xs:inline">VIDEO</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Navigation Arrows - Smaller on mobile */}
                    {allMedia.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMediaNavigation('prev');
                          }}
                          className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-1 sm:p-2 rounded-full shadow-lg transition-all duration-300 z-10"
                        >
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMediaNavigation('next');
                          }}
                          className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-1 sm:p-2 rounded-full shadow-lg transition-all duration-300 z-10"
                        >
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-semibold z-10">
                          {currentMediaIndex + 1} / {allMedia.length}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Media Thumbnails */}
              {allMedia.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {allMedia.map((media, index) => (
                    <button
                      key={index}
                      onClick={() => handleThumbnailClick(index, media.type)}
                      className={`relative h-12 sm:h-14 rounded-md overflow-hidden border-2 transition-all ${
                        index === currentMediaIndex 
                          ? 'border-amber-500 scale-105' 
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      {media.type === 'image' ? (
                        <img
                          src={media.src}
                          alt={`${decoration.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="relative w-full h-full">
                          <video
                            src={media.src}
                            className="w-full h-full object-cover"
                            muted
                            preload="metadata"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Play className="w-3 h-3 text-white" />
                          </div>
                          <div className="absolute bottom-1 left-1">
                            <div className="bg-red-500 text-white px-1 rounded text-[10px] font-semibold">
                              VID
                            </div>
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Media Type Indicators */}
              <div className="flex space-x-2 mt-3">
                {decoration.video && decoration.video.length > 0 && (
                  <div className="flex items-center space-x-1 bg-red-50 text-red-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                    <Play className="w-3 h-3" />
                    <span>{decoration.video.length} Video{decoration.video.length > 1 ? 's' : ''}</span>
                  </div>
                )}
                {decoration.images && decoration.images.length > 0 && (
                  <div className="flex items-center space-x-1 bg-blue-50 text-blue-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{decoration.images.length} Image{decoration.images.length > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>

             
            </div>

            {/* Compact Content */}
            <div className="p-4 lg:p-6">
              {/* Compact Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full font-semibold">
                  {decoration.category}
                </span>
                
              </div>

              {/* Compact Title and Rating */}
              <div className="mb-4">
                <h1 className="text-xl font-bold text-gray-900 mb-2">
                  {decoration.title}
                </h1>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-gray-700 text-sm font-semibold">
                      {decoration.rating}
                    </span>
                    <span className="text-gray-500 text-sm">
                      ({decoration.reviews})
                    </span>
                  </div>
                </div>
              </div>

              {/* Compact Description */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-1">Description</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {decoration.description}
                </p>
              </div>

              {/* Compact Features */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {decoration.features && decoration.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2"
                    >
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compact Contact Section */}
              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
                {/* Compact WhatsApp Button */}
                <button
                  onClick={() => handleWhatsAppEnquiry(decoration)}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-md flex items-center justify-center space-x-2 text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contact on WhatsApp</span>
                </button>
                
                <p className="text-center text-gray-600 mt-2 text-xs">
                  Typically responds within 30 minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecorationDetail;