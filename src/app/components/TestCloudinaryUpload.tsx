// // components/TestCloudinaryUpload.tsx
// import { useState } from 'react';
// import { fileToBase64 } from '../../utils/fileToBase64';
// import { uploadBase64ToCloudinary, deleteFromCloudinary, extractPublicIdFromUrl } from '../../utils/cloudinary';

// const TestCloudinaryUpload: React.FC = () => {
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<any>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [deleteResult, setDeleteResult] = useState<any>(null);

//   const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     try {
//       setLoading(true);
//       setError(null);
//       setDeleteResult(null);

//       console.log('📤 Converting file to base64...');
//       const base64String = await fileToBase64(file);
//       console.log('✅ Base64 conversion complete');

//       console.log('📤 Uploading base64 to Cloudinary...');
//       const uploadResult = await uploadBase64ToCloudinary(base64String, file.name);
      
//       setResult(uploadResult);
//       console.log('✅ Base64 upload successful:', uploadResult);
//     } catch (error: any) {
//       console.error('❌ Base64 upload failed:', error);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!result?.secure_url) {
//       setError('No file to delete. Please upload a file first.');
//       return;
//     }

//     try {
//       setDeleteLoading(true);
//       setError(null);
//       setDeleteResult(null);

//       console.log('🗑️ Starting delete process...');
//       console.log('📁 File to delete:', result.secure_url);

//       // Extract public_id from the URL
//       const publicId = extractPublicIdFromUrl(result.secure_url);
//       console.log('🔍 Extracted public_id:', publicId);

//       if (!publicId) {
//         throw new Error('Could not extract public_id from URL');
//       }

//       // Delete from Cloudinary using API route
//       console.log('🔄 Calling API route for deletion...');
//       const deleteSuccess = await deleteFromCloudinary(result.secure_url);
      
//       if (deleteSuccess) {
//         setDeleteResult({
//           success: true,
//           message: 'File successfully deleted from Cloudinary',
//           publicId: publicId,
//           deletedUrl: result.secure_url
//         });
//         console.log('✅ Delete successful');
        
//         // Clear the upload result since file is deleted
//         setResult(null);
//       } else {
//         throw new Error('Cloudinary deletion failed - check server logs');
//       }

//     } catch (error: any) {
//       console.error('❌ Delete failed:', error);
//       setError(error.message);
//     } finally {
//       setDeleteLoading(false);
//     }
//   };


//   // In your test component, add this function
// const testVideoDeletion = async () => {
//   const videoUrl = prompt('Enter Cloudinary VIDEO URL to test deletion:');
//   if (!videoUrl) return;

//   try {
//     setDeleteLoading(true);
//     setError(null);

//     console.log('🎥 Testing video deletion...');
//     console.log('📹 Video URL:', videoUrl);

//     const { publicId, resourceType } = extractFileInfoFromUrl(videoUrl);
//     console.log('🔍 Extracted info:', { publicId, resourceType });

//     if (!publicId) {
//       throw new Error('Invalid Cloudinary video URL');
//     }

//     if (resourceType !== 'video') {
//       throw new Error('This does not appear to be a video URL');
//     }

//     const deleteSuccess = await deleteFromCloudinary(videoUrl);
    
//     if (deleteSuccess) {
//       setDeleteResult({
//         success: true,
//         message: 'Video successfully deleted from Cloudinary',
//         publicId: publicId,
//         resourceType: resourceType,
//         deletedUrl: videoUrl
//       });
//       console.log('✅ Video delete successful');
//     } else {
//       throw new Error('Video deletion failed');
//     }

//   } catch (error: any) {
//     console.error('❌ Video delete test failed:', error);
//     setError(error.message);
//   } finally {
//     setDeleteLoading(false);
//   }
// };

// // Add this button to your test component JSX:


//   const handleDeleteByUrl = async () => {
//     const url = prompt('Enter Cloudinary URL to delete:');
//     if (!url) return;

//     try {
//       setDeleteLoading(true);
//       setError(null);
//       setDeleteResult(null);

//       console.log('🗑️ Starting delete by URL...');
//       console.log('📁 URL to delete:', url);

//       // Extract public_id from the URL
//       const publicId = extractPublicIdFromUrl(url);
//       console.log('🔍 Extracted public_id:', publicId);

//       if (!publicId) {
//         throw new Error('Invalid Cloudinary URL - could not extract public_id');
//       }

//       // Delete from Cloudinary using API route
//       console.log('🔄 Calling API route for deletion...');
//       const deleteSuccess = await deleteFromCloudinary(url);
      
//       if (deleteSuccess) {
//         setDeleteResult({
//           success: true,
//           message: 'File successfully deleted from Cloudinary',
//           publicId: publicId,
//           deletedUrl: url
//         });
//         console.log('✅ Delete successful');
//       } else {
//         throw new Error('Cloudinary deletion failed - check server logs');
//       }

//     } catch (error: any) {
//       console.error('❌ Delete failed:', error);
//       setError(error.message);
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   const clearAll = () => {
//     setResult(null);
//     setError(null);
//     setDeleteResult(null);
//   };

//   return (
//     <div className="p-6 border rounded-lg space-y-6 bg-white shadow-sm">
//       <h2 className="text-2xl font-bold text-gray-800">Test Cloudinary Upload & Delete</h2>
      
//       {/* Configuration Status */}
//       <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
//         <h3 className="font-semibold text-blue-800 mb-2">Cloudinary Configuration</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
//           <p><strong>Cloud Name:</strong> {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '❌ Not set'}</p>
//           <p><strong>API Key:</strong> {process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Not set'}</p>
//           <p><strong>API Secret:</strong> {process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Not set'}</p>
//         </div>
//         <p className="text-xs text-blue-600 mt-2">
//           ℹ️ Delete operations use server-side API route to avoid CORS issues
//         </p>
//       </div>

//       {/* Upload Section */}
//       <div className="space-y-4">
//         <h3 className="text-lg font-semibold text-gray-700">Upload Test</h3>
        
//         <div>
//           <label className="block text-sm font-medium mb-2 text-gray-600">
//             Select File (Image or Video):
//           </label>
//           <input
//             type="file"
//             accept="image/*,video/*"
//             onChange={handleUpload}
//             disabled={loading}
//             className="block w-full text-sm text-gray-500 
//                       file:mr-4 file:py-2 file:px-4 file:rounded-lg 
//                       file:border-0 file:text-sm file:font-semibold 
//                       file:bg-blue-500 file:text-white 
//                       hover:file:bg-blue-600 transition-colors
//                       disabled:opacity-50 disabled:cursor-not-allowed"
//           />
//         </div>

//         {loading && (
//           <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 p-3 rounded-lg">
//             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
//             <span>Converting to base64 and uploading...</span>
//           </div>
//         )}
//       </div>

//       {/* Results Section */}
//       <div className="space-y-4">
//         {error && (
//           <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
//             <div className="flex items-center space-x-2 text-red-700">
//               <span className="text-lg">❌</span>
//               <span className="font-semibold">Error:</span>
//             </div>
//             <p className="text-red-600 text-sm mt-1">{error}</p>
//           </div>
//         )}
        
//         {result && (
//           <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
//             <div className="flex items-center space-x-2 text-green-700 mb-3">
//               <span className="text-lg">✅</span>
//               <span className="font-semibold">Upload Successful!</span>
//             </div>
            
//             <div className="space-y-2 text-sm">
//               <p><strong>URL:</strong> 
//                 <a href={result.secure_url} target="_blank" rel="noopener noreferrer" 
//                    className="text-blue-600 hover:underline ml-2 break-all">
//                   {result.secure_url}
//                 </a>
//               </p>
//               <p><strong>Public ID:</strong> {result.public_id}</p>
//               <p><strong>Type:</strong> {result.resource_type}</p>
//               <p><strong>Size:</strong> {(result.bytes / 1024 / 1024).toFixed(2)} MB</p>
//             </div>

//             {result.resource_type === 'image' && (
//               <div className="mt-3">
//                 <p className="text-sm font-medium text-gray-600 mb-2">Preview:</p>
//                 <img 
//                   src={result.secure_url} 
//                   alt="Uploaded" 
//                   className="max-w-full h-auto max-h-64 rounded-lg border shadow-sm" 
//                 />
//               </div>
//             )}

//             {result.resource_type === 'video' && (
//               <div className="mt-3">
//                 <p className="text-sm font-medium text-gray-600 mb-2">Preview:</p>
//                 <video 
//                   src={result.secure_url} 
//                   controls 
//                   className="max-w-full h-auto max-h-64 rounded-lg border shadow-sm"
//                 >
//                   Your browser does not support the video tag.
//                 </video>
//               </div>
//             )}

//             {/* Delete Button for Uploaded File */}
//             <div className="mt-4 pt-4 border-t border-green-200">
//               <button
//                 onClick={handleDelete}
//                 disabled={deleteLoading}
//                 className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 
//                          disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 {deleteLoading ? 'Deleting via API...' : 'Delete This File'}
//               </button>
//             </div>
//           </div>
//         )}

//         {deleteResult && (
//           <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
//             <div className="flex items-center space-x-2 text-green-700 mb-2">
//               <span className="text-lg">🗑️</span>
//               <span className="font-semibold">Delete Successful!</span>
//             </div>
//             <div className="space-y-1 text-sm">
//               <p><strong>Public ID:</strong> {deleteResult.publicId}</p>
//               <p><strong>Message:</strong> {deleteResult.message}</p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Delete by URL Section */}
//       <div className="p-4 bg-gray-50 rounded-lg border">
//         <h3 className="text-lg font-semibold text-gray-700 mb-3">Delete by URL</h3>
//         <p className="text-sm text-gray-600 mb-3">
//           Test deletion by providing any Cloudinary URL directly
//         </p>
//         <button
//           onClick={handleDeleteByUrl}
//           disabled={deleteLoading}
//           className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 
//                    disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//         >
//           {deleteLoading ? 'Deleting via API...' : 'Delete by URL'}
//         </button>
//       </div>

//       {/* Add this section to your test component */}
// <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
//   <h3 className="text-lg font-semibold text-purple-700 mb-3">Test Video Deletion</h3>
//   <p className="text-sm text-purple-600 mb-3">
//     Specifically test video deletion functionality
//   </p>
//   <button
//     onClick={testVideoDeletion}
//     disabled={deleteLoading}
//     className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 
//              disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//   >
//     {deleteLoading ? 'Testing Video Delete...' : 'Test Video Deletion'}
//   </button>
// </div>

//       {/* Clear All Button */}
//       {(result || error || deleteResult) && (
//         <div className="flex justify-center">
//           <button
//             onClick={clearAll}
//             className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
//           >
//             Clear All Results
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TestCloudinaryUpload;