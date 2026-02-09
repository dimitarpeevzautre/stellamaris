
import React, { useEffect, useRef } from 'react';
import { LITTERS } from '../constants';
import { Calendar, Baby, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import ImageCarousel from '../components/ImageCarousel';
import L from 'leaflet';

const PuppyLocationMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const locations = [
    { id: 1, country: 'Portugal', count: 2, lat: 39.3999, lng: -8.2245 },
    { id: 2, country: 'Spain', count: 1, lat: 40.4637, lng: -3.7492 },
    { id: 3, country: 'United Kingdom', city: 'London', count: 1, lat: 51.5074, lng: -0.1278 },
    { id: 4, country: 'Bulgaria', city: 'Sofia', count: 4, lat: 42.6977, lng: 23.3219 },
  ];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if not already initialized
    if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
            center: [46, 10], // Centered roughly on Europe
            zoom: 4,
            scrollWheelZoom: false,
            attributionControl: false
        });

        // Add CartoDB Positron tile layer (light theme matching the site)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);

        // Add markers
        locations.forEach((loc) => {
            const icon = L.divIcon({
                className: 'bg-transparent',
                html: `<div style="width: 24px; height: 24px; background-color: #d4af37; border: 2px solid white; border-radius: 50%; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 10px;">${loc.count}</div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12],
                popupAnchor: [0, -12]
            });

            const marker = L.marker([loc.lat, loc.lng], { icon }).addTo(map);
            
            const popupContent = `
                <div style="text-align: center; font-family: ui-sans-serif, system-ui, sans-serif; padding: 4px;">
                    <p style="text-transform: uppercase; letter-spacing: 0.05em; font-size: 10px; color: #1e3a8a; margin-bottom: 2px; font-weight: bold; margin-top: 0;">
                        ${loc.city || loc.country}
                    </p>
                    <p style="color: #d4af37; font-family: Georgia, serif; font-size: 14px; font-weight: bold; margin: 0;">
                        ${loc.count} ${loc.count === 1 ? 'Puppy' : 'Puppies'}
                    </p>
                </div>
            `;
            
            marker.bindPopup(popupContent);
        });

        mapInstanceRef.current = map;
    }

    // Cleanup on unmount
    return () => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }
    };
  }, []);

  return (
    <div className="w-full bg-stella-blue/5 rounded-3xl p-8 border border-stella-blue/10">
      <div className="mb-8 text-center">
        <h3 className="text-2xl font-serif text-stella-dark font-bold mb-2">Stella Maris Around the World</h3>
        <p className="text-gray-600">Our puppies have found loving homes across Europe and beyond.</p>
      </div>
      
      {/* Map Container */}
      <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-inner border border-blue-100 z-0">
         <div ref={mapContainerRef} className="w-full h-full z-10"></div>
      </div>
      
      {/* Legend / Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
         {locations.map((loc) => (
             <div key={loc.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                 <p className="text-2xl font-serif text-stella-gold font-bold">{loc.count}</p>
                 <p className="text-xs font-bold uppercase tracking-widest text-gray-500">{loc.country}</p>
             </div>
         ))}
      </div>
    </div>
  );
};

const Puppies: React.FC = () => {
  return (
    <div className="min-h-screen bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-serif font-bold text-stella-blue mb-4">Puppies</h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                    We plan our litters carefully with a focus on betterment of the breed. 
                    Below are our current and upcoming opportunities to welcome a Stella Maris puppy into your home.
                </p>
            </div>

            <div className="space-y-12 mb-24">
                {LITTERS.map((litter) => (
                    <div key={litter.id} className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-2/5 min-h-[300px] md:h-auto relative">
                                <img src={litter.image} alt="Litter" className="absolute inset-0 w-full h-full object-cover" />
                                <div className="absolute top-4 left-4">
                                    <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-md
                                        ${litter.status === 'Available' ? 'bg-green-500 text-white' : 
                                          litter.status === 'Planned' ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'}`}>
                                        {litter.status}
                                    </span>
                                </div>
                            </div>
                            <div className="p-8 md:w-3/5 flex flex-col justify-center">
                                <h2 className="text-3xl font-serif font-bold text-stella-blue mb-2">
                                    {litter.sire} x {litter.dam}
                                </h2>
                                <p className="text-gray-500 text-sm mb-6 uppercase tracking-wide">
                                    {litter.status === 'Planned' ? 'Expecting' : 'Arrived'} {litter.status === 'Planned' ? 'Winter 2025' : 'Spring 2026'}
                                </p>
                                
                                <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                                    {litter.description}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                    <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-lg">
                                        <Calendar className="mr-3 text-stella-gold" size={20} />
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase">Whelp Date</p>
                                            <p className="font-medium">{litter.whelpDate}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-lg">
                                        <Baby className="mr-3 text-stella-gold" size={20} />
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase">Go Home Date</p>
                                            <p className="font-medium">{litter.goHomeDate}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <Link to="/contact" className="inline-block w-full sm:w-auto text-center bg-stella-blue hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-xl transition duration-200">
                                        Inquire About This Litter
                                    </Link>
                                </div>
                            </div>
                        </div>
                        
                        {/* Litter Gallery Carousel */}
                        {litter.gallery && litter.gallery.length > 0 && (
                            <div className="border-t border-gray-100 p-8 bg-gray-50">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6 text-center">More from this litter</h4>
                                <div className="max-w-2xl mx-auto">
                                    <ImageCarousel images={litter.gallery} className="h-[400px]" />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            <div className="mb-24">
               <div className="flex items-center gap-4 mb-8">
                    <div className="h-px flex-1 bg-gray-200"></div>
                    <h2 className="text-2xl font-serif text-gray-400 uppercase tracking-widest">Past Litters</h2>
                    <div className="h-px flex-1 bg-gray-200"></div>
               </div>
               <PuppyLocationMap />
            </div>

            <div className="bg-stella-sand/20 rounded-2xl p-8 flex items-start gap-4">
                <Info className="text-stella-blue flex-shrink-0 mt-1" size={24} />
                <div>
                    <h3 className="font-bold text-lg text-stella-blue mb-2">How Our Waitlist Works</h3>
                    <p className="text-gray-600">
                        We accept applications year-round. A deposit is required to hold your spot on a specific litter waitlist once pregnancy is confirmed. 
                        We match puppies to families based on temperament testing conducted at 7 weeks of age to ensure the perfect fit for your lifestyle.
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Puppies;
