import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';

const About = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('down');

  useEffect(() => {
    let ticking = false;

    const updateScrollPosition = () => {
      const currentScrollY = window.scrollY;
      
      // Determine scroll direction
      if (currentScrollY > lastScrollY) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up');
      }
      
      setScrollY(currentScrollY);
      setLastScrollY(currentScrollY);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollPosition);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  // Calculate movement offset based on scroll
  const scrollSpeed = 0.3; // Adjust this to control movement speed
  const movementOffset = scrollDirection === 'down' ? -scrollY * scrollSpeed : scrollY * scrollSpeed;

  const features = [
    {
      icon: "💬",
      title: "Smart Chat",
      description: "Chat with our AI health assistant 24/7 for instant support and guidance."
    },
    {
      icon: "🩺",
      title: "Health Insights",
      description: "Get personalized health insights based on your symptoms and concerns."
    },
    {
      icon: "📅",
      title: "Easy Booking",
      description: "Book appointments with healthcare providers in just a few clicks."
    },
    {
      icon: "🚨",
      title: "SOS",
      description: "SOS Button to alert the authorities instantly in case of an emergency."
    }
  ];

  return (
    <section id="about" className="w-full bg-primary py-16 md:py-20 lg:py-24 relative overflow-hidden">

      {/* Static floating background elements */}
      <div className="absolute top-20 left-10 w-8 h-8 bg-teal-200 rounded-full opacity-30 animate-bounce-gentle"></div>
      <div className="absolute top-40 right-20 w-6 h-6 bg-teal-100 rounded-full opacity-40 animate-float-delayed"></div>
      <div className="absolute bottom-32 left-20 w-4 h-4 bg-white rounded-full opacity-50 animate-bounce-gentle"></div>
      <div className="absolute bottom-20 right-16 w-10 h-10 bg-teal-200 rounded-full opacity-30 animate-pulse-soft"></div>
      
      {/* Scroll-responsive floating elements */}
      <div 
        className="absolute top-60 left-45 w-60 h-60 bg-teal-300 rounded-full opacity-25 transition-transform duration-100 ease-out"
        style={{
          transform: `translateY(${movementOffset}px)`
        }}
      ></div>
      
      {/* Additional scroll-responsive bubbles */}

      <div 
        className="absolute bottom-40 left-8 w-32 h-32 bg-white rounded-full opacity-30 transition-transform duration-120 ease-out"
        style={{
          transform: `translateY(${movementOffset * 1.2}px)`
        }}
      ></div>
      <div 
        className="absolute top-180 right-90 w-36 h-36 bg-teal-300 rounded-full opacity-35 transition-transform duration-110 ease-out"
        style={{
          transform: `translateY(${movementOffset * 0.8}px)`
        }}
      ></div>
      <div 
        className="absolute bottom-96 right-32 w-48 h-48 bg-teal-200 rounded-full opacity-15 transition-transform duration-140 ease-out"
        style={{
          transform: `translateY(${movementOffset * 0.9}px)`
        }}
      ></div>

      <div 
        className="absolute bottom-30 right-24 w-36 h-36 bg-white rounded-full opacity-25 transition-transform duration-125 ease-out"
        style={{
          transform: `translateY(${movementOffset * 0.6}px)`
        }}
      ></div>
      <div 
        className="absolute top-60 right-8 w-28 h-28 bg-teal-200 rounded-full opacity-30 transition-transform duration-115 ease-out"
        style={{
          transform: `translateY(${movementOffset * 1.3}px)`
        }}
      ></div>
      <div 
        className="absolute bottom-50 left-80 w-44 h-44 bg-teal-300 rounded-full opacity-20 transition-transform duration-135 ease-out"
        style={{
          transform: `translateY(${movementOffset * 0.75}px)`
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-20">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-3 mb-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              About MediMate
            </h2>
          </div>
          
          <p className="text-lg md:text-xl text-teal-100 max-w-3xl mx-auto leading-relaxed animate-slide-in-up animation-delay-300">
            Meet your new best friend in healthcare! MediMate combines cutting-edge AI technology with a warm, 
            caring touch to make your health journey as smooth and supportive as possible. 
            <span className="inline-block ml-2 animate-wiggle"></span>
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 cursor-pointer animate-fade-in-up overflow-hidden"
              style={{animationDelay: `${index * 0.15}s`}}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl`}></div>
              
              <div className="relative z-10">
                <div className="text-5xl mb-6 text-center animate-bounce-gentle group-hover:animate-wiggle">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed group-hover:text-teal-700 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>

              {/* Cute floating hearts on hover */}
              {hoveredCard === index && (
                <>
                  <div className="absolute top-4 right-4 text-teal-200 animate-float-heart"></div>
                  <div className="absolute bottom-4 left-4 text-white animate-float-heart animation-delay-300"></div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center animate-fade-in-up animation-delay-800">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 text-6xl animate-spin-very-slow text-teal-600"></div>
              <div className="absolute top-8 right-8 text-4xl animate-bounce-gentle text-teal-500"></div>
              <div className="absolute bottom-6 left-8 text-5xl animate-wiggle text-teal-600"></div>
              <div className="absolute bottom-4 right-6 text-3xl animate-pulse-soft text-teal-500"></div>
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Ready to start your health journey?
              </h3>
              <p className="text-teal-600 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of users who trust MediMate for their healthcare needs. 
                Your wellness adventure begins with just one click! 
                <span className="inline-block ml-2 animate-wiggle"></span>
              </p>
              
              <button className="group bg-primary text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:bg-teal-700 relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-3">
                  <Link to="/signup">Get Started Today </Link>
                  <span className="text-2xl group-hover:animate-bounce"></span>
                </span>
                <div className="absolute inset-0 bg-teal-100 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce-gentle {
          0%, 100% { 
            transform: translateY(0px);
          }
          50% { 
            transform: translateY(-5px);
          }
        }
        
        @keyframes bounce-subtle {
          0%, 100% { 
            transform: translateY(0px);
          }
          50% { 
            transform: translateY(-3px);
          }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        
        @keyframes float-heart {
          0% { 
            opacity: 0;
            transform: translateY(0px) scale(0.8);
          }
          50% { 
            opacity: 1;
            transform: translateY(-10px) scale(1);
          }
          100% { 
            opacity: 0;
            transform: translateY(-20px) scale(0.8);
          }
        }
        
        @keyframes pulse-soft {
          0%, 100% { 
            opacity: 0.1;
            transform: scale(1);
          }
          50% { 
            opacity: 0.4;
            transform: scale(1.1);
          }
        }
        
        @keyframes spin-very-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .animate-slide-in-up {
          animation: slide-in-up 0.6s ease-out;
        }
        
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
        
        .animate-wiggle {
          animation: wiggle 2s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 5s ease-in-out infinite 1s;
        }
        
        .animate-float-heart {
          animation: float-heart 2s ease-in-out;
        }
        
        .animate-pulse-soft {
          animation: pulse-soft 5s ease-in-out infinite;
        }
        
        .animate-spin-very-slow {
          animation: spin-very-slow 20s linear infinite;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        
        .animation-delay-800 {
          animation-delay: 0.8s;
        }
      `}</style>
    </section>
  );
};

export default About;