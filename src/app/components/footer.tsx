import React from "react";
import Image from "next/image";

import Link from "next/link";
import {
  ChevronRight,
   Phone,
  Mail,
  MapPin,
 } from "lucide-react";

export default function Footer() {
  const socialLinks = [
    {
      name: "Facebook",
      href: "https://facebook.com",
      icon: (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
      ),
      hoverColor: "hover:bg-blue-600 hover:shadow-blue-500/25",
    },
    {
      name: "Twitter",
      href: "https://wa.me/918072287335",
      icon: (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893c0-3.18-1.24-6.169-3.495-8.418" />
        </svg>
      ),
      hoverColor: "hover:bg-green-500 hover:shadow-green-500/25",
    },
    {
      name: "YouTube",
      href: "https://youtube.com",
      icon: (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
      hoverColor: "hover:bg-red-600 hover:shadow-red-500/25",
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/joycedecor.ngl",
      icon: (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
        </svg>
      ),
      hoverColor:
        "hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 hover:shadow-pink-500/25",
    },
  ];
  return (
    <>
      {/* Enhanced Footer */}
      <footer
        className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
       >
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative ">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-1 mb-5 ">
                <Image
                  src="/images/navlogo.png"
                  alt="JoycDecor Logo"
                  width={106}
                  height={56}
                  className="object-contain  "
                  priority
                />

                <div>
                  <h3 className="text-2xl font-serif font-bold">
                    Joyce<span className="text-amber-400">Decor</span>
                  </h3>
                  <p className="text-amber-200 text-sm font-medium">
                    Creating Magical Moments
                  </p>
                </div>
              </div>
              <p className="text-gray-300 mb-8 max-w-md leading-relaxed">
                Transforming ordinary events into extraordinary experiences with
                our premium decoration services. From intimate gatherings to
                grand celebrations, we make every moment unforgettable with
                creativity and excellence.
              </p>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:-translate-y-2 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-slate-900 ${social.hoverColor}`}
                    aria-label={`Follow us on ${social.name}`}
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-xl font-semibold mb-6 text-amber-100">
                Our Services
              </h4>
              <ul className="space-y-4 text-gray-300">
                {[
                  "Wedding Decoration ",
                  "Birthday Parties",
                  "Corporate Events",
                  "Engagement Ceremonies",
                  "Anniversary Celebrations",
                  "Baby Showers",
                ].map((service, index) => (
                  <li key={index}>
                    <a
                      href="#gallery"
                      className="hover:text-amber-400 transition-colors duration-300 flex items-center"
                    >
                      <ChevronRight className="w-4 h-4 mr-2 text-amber-500" />
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-6 text-amber-100">
                Other Items
              </h4>
              <ul className="space-y-4 text-gray-300">
                {[
                  "chair Cloth",
                  "Table Cloth",
                  "popcorn Machine",
                  "cotton Candy Machine",
                  "Photo Booth",
                ].map((link, index) => (
                  <li key={index}>
                    <a
                      href='#services'
                      className="hover:text-amber-400 transition-colors duration-300 flex items-center"
                    >
                      <ChevronRight className="w-4 h-4 mr-2 text-amber-500" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-amber-100">
                Quick Contact
              </h3>
              <div className="space-y-4">
                <a
                  href="tel:+918072287335"
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
                >
                  <Phone className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-300 group-hover:text-white">
                    +91 80722 87335
                  </span>
                </a>
                <a
                   className="flex items-center gap-3 p-3  bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
                
                href="mailto:Joycedecor.ngl@gmail.com?subject=Inquiry&body=Hello, I would like to get more information about..."
                >
                  <Mail className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-300 group-hover:text-white">
                    joycedecor@gmail.com
                  </span>
                </a>
               <a 
                  href="https://www.google.com/maps/place/Joyce+Decors/@8.1699942,77.4401459,88m/data=!3m1!1e3!4m6!3m5!1s0x3b04f12b2d1c6f9b:0x3822147d4690275c!8m2!3d8.1699858!4d77.4401919!16s%2Fg%2F11yc1kwdjn?entry=ttu&g_ep=EgoyMDI1MTAyOS4yIKXMDSoASAFQAw%3D%3D"
               className="flex items-center flex-wrap gap-3 p-3 bg-white/5 rounded-lg" >

  <MapPin className="w-5 h-5 text-amber-400" />
                  <span className="text-gray-300">Nagercoil</span>

               </a>

               
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-center md:text-left mb-4 md:mb-0">
  © 2021 JoyceDecor | Creating unforgettable events | Creative design by ❤️Adarsh
</p>
            {/* <div className="flex space-x-6 text-gray-400">
              <a href="#" className="hover:text-amber-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-amber-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-amber-400 transition-colors">
                Cookie Policy
              </a>
            </div> */}
          </div>
        </div>
      </footer>
    </>
  );
}
