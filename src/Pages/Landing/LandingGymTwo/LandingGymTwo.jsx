import React, { useState, useEffect } from "react";
import {
  Menu, X, MapPin, Phone, Mail, Instagram, Facebook, Twitter,
  Check, Star, ArrowRight, Dumbbell, Users, Clock, Zap
} from "lucide-react";

const LandingGymTwo = () => {
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

  // Data config (matches original content)
  const config = {
    name: "Iron Forge Fitness",
    hero: {
      title: "UNLEASH YOUR POTENTIAL",
      subtitle: "Join the city's most exclusive fitness community. Personalized training, state-of-the-art equipment, and real results.",
      bgImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop"
    },
    classes: [
      { name: "CrossFit", desc: "High intensity functional training.", image: "https://images.unsplash.com/photo-1517963879466-cd11b83271bc?q=80&w=600&auto=format&fit=crop" },
      { name: "Boxing", desc: "Improve coordination and stamina.", image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=600&auto=format&fit=crop" },
      { name: "Yoga Flow", desc: "Connect body and mind.", image: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=600&auto=format&fit=crop" },
      { name: "HIIT", desc: "Burn calories with explosive intervals.", image: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=600&auto=format&fit=crop" },
    ],
    trainers: [
      { name: "Carlos Mendez", role: "Strength Coach", image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=400&auto=format&fit=crop" },
      { name: "Sofia Rodriguez", role: "Yoga & Mobility", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop" },
      { name: "Miguel Ángel", role: "CrossFit Coach", image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=400&auto=format&fit=crop" },
    ],
    pricing: [
      { name: "Basic", price: "$25", features: ["Gym Access", "Daily Locker", "1 Group Class"] },
      { name: "Pro", price: "$45", recommended: true, features: ["24/7 Access", "Unlimited Classes", "Sauna Access", "1 PT Session"] },
      { name: "Elite", price: "$70", features: ["All Pro Features", "4 PT Sessions/mo", "Nutrition Plan", "Towel Service"] },
    ]
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-neon selection:text-black">
      
      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-white/5 ${isScrolled ? 'bg-zinc-950/90 backdrop-blur-md py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="text-2xl font-display font-bold italic tracking-tighter text-white">
            IRON<span className="text-neon">FORGE</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {['Classes', 'Trainers', 'Membership', 'Gallery'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-sm font-bold uppercase tracking-wider text-zinc-400 hover:text-neon transition-colors"
              >
                {item}
              </button>
            ))}
            <button 
                onClick={() => scrollToSection('contact')}
                className="bg-neon text-black px-6 py-2 font-bold uppercase text-sm tracking-wider hover:bg-white transition-colors clip-path-slant"
            >
              Join Now
            </button>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-zinc-900 border-b border-zinc-800 flex flex-col p-6 gap-4 md:hidden">
             {['Classes', 'Trainers', 'Membership', 'Gallery', 'Contact'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-left text-lg font-bold uppercase text-zinc-300 hover:text-neon"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* --- HERO --- */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={config.hero.bgImage} alt="Hero" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center md:text-left md:flex md:items-end md:justify-between pb-20 h-full">
           <div className="md:w-2/3 flex flex-col justify-center h-full">
              <div className="inline-flex items-center gap-2 text-neon font-bold uppercase tracking-widest mb-4 animate-fade-in-up">
                <Zap size={20} fill="currentColor" />
                <span>Est. 2024</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-display font-bold uppercase italic leading-[0.9] mb-6">
                Tu Mejor <br/> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">Versión</span> <br/>
                <span className="text-neon">Comienza Ahora</span>
              </h1>
              <p className="text-zinc-400 text-lg max-w-xl mb-10 leading-relaxed">
                {config.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => scrollToSection('membership')} className="group relative px-8 py-4 bg-neon text-black font-bold uppercase tracking-wider overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">Start Free Trial <ArrowRight size={18} /></span>
                  <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out origin-left" />
                </button>
                <button onClick={() => scrollToSection('classes')} className="px-8 py-4 border border-zinc-700 text-white font-bold uppercase tracking-wider hover:border-neon hover:text-neon transition-colors">
                  View Classes
                </button>
              </div>
           </div>
        </div>
      </header>

      {/* --- FEATURES STRIP --- */}
      <div className="bg-neon text-black py-12 relative z-20 -mt-10 md:-mt-20 border-t-4 border-black">
        <div className="container mx-auto px-6">
           <div className="grid md:grid-cols-3 gap-8">
             {[
               { icon: Dumbbell, title: "Premium Equipment", desc: "Top-tier Technogym gear & olympic weights." },
               { icon: Users, title: "Active Community", desc: "Train in an environment that pushes limits." },
               { icon: Clock, title: "Open 24/7", desc: "Access our facilities whenever you want." }
             ].map((item, i) => (
               <div key={i} className="flex items-start gap-4 group">
                 <div className="p-3 bg-black text-neon rounded-sm transform group-hover:-rotate-6 transition-transform">
                   <item.icon size={28} />
                 </div>
                 <div>
                   <h3 className="font-display font-bold text-xl uppercase mb-1">{item.title}</h3>
                   <p className="text-zinc-800 text-sm font-medium leading-snug">{item.desc}</p>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* --- CLASSES --- */}
      <section id="classes" className="py-24 bg-zinc-900">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-display font-bold uppercase italic text-white">Our <span className="text-neon">Classes</span></h2>
              <p className="text-zinc-500 mt-2">High intensity to active recovery.</p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-neon hover:text-white transition-colors font-bold uppercase text-sm">
              Full Schedule <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {config.classes.map((item, idx) => (
              <div key={idx} className="group relative h-96 overflow-hidden border border-zinc-800 bg-zinc-950">
                <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                
                <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-2xl font-display font-bold uppercase italic text-white mb-2">{item.name}</h3>
                  <p className="text-zinc-400 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">{item.desc}</p>
                  <div className="w-12 h-1 bg-neon transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TRAINERS --- */}
      <section id="trainers" className="py-24 bg-zinc-950 border-t border-zinc-900">
        <div className="container mx-auto px-6 text-center mb-16">
          <h2 className="text-4xl font-display font-bold uppercase italic mb-4">Elite <span className="text-zinc-600">Coaches</span></h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">Certified professionals dedicated to your transformation.</p>
        </div>

        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
          {config.trainers.map((trainer, idx) => (
            <div key={idx} className="group relative">
              <div className="relative h-[400px] bg-zinc-900 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                <img src={trainer.image} alt={trainer.name} className="w-full h-full object-cover object-top" />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-neon/90 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h4 className="text-black font-display font-bold text-3xl uppercase italic">{trainer.name}</h4>
                    <p className="text-black font-bold tracking-widest uppercase text-sm mt-2">{trainer.role}</p>
                    <div className="flex gap-4 mt-6">
                      <div className="p-2 bg-black text-white hover:bg-white hover:text-black transition-colors cursor-pointer"><Instagram size={18} /></div>
                      <div className="p-2 bg-black text-white hover:bg-white hover:text-black transition-colors cursor-pointer"><Twitter size={18} /></div>
                    </div>
                </div>
              </div>
              {/* Default Label */}
              <div className="mt-4 flex justify-between items-center group-hover:opacity-50 transition-opacity">
                <h3 className="text-xl font-bold uppercase text-white">{trainer.name}</h3>
                <span className="text-xs font-bold text-neon uppercase border border-zinc-800 px-2 py-1">{trainer.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- PRICING --- */}
      <section id="membership" className="py-24 bg-zinc-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold uppercase italic">Membership <span className="text-neon">Plans</span></h2>
            <p className="text-zinc-400 mt-4">No hidden fees. No long-term contracts.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {config.pricing.map((plan, idx) => (
              <div key={idx} className={`relative p-8 border flex flex-col ${plan.recommended ? 'bg-zinc-800 border-neon scale-105 z-10 shadow-[0_0_30px_rgba(190,242,100,0.15)]' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}>
                {plan.recommended && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-neon text-black font-bold text-xs uppercase px-4 py-1 tracking-widest">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold uppercase text-zinc-100 mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className={`text-4xl font-display font-bold ${plan.recommended ? 'text-neon' : 'text-white'}`}>{plan.price}</span>
                  <span className="text-zinc-500 font-medium">/month</span>
                </div>
                <ul className="flex-1 space-y-4 mb-8">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3 text-sm text-zinc-300">
                      <Check size={16} className={plan.recommended ? 'text-neon' : 'text-zinc-600'} />
                      {feat}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-4 font-bold uppercase tracking-wider text-sm transition-all ${plan.recommended ? 'bg-neon text-black hover:bg-white' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}>
                  Select Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- GALLERY (Masonry Grid) --- */}
      <section id="gallery" className="py-4 bg-black">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
             {[
                "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=600&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=600&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=600&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1623874514711-0f321325f318?q=80&w=600&auto=format&fit=crop",
              ].map((img, idx) => (
                <div key={idx} className="relative group overflow-hidden h-64">
                    <img src={img} alt="Gallery" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-60 group-hover:opacity-100" />
                </div>
             ))}
        </div>
      </section>

      {/* --- CONTACT --- */}
      <section id="contact" className="grid md:grid-cols-2">
         <div className="bg-zinc-900 p-12 md:p-20 flex flex-col justify-center">
            <h2 className="text-4xl font-display font-bold uppercase italic mb-8">Get In <span className="text-neon">Touch</span></h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <MapPin className="text-neon mt-1" />
                <div>
                  <h4 className="text-white font-bold uppercase mb-1">Location</h4>
                  <p className="text-zinc-400">Av. Libertador 1234, Buenos Aires</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <Mail className="text-neon mt-1" />
                <div>
                  <h4 className="text-white font-bold uppercase mb-1">Email</h4>
                  <p className="text-zinc-400">contact@ironforge.com</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <Phone className="text-neon mt-1" />
                <div>
                  <h4 className="text-white font-bold uppercase mb-1">Phone</h4>
                  <p className="text-zinc-400">+54 11 1234-5678</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-12">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:border-neon hover:text-neon transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
         </div>

         <div className="bg-zinc-950 p-12 md:p-20 flex flex-col justify-center relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon to-transparent md:hidden" />
            <h3 className="text-2xl text-white font-bold uppercase mb-6">Book Free Class</h3>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
               <div className="grid md:grid-cols-2 gap-4">
                 <input type="text" placeholder="Name" className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white focus:border-neon outline-none transition-colors placeholder:uppercase placeholder:text-xs placeholder:font-bold" />
                 <input type="tel" placeholder="Phone" className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white focus:border-neon outline-none transition-colors placeholder:uppercase placeholder:text-xs placeholder:font-bold" />
               </div>
               <input type="email" placeholder="Email" className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white focus:border-neon outline-none transition-colors placeholder:uppercase placeholder:text-xs placeholder:font-bold" />
               <select className="w-full bg-zinc-900 border border-zinc-800 p-4 text-zinc-400 focus:border-neon outline-none uppercase text-xs font-bold">
                 <option>Weight Loss</option>
                 <option>Muscle Gain</option>
                 <option>Endurance</option>
               </select>
               <button className="w-full bg-white text-black py-4 font-bold uppercase tracking-widest hover:bg-neon transition-colors">
                 Submit Request
               </button>
            </form>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-black border-t border-zinc-900 py-8 text-center">
        <p className="text-zinc-600 text-sm font-medium uppercase tracking-wider">&copy; {new Date().getFullYear()} Iron Forge Fitness. All Rights Reserved.</p>
      </footer>

    </div>
  );
};

export default LandingGymTwo;