'use client';

export default function FullPageLoader() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-amber-50 via-white to-pink-50 flex items-center justify-center z-50">
      <div className="flex flex-col items-center justify-center">
        {/* Logo (ensure the path is correct, e.g., /image.jpeg or /image.jpg in /public) */}
        <img
          src="/images/logo.png" // or "/image.jpg" based on your actual file and location
          alt="Joyce Decors Logo"
          className="w-40 h-auto object-contain drop-shadow-lg"
        />
        {/* Single, smooth spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-amber-200 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin absolute left-0 top-0"></div>
        </div>
      </div>
    </div>
  );
}
