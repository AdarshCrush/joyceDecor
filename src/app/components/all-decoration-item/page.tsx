"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Save, X, Crown, Video, Image as ImageIcon } from "lucide-react";
import Contact from "../contact";
import AllCategory from "../all-category";
import FullPageLoader from "../FullPageLoader";
// Update your imports
import { 
  uploadBase64ToCloudinary, 
   deleteMultipleFromCloudinary,
 } from '../../../utils/cloudinary';
import { fileToBase64 } from '../../../utils/fileToBase64';


// Types
interface Decoration {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  video: string[];
  description: string;
  features: string[];
  rating: number;
  reviews: number;
  createdAt: string;
}

const allCategories = [
  "Wedding", "Birthday", "Corporate", "Engagement", "Anniversary", "Baby Shower",
  "Table", "Chair", 'Catering', "Popcorn", "Cotton Candy", "Balloon Decor", 
  "Stage Decor", "Lighting",
];

const DecorationEventApp = () => {
  const [decorations, setDecorations] = useState<Decoration[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDecoration, setEditingDecoration] = useState<Decoration | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Form states - simplified (REMOVED price and originalPrice)
  const [formData, setFormData] = useState({
    title: "",
    category: "Wedding",
    description: "",
    features: [""],
    images: [""],
    video: [""],
    rating: "5.0",
    reviews: "0",
  });

  // Data fetching
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/post');
      if (response.ok) {
        const data = await response.json();
        setDecorations(data || []);
      }
    } catch (error) {
      console.error('Failed to fetch decorations:', error);
      setDecorations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDecorations = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      if (data.role === "admin") {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error('Error fetching decorations:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchDecorations();
  }, [fetchData, fetchDecorations]);

  // API calls
  const apiCall = useCallback(async (url: string, options: RequestInit) => {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }, []);

  const addDecorationToDB = useCallback(async (decoration: Omit<Decoration, 'id'>) => {
    return apiCall('/api/post', {
      method: 'POST',
      body: JSON.stringify(decoration),
    });
  }, [apiCall]);

  const updateDecorationInDB = useCallback(async (id: string, decoration: Partial<Decoration>) => {
    return apiCall(`/api/post/${id}`, {
      method: 'PUT',
      body: JSON.stringify(decoration),
    });
  }, [apiCall]);

  const deleteDecorationFromDB = useCallback(async (id: string) => {
    return apiCall(`/api/post/${id}`, {
      method: 'DELETE',
    });
  }, [apiCall]);


  // Add this function to your main component
const validateFile = (file: File, type: 'image' | 'video'): string | null => {
  // File size limits
  const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_VIDEO_SIZE = 30 * 1024 * 1024; // 30MB
  
  // Allowed file types
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/mov'];

  const maxSize = type === 'image' ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
  const allowedTypes = type === 'image' ? ALLOWED_IMAGE_TYPES : ALLOWED_VIDEO_TYPES;
  const maxSizeMB = maxSize / 1024 / 1024;

  // Check file size
  if (file.size > maxSize) {
    return `${type === 'image' ? 'Image' : 'Video'} size must be less than ${maxSizeMB}MB`;
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return `Invalid ${type} type. Allowed: ${allowedTypes.join(', ')}`;
  }

  return null; // No error
};

// Replace your current handleImageUpload and handleVideoUpload with these:

const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const error = validateFile(file, 'image');
  if (error) {
    alert(error);
    event.target.value = '';
    return;
  }

  try {
    // REMOVED: setLoading(true);
    
    // Step 1: Convert file to base64
    const base64String = await fileToBase64(file);
    
    // Step 2: Upload base64 to Cloudinary
    const uploadResult = await uploadBase64ToCloudinary(base64String, file.name);
    
    // Step 3: Store Cloudinary URL (not base64)
    const newImages = [...formData.images];
    newImages[index] = uploadResult.secure_url;
    
    setFormData(prev => ({ ...prev, images: newImages }));
    
    console.log('✅ Image uploaded to Cloudinary:', uploadResult.secure_url);
  } catch (error: any) {
    console.error('❌ Upload failed:', error);
    alert('Upload failed: ' + error.message);
  } finally {
    // REMOVED: setLoading(false);
  }
};

const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const error = validateFile(file, 'video');
  if (error) {
    alert(error);
    event.target.value = '';
    return;
  }

  try {
    // REMOVED: setLoading(true);
    
    // Step 1: Convert file to base64
    const base64String = await fileToBase64(file);
    
    // Step 2: Upload base64 to Cloudinary
    const uploadResult = await uploadBase64ToCloudinary(base64String, file.name);
    
    // Step 3: Store Cloudinary URL (not base64)
    const newVideos = [...formData.video];
    newVideos[index] = uploadResult.secure_url;
    
    setFormData(prev => ({ ...prev, video: newVideos }));
    
    console.log('✅ Video uploaded to Cloudinary:', uploadResult.secure_url);
  } catch (error: any) {
    console.error('❌ Upload failed:', error);
    alert('Upload failed: ' + error.message);
  } finally {
    // REMOVED: setLoading(false);
  }
};

  // Add decoration - SIMPLIFIED (no base64 processing)
const handleAddDecoration = async () => {
  if (!formData.title.trim()) {
    alert("Please fill in required fields (Title)");
    return;
  }

  if (!formData.images.some(img => img.trim())) {
    alert("Please add at least one image");
    return;
  }

  try {
    setLoading(true);


    const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      if (data.role === "admin") {
        setIsAdmin(true);
      }
    const newDecorationData = {
      title: formData.title.trim(),
      price: 0, // Set default price to 0 since it's removed from form
      category: formData.category,
      images: formData.images.filter(url => url.trim() && url.includes('cloudinary')), // Ensure only Cloudinary URLs
      video: formData.video.filter(url => url.trim() && url.includes('cloudinary')),   // Ensure only Cloudinary URLs
      description: formData.description.trim(),
      features: formData.features.filter((f) => f.trim()),
      rating: Number(formData.rating) || 5.0,
      reviews: Number(formData.reviews) || 0,
      createdAt: new Date().toISOString().split("T")[0],
      userId:data.userId
    };

    // Validate that we have Cloudinary URLs
    const invalidImages = newDecorationData.images.filter(img => !img.includes('cloudinary'));
    const invalidVideos = newDecorationData.video.filter(vid => !vid.includes('cloudinary'));
    
    if (invalidImages.length > 0 || invalidVideos.length > 0) {
      throw new Error('Some files were not properly uploaded to Cloudinary. Please try again.');
    }

    // Optimistic update
    const tempId = `temp-${Date.now()}`;
    const optimisticDecoration: Decoration = {
      ...newDecorationData,
      id: tempId,
    };

    setDecorations(prev => [optimisticDecoration, ...prev]);

    const newDecoration = await addDecorationToDB(newDecorationData);
    
    // Replace optimistic update with real data
    setDecorations(prev => 
      prev.map(d => d.id === tempId ? newDecoration : d)
    );
    
    resetForm();
    alert("Decoration added successfully!");
    location.reload();
  } catch (error) {
    // Rollback optimistic update
    setDecorations(prev => prev.filter(d => !d.id.startsWith('temp-')));
    alert(error instanceof Error ? error.message : "Failed to add decoration. Please try again.");
  } finally {
    setLoading(false);
  }
};

const handleCloudinaryCleanup = async (filesToDelete: string[]) => {
  try {
    if (filesToDelete.length === 0) return;
    
    console.log('🔄 Cleaning up Cloudinary files:', filesToDelete);
    await deleteMultipleFromCloudinary(filesToDelete);
    console.log('✅ Successfully cleaned up Cloudinary files');
  } catch (error) {
    console.error('❌ Cloudinary cleanup failed:', error);
    // Don't throw error - this is a background cleanup operation
  }
};

const handleEditDecoration = useCallback((decoration: Decoration) => {
  setEditingDecoration(decoration);
  setFormData({
    title: decoration.title || '',
    category: decoration.category || 'Wedding',
    description: decoration.description || '',
    features: decoration.features?.length > 0 ? decoration.features : [''],
    images: decoration.images?.length > 0 ? decoration.images : [''],
    video: decoration.video?.length > 0 ? decoration.video : [''],
    rating: decoration.rating?.toString() || '5.0',
    reviews: decoration.reviews?.toString() || '0',
  });
  setShowAddForm(true);
}, []);
 

const handleUpdateDecoration = async () => {
  if (!editingDecoration) return;

  try {
    setLoading(true);
    console.log('🔄 Starting update process...');

    const oldDecoration = decorations.find(d => d.id === editingDecoration.id);
    
    const updatedData = {
      title: formData.title.trim(),
      price: 0, // Set default price to 0 since it's removed from form
      category: formData.category,
      images: formData.images.filter(url => url.trim()),
      video: formData.video.filter(url => url.trim()),
      description: formData.description.trim(),
      features: formData.features.filter((f) => f.trim()),
      rating: Number(formData.rating) || 5.0,
      reviews: Number(formData.reviews) || 0,
    };

    // Validate required fields
    if (!updatedData.title || !updatedData.category) {
      alert("Title and category are required");
      return;
    }

    if (updatedData.images.length === 0) {
      alert("At least one image is required");
      return;
    }

    // Find removed files for Cloudinary cleanup
    let filesToDelete: string[] = [];
    if (oldDecoration) {
      const removedImages = oldDecoration.images.filter(oldImage => 
        !updatedData.images.includes(oldImage)
      );
      
      const removedVideos = oldDecoration.video.filter(oldVideo => 
        !updatedData.video.includes(oldVideo)
      );
      
      filesToDelete = [...removedImages, ...removedVideos];
      console.log('📁 Files marked for Cloudinary deletion:', filesToDelete);
      
      // Log file types for debugging
      if (removedImages.length > 0) {
        console.log('🖼️ Images to delete:', removedImages);
      }
      if (removedVideos.length > 0) {
        console.log('🎥 Videos to delete:', removedVideos);
      }
    }

    // Step 1: Update database FIRST (most important)
    console.log('🗃️ Updating database...');
    await updateDecorationInDB(editingDecoration.id, updatedData);
    console.log('✅ Database updated successfully');

    // Step 2: Update UI state
    setDecorations(prev => 
      prev.map(d => d.id === editingDecoration.id ? 
        { ...d, ...updatedData, id: editingDecoration.id } : d
      )
    );

    // Step 3: Background Cloudinary cleanup (non-blocking)
    if (filesToDelete.length > 0) {
      console.log('☁️ Starting background Cloudinary cleanup...');
      console.log(`📊 Cleaning up ${filesToDelete.length} files (images & videos)`);
      
      // Don't await - run in background
      deleteMultipleFromCloudinary(filesToDelete)
        .then(() => console.log('✅ Cloudinary cleanup completed for all files'))
        .catch(error => console.warn('⚠️ Cloudinary cleanup had issues (non-critical):', error));
    }

    setRefreshTrigger(prev => prev + 1);
    resetForm();
    
    console.log('✅ Update process completed successfully');
    alert("Decoration updated successfully!");
    
  } catch (error) {
    console.error('❌ Update failed:', error);
    alert(`Update failed: ${error instanceof Error ? error.message : 'Please try again'}`);
  } finally {
    setLoading(false);
  }
};

const handleDeleteDecoration = async (id: string) => {
  const decorationToDelete = decorations.find(d => d.id === id);
  
  if (!decorationToDelete) {
    alert("Decoration not found!");
    return;
  }

  if (!confirm(`Are you sure you want to delete "${decorationToDelete.title}"? This action cannot be undone.`)) {
    return;
  }

  try {
    setLoading(true);
    console.log('🔄 Starting delete process...');

    // Get ALL files for Cloudinary cleanup (both images and videos)
    const allFilesToDelete = [
      ...decorationToDelete.images,
      ...decorationToDelete.video
    ].filter(url => url && url.trim() !== '');

    console.log('📁 All files found:', allFilesToDelete);

    // Separate Cloudinary and non-Cloudinary files
    const cloudinaryFiles = allFilesToDelete.filter(url => url.includes('cloudinary'));
    const nonCloudinaryFiles = allFilesToDelete.filter(url => !url.includes('cloudinary'));

    console.log('☁️ Cloudinary files to delete:', cloudinaryFiles);
    console.log('📄 Non-Cloudinary files:', nonCloudinaryFiles);

    // Separate images and videos for better logging
    const imagesToDelete = cloudinaryFiles.filter(url => url.includes('/image/upload/'));
    const videosToDelete = cloudinaryFiles.filter(url => url.includes('/video/upload/'));

    console.log(`🖼️ Images to delete: ${imagesToDelete.length}`, imagesToDelete);
    console.log(`🎥 Videos to delete: ${videosToDelete.length}`, videosToDelete);

    // Step 1: Delete from database FIRST (most important)
    console.log('🗃️ Deleting from database...');
    await deleteDecorationFromDB(id);
    console.log('✅ Database delete successful');

    // Step 2: Update UI state
    setDecorations(prev => prev.filter(d => d.id !== id));
    console.log('✅ UI state updated');

    // Step 3: Background Cloudinary cleanup (non-blocking)
    if (cloudinaryFiles.length > 0) {
      console.log('☁️ Starting background Cloudinary cleanup...');
      console.log(`📊 Total Cloudinary files to delete: ${cloudinaryFiles.length}`);
      
      // Use a more direct approach for video deletion
      deleteMultipleFromCloudinary(cloudinaryFiles)
        .then(() => {
          console.log('✅ Cloudinary cleanup completed');
          // Additional check for videos
          if (videosToDelete.length > 0) {
            console.log(`✅ Successfully processed ${videosToDelete.length} videos`);
          }
        })
        .catch(error => {
          console.warn('⚠️ Cloudinary cleanup had issues:', error);
          // Even if Cloudinary fails, the main delete operation is successful
        });
    } else {
      console.log('ℹ️ No Cloudinary files to delete');
    }

    setRefreshTrigger(prev => prev + 1);
    
    console.log('✅ Delete process completed successfully');
    alert("Decoration deleted successfully!");
    
  } catch (error) {
    console.error('❌ Delete failed:', error);
    alert(`Delete failed: ${error instanceof Error ? error.message : 'Please try again'}`);
  } finally {
    setLoading(false);
  }
};

 

 

  const handleWhatsAppEnquiry = (decoration: Decoration) => {
    const message = `Hi! I'm interested in "${
      decoration.title
    }" for ₹${decoration.price.toLocaleString()}. Please provide more details.`;
    const whatsappUrl = `https://wa.me/918072287335?text=${encodeURIComponent(
      message
    )}`;
    window.location.href = whatsappUrl;
  };

  const resetForm = useCallback(() => {
    setFormData({
      title: "",
      category: "Wedding",
      description: "",
      features: [""],
      images: [""],
      video: [""],
      rating: "5.0",
      reviews: "0",
    });
    setEditingDecoration(null);
    setShowAddForm(false);
  }, []);

  // Form field handlers
  const addFeatureField = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, ""]
    }));
  }, []);

  const addImageField = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ""]
    }));
  }, []);

  const addVideoField = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      video: [...prev.video, ""]
    }));
  }, []);

  const updateFeature = useCallback((index: number, value: string) => {
    setFormData(prev => {
      const newFeatures = [...prev.features];
      newFeatures[index] = value;
      return { ...prev, features: newFeatures };
    });
  }, []);

  const removeFeature = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  }, []);

  const removeImage = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  }, []);

  const removeVideo = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      video: prev.video.filter((_, i) => i !== index)
    }));
  }, []);

  const handleAdminLogin = useCallback(() => {
    if (adminPassword === "admin123") {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPassword("");
    } else {
      alert("Invalid password");
    }
  }, [adminPassword]);

  if (loading && decorations.length === 0) {
    return <FullPageLoader />;
  }

  return (
    <>
      <AllCategory
        key={refreshTrigger}
        servicesdata={decorations}
        isAdmin={isAdmin}
        onEditDecoration={handleEditDecoration}
        onDeleteDecoration={handleDeleteDecoration}
        onWhatsAppEnquiry={handleWhatsAppEnquiry}
        setShowAddForm={setShowAddForm}
        loading={loading}
      />
      <Contact/>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full transform animate-scale-in">
            <div className="text-center mb-2">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Admin Login
              </h2>
              <p className="text-gray-600">
                Enter password to access admin panel
              </p>
            </div>
            <input
              type="password"
              placeholder="Enter admin password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 mb-6 text-center font-mono"
              onKeyPress={(e) => e.key === "Enter" && handleAdminLogin()}
              autoFocus
            />
            <div className="flex space-x-4">
              <button
                onClick={handleAdminLogin}
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setShowAdminLogin(false);
                  setAdminPassword("");
                }}
                className="flex-1 border border-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Decoration Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-md w-full max-h-[95vh] overflow-y-auto transform animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {editingDecoration ? "Edit Item" : "Add New Item"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700 p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <form className="space-y-4 sm:space-y-6" onSubmit={(e) => e.preventDefault()}>
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 sm:px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter item title"
                  required
                />
              </div>

              {/* Ratings & Reviews */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Rating *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                    className="w-full px-3 sm:px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                    placeholder="0.0 - 5.0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Reviews
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.reviews}
                    onChange={(e) => setFormData(prev => ({ ...prev, reviews: e.target.value }))}
                    className="w-full px-3 sm:px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                    placeholder="Number of reviews"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 sm:px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                >
                  {allCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 resize-vertical"
                  placeholder="Enter item description"
                  required
                />
              </div>

              {/* Images Section */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center">
                    <ImageIcon className="w-4 h-4 mr-2 text-blue-500" />
                    Images *
                  </label>
                  <button
                    type="button"
                    onClick={addImageField}
                    className="bg-blue-500 text-white px-3 py-1.5 text-sm rounded-md hover:bg-blue-600 transition-all duration-300 flex items-center font-medium"
                  >
                    <Plus className="w-3 h-3 mr-1.5" />
                    Add Image
                  </button>
                </div>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, index)}
                          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                      
                      {/* Image Preview */}
                      {image && (
                        <div className="relative">
                          <img
                            src={image}
                            alt={`Preview ${index + 1}`}
                            className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                          />
                        </div>
                      )}
                      
                      {formData.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all duration-300 min-w-9"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Select images (max 10MB). Supported: JPG, PNG, WebP
                </p>
              </div>

              {/* Videos Section */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center">
                    <Video className="w-4 h-4 mr-2 text-purple-500" />
                    Videos
                  </label>
                  <button
                    type="button"
                    onClick={addVideoField}
                    className="bg-purple-500 text-white px-3 py-1.5 text-sm rounded-md hover:bg-purple-600 transition-all duration-300 flex items-center font-medium"
                  >
                    <Plus className="w-3 h-3 mr-1.5" />
                    Add Video
                  </button>
                </div>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {formData.video.map((video, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleVideoUpload(e, index)}
                          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                      
                      {/* Video Preview */}
                      {video && (
                        <div className="relative">
                          <video
                            src={video}
                            className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                            muted
                            preload="metadata"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Video className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                      
                      {formData.video.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVideo(index)}
                          className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all duration-300 min-w-9"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Select videos (max 50MB). Supported: MP4, WebM, MOV
                </p>
              </div>

              {/* Features */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Features
                  </label>
                  <button
                    type="button"
                    onClick={addFeatureField}
                    className="bg-blue-500 text-white px-3 py-1.5 text-sm rounded-md hover:bg-blue-600 transition-all duration-300 flex items-center font-medium"
                  >
                    <Plus className="w-3 h-3 mr-1.5" />
                    Add
                  </button>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter feature"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all duration-300 min-w-9"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 sm:gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={editingDecoration ? handleUpdateDecoration : handleAddDecoration}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 text-sm font-semibold rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Processing..." : editingDecoration ? "Update" : "Add Item"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default DecorationEventApp;