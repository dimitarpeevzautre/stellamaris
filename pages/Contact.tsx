import React, { useState } from 'react';
import { Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { CONTACT_EMAIL, CONTACT_PHONE } from '../constants';
import { useLanguage } from '../context/LanguageContext';

const Contact: React.FC = () => {
  const { t } = useLanguage();
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
        alert(t('contact.error'));
      }
    } catch (error) {
      alert(t('contact.error'));
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
          <h2 className="text-2xl font-serif text-gray-800 mb-2">{t('contact.success_title')}</h2>
          <p className="text-gray-600 mb-6">{t('contact.success_desc')}</p>
          <button onClick={() => setSubmitted(false)} className="text-stella-gold font-bold uppercase text-sm tracking-widest hover:underline">
            {t('contact.send_another')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stella-cream py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif text-stella-dark mb-4">{t('contact.title')}</h1>
          <p className="text-gray-500 font-light">{t('contact.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white p-10 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold uppercase tracking-widest text-gray-800 mb-8">{t('contact.info_title')}</h3>
              <div className="space-y-8">
                <div className="flex items-start">
                  <Mail className="text-stella-gold mt-1 mr-6" strokeWidth={1.5} />
                  <div>
                    <p className="font-serif text-lg text-gray-800">{t('contact.email')}</p>
                    <p className="text-gray-600">{CONTACT_EMAIL}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="text-stella-gold mt-1 mr-6" strokeWidth={1.5} />
                  <div>
                    <p className="font-serif text-lg text-gray-800">{t('contact.phone')}</p>
                    <p className="text-gray-600">{CONTACT_PHONE}</p>
                    <p className="text-xs text-gray-400">Mon-Fri, 9am - 5pm CET</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="text-stella-gold mt-1 mr-6" strokeWidth={1.5} />
                  <div>
                    <p className="font-serif text-lg text-gray-800">{t('contact.location')}</p>
                    <p className="text-gray-600">{t('contact.location_value')}</p>
                    <p className="text-xs text-gray-400">{t('contact.visits')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-10 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold uppercase tracking-widest text-gray-800 mb-8">{t('contact.form_title')}</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-wide">{t('contact.first_name')}</label>
                  <input type="text" name="firstName" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-stella-gold focus:ring-0 outline-none transition" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-wide">{t('contact.last_name')}</label>
                  <input type="text" name="lastName" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-stella-gold focus:ring-0 outline-none transition" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-wide">{t('contact.email')}</label>
                <input type="email" name="email" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-stella-gold focus:ring-0 outline-none transition" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-wide">{t('contact.interest')}</label>
                <select name="interest" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-stella-gold focus:ring-0 outline-none transition">
                  <option>General Inquiry</option>
                  <option>Kings Litter (Dec 2025)</option>
                  <option>Stud Service</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-wide">{t('contact.message')}</label>
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
                    {t('contact.sending')}
                  </>
                ) : (
                  t('contact.send')
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