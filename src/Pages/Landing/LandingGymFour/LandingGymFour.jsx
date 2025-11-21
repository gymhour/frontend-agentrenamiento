import React, { useState, useEffect } from "react";
import {
  Menu, X, MapPin, Phone, Mail, Instagram, Facebook, Twitter,
  ArrowRight, Clock, Shield, Zap, Map
} from "lucide-react";

const LandingGymFour = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  // --- DATA ---
  const locations = [
    { name: "Downtown Hub", address: "Av. Corrientes 500", hours: "24/7 Access", coords: "Centro" },
    { name: "North Side", address: "Av. Libertador 4200", hours: "06:00 - 23:00", coords: "Palermo" },
    { name: "West Arena", address: "Av. Gaona 1200", hours: "07:00 - 22:00", coords: "Caballito" },
  ];

  const galleryImages = [
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1623874514711-0f321325f318?q=80&w=600&auto=format&fit=crop",
  ];

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-orange-500 selection:text-white">
      
      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-black/5 ${isScrolled ? 'bg-white py-3 shadow-md' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-600 skew-x-[-12deg]"></div>
            <span className="text-2xl font-display font-bold tracking-tighter uppercase italic">
              IRON<span className="text-orange-600">FORGE</span>
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {['Classes', 'Locations', 'Gallery', 'Pricing'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="font-bold uppercase text-sm tracking-wider hover:text-orange-600 transition-colors"
              >
                {item}
              </button>
            ))}
            <button 
              onClick={() => scrollToSection('contact')}
              className="bg-black text-white px-6 py-2 font-display font-bold uppercase text-lg tracking-wide hover:bg-orange-600 hover:scale-105 transition-all -skew-x-12"
            >
              <span className="skew-x-12 inline-block">Join Now</span>
            </button>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b-4 border-orange-600 flex flex-col p-8 gap-6 md:hidden shadow-xl">
             {['Classes', 'Locations', 'Gallery', 'Pricing', 'Contact'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-left text-3xl font-display font-bold uppercase text-black hover:text-orange-600"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative h-screen flex items-center pt-20 overflow-hidden">
        {/* Background Image with filters */}
        <div className="absolute inset-0 z-0">
           <img 
            src="https://images.unsplash.com/photo-1550345332-09e3ac987658?q=80&w=1200&auto=format&fit=crop" 
            alt="Urban Gym" 
            className="w-full h-full object-cover grayscale contrast-125"
           />
           <div className="absolute inset-0 bg-orange-600 mix-blend-multiply opacity-20"></div>
           <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent md:via-white/50"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-block bg-black text-white px-4 py-1 font-bold uppercase tracking-widest mb-6 -skew-x-12 text-sm">
              <span className="skew-x-12 inline-block">#1 Rated Gym in City</span>
            </div>
            <h1 className="text-6xl md:text-9xl font-display font-bold uppercase leading-[0.85] tracking-tighter mb-8">
              Train <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">Harder</span> <br/>
              Live Better
            </h1>
            <p className="text-xl font-medium text-gray-800 max-w-lg mb-10 border-l-4 border-orange-600 pl-6">
              No excuses. Just results. Join the movement that is redefining urban fitness culture.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => scrollToSection('pricing')} className="px-10 py-4 bg-orange-600 text-white font-display font-bold text-xl uppercase tracking-widest hover:bg-black transition-colors shadow-lg shadow-orange-500/30">
                Start Today
              </button>
              <button onClick={() => scrollToSection('locations')} className="px-10 py-4 border-2 border-black text-black font-display font-bold text-xl uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                Find a Gym
              </button>
            </div>
          </div>
        </div>
        
        {/* Decorative Element */}
        <div className="absolute bottom-0 right-0 w-1/3 h-24 bg-black skew-x-[-20deg] translate-x-10 translate-y-10 hidden md:block"></div>
      </header>

      {/* --- MARQUEE BANNER --- */}
      <div className="bg-black text-white py-4 overflow-hidden border-y-4 border-orange-600">
        <div className="animate-marquee whitespace-nowrap flex gap-12">
          {[1,2,3,4,5,6].map(i => (
            <span key={i} className="text-2xl font-display font-bold uppercase italic flex items-center gap-4">
              Iron Forge <Zap className="text-orange-600 fill-current" /> No Limits <Zap className="text-orange-600 fill-current" />
            </span>
          ))}
        </div>
      </div>

      {/* --- SUCURSALES / LOCATIONS (New Section) --- */}
      <section id="locations" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
           <div className="flex flex-col md:flex-row justify-between items-end mb-12">
             <div>
               <h2 className="text-5xl font-display font-bold uppercase italic tracking-tight">Our <span className="text-orange-600">Territory</span></h2>
               <p className="text-gray-500 font-medium mt-2 uppercase tracking-wide">Find the nearest Iron Forge</p>
             </div>
             <div className="hidden md:flex items-center gap-2 text-orange-600 font-bold uppercase">
               <Map size={20} /> View on Google Maps
             </div>
           </div>

           <div className="grid md:grid-cols-3 gap-6">
             {locations.map((loc, idx) => (
               <div key={idx} className="group bg-white border-2 border-black p-8 hover:-translate-y-2 transition-transform duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(234,88,12,1)]">
                 <div className="flex justify-between items-start mb-6">
                   <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                     <MapPin size={24} />
                   </div>
                   <span className="bg-black text-white text-xs font-bold px-2 py-1 uppercase">{loc.coords}</span>
                 </div>
                 <h3 className="text-2xl font-display font-bold uppercase mb-2">{loc.name}</h3>
                 <p className="text-gray-600 mb-4 font-medium">{loc.address}</p>
                 <div className="border-t border-gray-200 pt-4 flex items-center gap-2 text-sm font-bold text-gray-500">
                   <Clock size={16} /> {loc.hours}
                 </div>
                 <button className="w-full mt-6 py-3 bg-gray-100 font-bold uppercase hover:bg-black hover:text-white transition-colors">
                   View Schedule
                 </button>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* --- CLASSES --- */}
      <section id="classes" className="py-20 bg-black text-white">
         <div className="container mx-auto px-6">
           <h2 className="text-5xl font-display font-bold uppercase italic tracking-tight mb-16 text-center text-white">
             Hardcore <span className="text-orange-600">Programs</span>
           </h2>

           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-0 border border-gray-800">
              {[
                { name: "CrossFit", icon: "🏋️‍♂️" },
                { name: "Boxing", icon: "🥊" },
                { name: "Powerlifting", icon: "💪" },
                { name: "Cardio", icon: "🏃‍♂️" }
              ].map((item, i) => (
                <div key={i} className="group relative h-80 border border-gray-800 bg-zinc-900 overflow-hidden flex flex-col items-center justify-center hover:bg-orange-600 transition-colors duration-500 cursor-pointer">
                  <span className="text-6xl mb-6 grayscale group-hover:grayscale-0 transition-all">{item.icon}</span>
                  <h3 className="text-3xl font-display font-bold uppercase italic z-10">{item.name}</h3>
                  
                  {/* Hover Effect Background */}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10"></div>
                  
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </div>
              ))}
           </div>
         </div>
      </section>

      {/* --- GALLERY (New Section) --- */}
      <section id="gallery" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center mb-12 text-center">
             <h2 className="text-5xl font-display font-bold uppercase italic tracking-tight mb-4">
               Inside The <span className="text-orange-600 underline decoration-4 underline-offset-4">Forge</span>
             </h2>
             <p className="max-w-2xl text-gray-600 font-medium">
               Equipped with the best to make you the best. Take a look at our state-of-the-art facilities.
             </p>
          </div>

          {/* Mosaic Layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[600px]">
            {galleryImages.map((img, idx) => (
              <div 
                key={idx} 
                className={`relative overflow-hidden group bg-black ${
                  idx === 0 ? 'md:col-span-2 md:row-span-2' : 'md:col-span-1 md:row-span-1'
                }`}
              >
                <img 
                  src={img} 
                  alt="Gallery" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
                />
                <div className="absolute inset-0 border-4 border-transparent group-hover:border-orange-600 transition-colors duration-300 z-10 pointer-events-none"></div>
                <div className="absolute bottom-4 left-4 bg-black text-white text-xs font-bold uppercase px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                  Zone {idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRICING --- */}
      <section id="pricing" className="py-20 bg-zinc-100">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-display font-bold uppercase italic tracking-tight mb-12 text-center">
            Membership
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
             {[
               { name: "Day Pass", price: "$10", period: "/day", feats: ["Access to Gym", "Locker"] },
               { name: "Monthly", price: "$45", period: "/mo", feats: ["24/7 Access", "Classes Included", "Free Guest Pass"], active: true },
               { name: "Annual", price: "$400", period: "/yr", feats: ["All Monthly Perks", "Personal Trainer x2", "Merch Pack"] },
             ].map((plan, idx) => (
               <div key={idx} className={`relative flex flex-col p-8 ${plan.active ? 'bg-black text-white shadow-[10px_10px_0px_0px_rgba(234,88,12,1)] transform md:-translate-y-4' : 'bg-white text-black border-2 border-black'}`}>
                 <h3 className="font-display font-bold text-2xl uppercase mb-4">{plan.name}</h3>
                 <div className="text-5xl font-display font-bold mb-6">{plan.price}<span className="text-lg text-gray-500 font-sans">{plan.period}</span></div>
                 <ul className="mb-8 space-y-3 flex-1">
                   {plan.feats.map((f, i) => (
                     <li key={i} className="flex items-center gap-2 font-medium">
                       <Shield size={16} className={plan.active ? "text-orange-500" : "text-black"} /> {f}
                     </li>
                   ))}
                 </ul>
                 <button className={`w-full py-4 font-display font-bold uppercase tracking-wider transition-colors ${plan.active ? 'bg-orange-600 hover:bg-white hover:text-black' : 'bg-black text-white hover:bg-orange-600'}`}>
                   Select
                 </button>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* --- CONTACT --- */}
      <section id="contact" className="bg-black text-white py-20 border-t-8 border-orange-600">
         <div className="container mx-auto px-6 flex flex-col md:flex-row gap-16">
            <div className="md:w-1/2">
               <h2 className="text-6xl font-display font-bold uppercase leading-none mb-8">
                 Ready to <br/><span className="text-orange-600">Sweat?</span>
               </h2>
               <p className="text-gray-400 text-lg mb-8 max-w-md">
                 Join the Iron Forge family today. Visit any of our locations or drop us a message to get your free trial pass.
               </p>
               <div className="flex gap-4">
                 <div className="w-12 h-12 bg-zinc-800 flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer"><Instagram /></div>
                 <div className="w-12 h-12 bg-zinc-800 flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer"><Twitter /></div>
                 <div className="w-12 h-12 bg-zinc-800 flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer"><Facebook /></div>
               </div>
            </div>
            
            <div className="md:w-1/2 bg-zinc-900 p-8 md:p-12 border border-zinc-800">
               <form className="space-y-6">
                 <div>
                   <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-wider">Full Name</label>
                   <input type="text" className="w-full bg-black border-b-2 border-zinc-700 p-3 text-white focus:border-orange-600 outline-none font-display font-bold text-xl uppercase transition-colors" placeholder="JOHN DOE" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-wider">Email</label>
                   <input type="email" className="w-full bg-black border-b-2 border-zinc-700 p-3 text-white focus:border-orange-600 outline-none font-display font-bold text-xl uppercase transition-colors" placeholder="EMAIL@EXAMPLE.COM" />
                 </div>
                 <button className="w-full bg-white text-black py-4 font-display font-bold uppercase text-xl tracking-wider hover:bg-orange-600 hover:text-white transition-colors mt-4">
                   Send Request
                 </button>
               </form>
            </div>
         </div>
      </section>

      <footer className="bg-black py-6 border-t border-zinc-900 text-center">
        <p className="text-zinc-600 font-bold uppercase text-xs tracking-widest">© {new Date().getFullYear()} Iron Forge Fitness. Design: Urban Series.</p>
      </footer>
    </div>
  );
};

export default LandingGymFour;