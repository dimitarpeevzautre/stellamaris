import React from 'react';
import { Facebook, Instagram, Mail, Phone } from 'lucide-react';
import { CONTACT_EMAIL, CONTACT_PHONE, SOCIAL_FACEBOOK, SOCIAL_INSTAGRAM } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-stella-cream text-stella-dark py-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          
          {/* Left Column: Brand & Description */}
          <div className="md:w-1/2">
            <h3 className="text-3xl font-serif mb-6 text-stella-dark">Stella Maris Kennel</h3>
            <p className="text-sm leading-relaxed text-gray-700 max-w-md">
              Looking for a Portuguese Water Dog puppy? Stella Maris is a reputable FCI registered breeder of PWD dogs in Europe. We focus on health testing, temperament, socialization. Our puppies are raised with love and care, ready to become cherished members of your family.
            </p>
          </div>

          {/* Right Column: Contact Details */}
          <div className="md:w-1/2 flex flex-col items-start md:items-start space-y-4">
            <div className="flex items-center group">
              <Mail className="w-5 h-5 mr-3 text-gray-500 group-hover:text-stella-gold transition-colors" />
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm font-medium text-stella-dark hover:text-stella-gold transition-colors">
                {CONTACT_EMAIL}
              </a>
            </div>
            
            <div className="flex items-center group">
              <Phone className="w-5 h-5 mr-3 text-gray-500 group-hover:text-stella-gold transition-colors" />
              <a href={`tel:${CONTACT_PHONE}`} className="text-sm font-medium text-stella-dark hover:text-stella-gold transition-colors">
                {CONTACT_PHONE}
              </a>
            </div>

            <div className="flex items-center group">
              <Facebook className="w-5 h-5 mr-3 text-gray-500 group-hover:text-stella-gold transition-colors" />
              <a href={SOCIAL_FACEBOOK} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-stella-dark hover:text-stella-gold transition-colors">
                portuguesewaterdogbulgaria
              </a>
            </div>

            <div className="flex items-center group">
              <Instagram className="w-5 h-5 mr-3 text-gray-500 group-hover:text-stella-gold transition-colors" />
              <a href={SOCIAL_INSTAGRAM} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-stella-dark hover:text-stella-gold transition-colors">
                pwdbulgaria
              </a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;