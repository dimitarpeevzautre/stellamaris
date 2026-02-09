import React, { useState } from 'react';
import { Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { CONTACT_EMAIL, CONTACT_PHONE } from '../constants';

const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/xojnvwjz", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert("Oops! There was a problem submitting your form. Please try again.");
      }
    } catch (error) {
      alert("Oops! There was a problem submitting your form. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-stella-cream flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-none border border-gray-100 shadow-xl max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={32} />
            </div>
            <h2 className="text-2xl font-serif text-gray-800 mb-2">Message Sent!</h2>
            <p className="text-gray-600 mb-6">Thank you for contacting Stella Maris Kennel. We will review your inquiry and get back to you shortly.</p>
            <button onClick={() => setSubmitted(false)} className="text-stella-gold font-bold uppercase text-sm tracking-widest hover:underline">
                Send another message
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stella-cream py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
            <h1 className="text-4xl font-serif text-stella-dark mb-4">Get in Touch</h1>
            <p className="text-gray-500 font-light">We would love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
                <div className="bg-white p-10 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold uppercase tracking-widest text-gray-800 mb-8">Contact Information</h3>
                    <div className="space-y-8">
                        <div className="flex items-start">
                            <Mail className="text-stella-gold mt-1 mr-6" strokeWidth={1.5} />
                            <div>
                                <p className="font-serif text-lg text-gray-800">Email</p>
                                <p className="text-gray-600">{CONTACT_EMAIL}</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <Phone className="text-stella-gold mt-1 mr-6" strokeWidth={1.5} />
                            <div>
                                <p className="font-serif text-lg text-gray-800">Phone</p>
                                <p className="text-gray-600">{CONTACT_PHONE}</p>
                                <p className="text-xs text-gray-400">Mon-Fri, 9am - 5pm CET</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <MapPin className="text-stella-gold mt-1 mr-6" strokeWidth={1.5} />
                            <div>
                                <p className="font-serif text-lg text-gray-800">Location</p>
                                <p className="text-gray-600">Sofia, Bulgaria</p>
                                <p className="text-xs text-gray-400">Visits by appointment only.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white p-10 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold uppercase tracking-widest text-gray-800 mb-8">Send us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-wide">First Name</label>
                            <input type="text" name="firstName" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-stella-gold focus:ring-0 outline-none transition" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-wide">Last Name</label>
                            <input type="text" name="lastName" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-stella-gold focus:ring-0 outline-none transition" />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-wide">Email Address</label>
                        <input type="email" name="email" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-stella-gold focus:ring-0 outline-none transition" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-wide">Interest</label>
                        <select name="interest" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-stella-gold focus:ring-0 outline-none transition">
                            <option>General Inquiry</option>
                            <option>Kings Litter (Dec 2025)</option>
                            <option>Stud Service</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-wide">Message</label>
                        <textarea name="message" rows={4} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-stella-gold focus:ring-0 outline-none transition"></textarea>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-stella-gold hover:bg-[#b8952b] text-stella-dark font-bold py-4 px-6 uppercase tracking-widest text-xs transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                    >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                            Sending...
                          </>
                        ) : (
                          'Send Message'
                        )}
                    </button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;