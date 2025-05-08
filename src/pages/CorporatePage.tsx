import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTrips } from '../hooks/useTrips';
import TripCard from '../components/TripCard';

const CorporatePage = () => {
  const { data: trips } = useTrips();
  const [animatedSections, setAnimatedSections] = useState<Record<string, boolean>>({});
  
  // Observe elements for scroll-based animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const id = entry.target.getAttribute('id');
          if (id && entry.isIntersecting) {
            setAnimatedSections(prev => ({ ...prev, [id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );
    
    document.querySelectorAll('[data-animate]').forEach(element => {
      observer.observe(element);
    });
    
    return () => observer.disconnect();
  }, []);

  // Background gradient animation
  const BackgroundAnimation = () => (
    <div className="absolute inset-0 overflow-hidden -z-10">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-southwest-yellow/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-southwest-red/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-20 right-1/4 w-60 h-60 bg-southwest-blue/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
    </div>
  );
  
  return (
    <div className="relative">
      <BackgroundAnimation />
      
      {/* Hero section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div id="heroContent" data-animate className={`${animatedSections.heroContent ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'} transition-all duration-1000`}>
              <div className="inline-block bg-southwest-blue/10 text-southwest-blue font-semibold px-4 py-2 rounded-full text-sm mb-6">
                Southwest Airlines Business Travel
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-southwest-blue mb-6 leading-tight">
                Corporate <span className="text-southwest-red">Travel Solutions</span>
              </h1>
              <p className="text-gray-600 text-lg mb-8 max-w-lg">
                Streamlined travel management, exclusive corporate rates, and dedicated support for your organization's travel needs.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-3 bg-southwest-red text-white font-bold rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 hover:bg-red-700">
                  Schedule a Demo
                </button>
                <button className="px-6 py-3 border-2 border-southwest-blue text-southwest-blue font-bold rounded-full hover:bg-southwest-blue hover:text-white transition-colors duration-300">
                  Learn More
                </button>
              </div>
              
              <div className="mt-12 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                      <img 
                        src={`https://randomuser.me/api/portraits/men/${20 + i}.jpg`} 
                        alt="Customer" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/40';
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    {Array(5).fill(0).map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">Trusted by <span className="font-semibold">500+</span> corporate clients</p>
                </div>
              </div>
            </div>
            
            <div id="heroImage" data-animate className={`${animatedSections.heroImage ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'} transition-all duration-1000 delay-300 relative`}>
              <div className="relative">
                <div className="absolute inset-0 transform rotate-3 bg-southwest-blue rounded-3xl"></div>
                <div className="relative transform -rotate-2 overflow-hidden rounded-3xl shadow-2xl border-8 border-white">
                  <img 
                    src="/images/corporate-travel.jpg" 
                    alt="Corporate travel with Southwest" 
                    className="w-full h-[400px] object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071';
                    }}
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-southwest-blue/10 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-southwest-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Average Savings</p>
                      <p className="font-bold text-southwest-blue text-xl">25%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div id="featuresHeading" data-animate className={`text-center max-w-3xl mx-auto mb-16 ${animatedSections.featuresHeading ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-1000`}>
            <h2 className="text-3xl font-bold text-southwest-blue mb-4">Corporate Travel Benefits</h2>
            <p className="text-gray-600">Southwest Airlines offers comprehensive travel solutions designed specifically for businesses of all sizes.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                id: 'feature1',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Cost Savings',
                description: 'Exclusive corporate rates and volume-based discounts to optimize your travel budget.'
              },
              {
                id: 'feature2',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                ),
                title: 'Travel Management',
                description: 'Powerful dashboard to manage bookings, track expenses, and enforce travel policies.'
              },
              {
                id: 'feature3',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Dedicated Support',
                description: '24/7 priority customer service and a dedicated account manager for your organization.'
              }
            ].map((feature, index) => (
              <div 
                key={feature.id} 
                id={feature.id} 
                data-animate 
                className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-500 ${animatedSections[feature.id] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="inline-flex items-center justify-center p-3 bg-southwest-blue/10 rounded-xl text-southwest-blue mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-southwest-blue mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div id="statsSection" data-animate className={`mt-20 grid md:grid-cols-4 gap-8 ${animatedSections.statsSection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-1000`}>
            {[
              { label: 'Corporate Partners', value: '500+' },
              { label: 'Cities Served', value: '100+' },
              { label: 'Annual Business Trips', value: '1M+' },
              { label: 'Customer Satisfaction', value: '97%' }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="text-center p-6 rounded-lg"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl font-extrabold text-southwest-blue mb-2">{stat.value}</div>
                <div className="text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Popular corporate destinations */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div id="destinationsHeading" data-animate className={`mb-12 ${animatedSections.destinationsHeading ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-1000`}>
            <h2 className="text-3xl font-bold text-southwest-blue mb-4">Popular Business Destinations</h2>
            <p className="text-gray-600 max-w-3xl">Explore our most-booked business travel destinations with exclusive corporate rates and flexible booking options.</p>
          </div>
          
          {trips && trips.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {trips.slice(0, 3).map((trip, index) => (
                <div 
                  key={trip.id} 
                  id={`destination-${index}`} 
                  data-animate 
                  className={`transition-all duration-700 ${animatedSections[`destination-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <TripCard trip={trip} />
                </div>
              ))}
            </div>
          )}
          
          <div id="destinationsCTA" data-animate className={`mt-12 text-center ${animatedSections.destinationsCTA ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-1000 delay-300`}>
            <Link 
              to="/corporate/destinations" 
              className="inline-flex items-center px-6 py-3 bg-southwest-blue text-white font-bold rounded-full hover:bg-southwest-blue-dark transition-colors duration-300"
            >
              <span>View All Business Destinations</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-16 bg-southwest-blue relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute bottom-0 left-0 w-full h-32 bg-white/5 transform -skew-y-6"></div>
          <div className="absolute top-0 right-0 w-full h-32 bg-white/5 transform skew-y-6"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-southwest-red/20 filter blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div id="ctaSection" data-animate className={`max-w-4xl mx-auto text-center ${animatedSections.ctaSection ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} transition-all duration-1000`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to streamline your corporate travel?</h2>
            <p className="text-blue-100 text-lg mb-8">
              Join hundreds of businesses that trust Southwest for their corporate travel needs. Schedule a demo today to see how we can help optimize your travel program.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-southwest-blue font-bold rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1">
                Schedule a Demo
              </button>
              <button className="px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-colors duration-300">
                Contact Sales
              </button>
            </div>
            <p className="mt-6 text-blue-100 text-sm">
              No commitment required. See why we're the preferred airline for business travel.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CorporatePage; 