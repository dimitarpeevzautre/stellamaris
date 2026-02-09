
import React from 'react';
import { ABOUT_TEXT, ABOUT_GALLERY } from '../constants';
import { CheckCircle } from 'lucide-react';
import ImageCarousel from '../components/ImageCarousel';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-stella-cream py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif text-stella-dark mb-4">Our Story</h1>
          <p className="text-lg text-gray-500 italic">FCI Registered Kennel 166/2024</p>
        </div>

        <div className="bg-white shadow-sm border border-gray-100 overflow-hidden mb-16">
            <img 
              src="/images/family.jpeg" 
              alt="Steli and Mitko surrounded by their Portuguese Water Dogs and puppies"
              className="w-full h-auto"
            />
            <div className="p-8 sm:p-16 space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                    {ABOUT_TEXT}
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                    We fell in love with the Portuguese Water Dog for their incredible intelligence and joyful spirit. Raising them takes dedication, but the reward is a loyal best friend who wants nothing more than to be by your side. Nestled near the beautiful Vitosha mountains, our home gives our dogs the freedom to run, play, and explore the nature they adore.
                </p>

                <div className="my-12">
                    <h3 className="text-xl font-bold uppercase tracking-widest text-stella-dark mb-8">Our Standards</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            "FCI Registered Kennel",
                            "Comprehensive Genetic Testing",
                            "Early Neurological Stimulation",
                            "Volhard Temperament Testing",
                            "Lifetime Breeder Support",
                            "International Health Certificates"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center text-gray-700">
                                <CheckCircle className="text-stella-gold mr-4 h-5 w-5 flex-shrink-0" />
                                <span className="text-sm font-medium uppercase tracking-wide">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>

        {/* Life at Stella Maris Carousel */}
        <div className="text-center mb-12">
            <h2 className="text-2xl font-serif text-stella-dark mb-4">Life at Stella Maris</h2>
            <div className="h-px w-20 bg-stella-gold mx-auto mb-8"></div>
            <div className="max-w-3xl mx-auto shadow-xl rounded-2xl overflow-hidden">
                <ImageCarousel images={ABOUT_GALLERY} className="h-[500px]" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default About;
