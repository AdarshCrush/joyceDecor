import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, Clock, MapPin, Sparkles } from 'lucide-react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    date: '',
    message: ''
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const whatsappMessage = `
🎉 *New Event Planning Inquiry* 🎉

*Name:* ${formData.name}
*Email:* ${formData.email}
*Phone:* ${formData.phone}
*Event Type:* ${formData.eventType || 'Not specified'}
*Event Date:* ${formData.date || 'Not specified'}

*Message:*
${formData.message}

---
Sent via Event Decor Website
    `.trim();

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappNumber = "9489191947";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.location.href = whatsappUrl;
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      eventType: '',
      date: '',
      message: ''
    });
  };

  const handleWhatsAppClick = () => {
    const defaultMessage = "Hello! I'm interested in your event planning services. Please provide more information.";
    const encodedMessage = encodeURIComponent(defaultMessage);
    const whatsappNumber = "918072287335";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.location.href = whatsappUrl;
  };

  const handleQuickCall = () => {
    window.location.href = "tel:+919876543210";
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8" id='contact'>
      {/* Contact Us Heading Section */}
      <div className="text-center  px-4">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-3 rounded-full mb-4">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <span className="text-amber-700 font-semibold">Get In Touch</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Contact <span className="text-amber-600">Us</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
          Reach out to start planning your perfect event. We're here to bring your vision to life!
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-400 mx-auto rounded-full mt-4"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
        {/* Left Side - Contact Information - Compact */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-6 md:p-8 m-4 md:m-8 md:mr-0 flex flex-col justify-center rounded-xl lg:rounded-l-xl lg:rounded-r-none shadow-lg">
          <div className="max-w-md">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Let's Plan Something <span className="text-gray-900">Amazing</span>
            </h3>
            <p className="text-amber-100 text-base mb-8">
              Our event specialists are ready to bring your vision to life with creativity and precision.
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">+91 80722 87335</p>
                  <p className="text-amber-100 text-sm">Call us anytime</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">joycedecor7@gmail.com</p>
                  <p className="text-amber-100 text-sm">Send us an email</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Paramarthalingapuram, Kamarajer Street, Vetturnimadam (P.O),</p>
                  <p className="text-amber-100 text-sm"> Nagercoil-3, Kanyakumari</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">24/7 Available</p>
                  <p className="text-amber-100 text-sm">For emergency events</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button 
                onClick={handleWhatsAppClick}
                className="flex-1 bg-white text-amber-600 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Chat</span>
              </button>
              <button 
                onClick={handleQuickCall}
                className="flex-1 bg-transparent border-2 border-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors flex items-center justify-center space-x-2 text-sm"
              >
                <Phone className="w-4 h-4" />
                <span>Quick Call</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Contact Form - Compact */}
        <div className="bg-white p-6 md:p-8 flex flex-col justify-center m-4 md:m-8 md:ml-0 rounded-xl lg:rounded-r-xl lg:rounded-l-none shadow-lg border border-gray-100">
          <div className="max-w-md mx-auto w-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Get Free Consultation</h3>
            <p className="text-gray-600 text-sm mb-6">Fill out the form below and we'll contact you soon via WhatsApp</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    required
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    required
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Type
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select Event Type</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Corporate Event">Corporate Event</option>
                    <option value="Birthday Party">Birthday Party</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Baby Shower">Baby Shower</option>
                    <option value="Engagement">Engagement</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Details *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                  required
                  placeholder="Tell us about your event vision, number of guests, budget, and any specific requirements..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center space-x-2 text-sm shadow-md hover:shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send via WhatsApp</span>
              </button>

              <p className="text-xs text-gray-500 text-center">
                After clicking the button, you'll be redirected to WhatsApp to send your inquiry directly to our team.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;