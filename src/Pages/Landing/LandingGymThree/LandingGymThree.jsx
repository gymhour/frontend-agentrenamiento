import React, { useState, useEffect } from "react";
import {
  Menu, X, MapPin, Phone, Mail, Instagram, Facebook, Twitter,
  Check, Star, ArrowRight, Heart, Leaf, Sun, Droplets
} from "lucide-react";

const LandingGymThree = () => {
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm py-3' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="text-xl tracking-widest uppercase font-bold text-teal-700 flex items-center gap-2">
            <Leaf size={24} /> Iron Forge
          </div>

          <div className="hidden md:flex items-center gap-10">
            {['Classes', 'Team', 'Pricing', 'Contact'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors"
              >
                {item}
              </button>
            ))}
            <button 
              onClick={() => scrollToSection('contact')}
              className="bg-teal-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-200 transition-all"
            >
              Book Session
            </button>
          </div>

          <button className="md:hidden text-slate-800" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-t border-slate-100 p-6 shadow-xl md:hidden flex flex-col gap-4">
             {['Classes', 'Team', 'Pricing', 'Contact'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-left text-lg font-medium text-slate-700 py-2"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* --- HERO --- */}
      <header className="relative h-[90vh] flex items-center rounded-b-[3rem] overflow-hidden mx-2 md:mx-4 mt-2 md:mt-4 shadow-2xl shadow-slate-200">
        <img 
          src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=2000&auto=format&fit=crop" 
          alt="Wellness" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent" />
        
        <div className="container mx-auto px-6 md:px-12 relative z-10 pt-20">
          <div className="max-w-xl">
            <span className="inline-block py-1 px-3 rounded-full bg-teal-100 text-teal-800 text-xs font-bold tracking-wider mb-6">
              HOLISTIC FITNESS CENTER
            </span>
            <h1 className="text-5xl md:text-7xl font-light text-slate-900 leading-tight mb-6">
              Balance Your <br />
              <span className="font-serif italic text-teal-700">Body & Mind</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Experience a new way of training. Connect with your inner strength through our personalized programs designed for longevity and vitality.
            </p>
            <div className="flex gap-4">
              <button onClick={() => scrollToSection('pricing')} className="bg-slate-900 text-white px-8 py-3 rounded-full font-medium hover:bg-slate-800 transition-all">
                Start Journey
              </button>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <img key={i} src={`https://picsum.photos/40/40?random=${i}`} className="w-10 h-10 rounded-full border-2 border-white" alt="User" />
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-700">500+ Happy Members</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- BENEFITS --- */}
      <section className="py-24">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-serif text-slate-800 mb-4">Why Choose Iron Forge?</h2>
            <p className="text-slate-500">We believe in a holistic approach to fitness, combining physical training with mental well-being.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
             {[
               { icon: Heart, title: "Heart & Health", desc: "Cardio focused zones designed to improve your cardiovascular health." },
               { icon: Sun, title: "Mindfulness", desc: "Dedicated spaces for yoga, meditation and mental clarity." },
               { icon: Droplets, title: "Recovery", desc: "Premium sauna and spa facilities to help you recover faster." }
             ].map((item, i) => (
               <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-teal-50 hover:-translate-y-1 transition-all duration-300">
                 <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-6">
                   <item.icon size={24} />
                 </div>
                 <h3 className="text-xl font-semibold text-slate-800 mb-3">{item.title}</h3>
                 <p className="text-slate-500 leading-relaxed">{item.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* --- CLASSES (Carousel Style Layout) --- */}
      <section id="classes" className="py-24 bg-teal-900 text-white overflow-hidden rounded-3xl mx-2 md:mx-4">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
               <h2 className="text-4xl font-serif italic mb-2">Daily Classes</h2>
               <p className="text-teal-200">Find your flow with our expert instructors.</p>
            </div>
            <button className="mt-4 md:mt-0 text-white border-b border-white pb-1 hover:opacity-80 transition-opacity">View Schedule</button>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
             {[
               { name: "Yoga Flow", img: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=600&auto=format&fit=crop" },
               { name: "Pilates", img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop" },
               { name: "Barre", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop" },
               { name: "Meditation", img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop" },
             ].map((cls, idx) => (
               <div key={idx} className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer">
                 <img src={cls.img} alt={cls.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                 <div className="absolute bottom-6 left-6">
                   <h3 className="text-xl font-medium">{cls.name}</h3>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* --- TEAM --- */}
      <section id="team" className="py-24">
         <div className="container mx-auto px-6 md:px-12">
            <h2 className="text-3xl font-serif text-center mb-16">Meet The Guides</h2>
            <div className="flex flex-wrap justify-center gap-12">
               {[
                 { name: "Sarah J.", role: "Head of Yoga", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop" },
                 { name: "David M.", role: "Strength & Conditioning", img: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=400&auto=format&fit=crop" },
                 { name: "Elena R.", role: "Nutritionist", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop" },
               ].map((person, idx) => (
                 <div key={idx} className="text-center group">
                   <div className="w-48 h-48 mx-auto rounded-full overflow-hidden mb-6 border-4 border-white shadow-xl shadow-slate-100 group-hover:shadow-teal-100 transition-all">
                     <img src={person.img} alt={person.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                   </div>
                   <h3 className="text-xl font-bold text-slate-800">{person.name}</h3>
                   <p className="text-teal-600 text-sm uppercase tracking-widest mt-1">{person.role}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* --- PRICING --- */}
      <section id="pricing" className="py-24 bg-slate-100">
        <div className="container mx-auto px-6 md:px-12">
           <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 items-center">
              {/* Card 1 */}
              <div className="bg-white p-8 rounded-3xl shadow-sm">
                <h3 className="text-slate-500 font-bold uppercase text-sm mb-4">Basic</h3>
                <div className="text-4xl font-serif text-slate-800 mb-6">$25<span className="text-sm font-sans text-slate-400">/mo</span></div>
                <ul className="space-y-4 mb-8">
                   <li className="flex gap-3 text-slate-600"><Check size={18} className="text-teal-500" /> Gym Access</li>
                   <li className="flex gap-3 text-slate-600"><Check size={18} className="text-teal-500" /> Locker</li>
                </ul>
                <button className="w-full py-3 border border-slate-200 rounded-xl font-medium hover:border-teal-500 hover:text-teal-600 transition-colors">Choose Basic</button>
              </div>

              {/* Card 2 (Highlight) */}
              <div className="bg-slate-900 text-white p-10 rounded-3xl shadow-2xl shadow-slate-300 transform md:scale-110 z-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-teal-500 text-white text-xs font-bold px-4 py-2 rounded-bl-xl">POPULAR</div>
                <h3 className="text-teal-400 font-bold uppercase text-sm mb-4">Pro Wellness</h3>
                <div className="text-5xl font-serif mb-6">$45<span className="text-sm font-sans text-slate-400">/mo</span></div>
                <ul className="space-y-4 mb-10">
                   <li className="flex gap-3 text-slate-300"><Check size={18} className="text-teal-400" /> 24/7 Access</li>
                   <li className="flex gap-3 text-slate-300"><Check size={18} className="text-teal-400" /> All Classes</li>
                   <li className="flex gap-3 text-slate-300"><Check size={18} className="text-teal-400" /> Sauna & Spa</li>
                </ul>
                <button className="w-full py-4 bg-teal-600 rounded-xl font-bold hover:bg-teal-500 transition-colors shadow-lg shadow-teal-900/50">Get Started</button>
              </div>

              {/* Card 3 */}
              <div className="bg-white p-8 rounded-3xl shadow-sm">
                <h3 className="text-slate-500 font-bold uppercase text-sm mb-4">Elite</h3>
                <div className="text-4xl font-serif text-slate-800 mb-6">$70<span className="text-sm font-sans text-slate-400">/mo</span></div>
                <ul className="space-y-4 mb-8">
                   <li className="flex gap-3 text-slate-600"><Check size={18} className="text-teal-500" /> All Pro Features</li>
                   <li className="flex gap-3 text-slate-600"><Check size={18} className="text-teal-500" /> Personal Trainer</li>
                   <li className="flex gap-3 text-slate-600"><Check size={18} className="text-teal-500" /> Nutrition Plan</li>
                </ul>
                <button className="w-full py-3 border border-slate-200 rounded-xl font-medium hover:border-teal-500 hover:text-teal-600 transition-colors">Choose Elite</button>
              </div>
           </div>
        </div>
      </section>

      {/* --- CONTACT / FOOTER --- */}
      <footer id="contact" className="bg-slate-900 text-white pt-24 pb-12 rounded-t-[3rem] mt-12 mx-2 md:mx-4">
         <div className="container mx-auto px-6 md:px-12">
            <div className="grid md:grid-cols-2 gap-16 mb-20">
              <div>
                <div className="text-2xl tracking-widest uppercase font-bold text-white flex items-center gap-2 mb-6">
                  <Leaf size={24} className="text-teal-500" /> Iron Forge
                </div>
                <p className="text-slate-400 leading-relaxed max-w-md mb-8">
                   A sanctuary for your body and mind. Join us to discover what your body is truly capable of in an environment that nurtures growth.
                </p>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-teal-600 transition-colors"><Instagram size={18} /></div>
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-teal-600 transition-colors"><Facebook size={18} /></div>
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-teal-600 transition-colors"><Twitter size={18} /></div>
                </div>
              </div>

              <div className="bg-white/5 p-8 rounded-3xl backdrop-blur-sm border border-white/10">
                 <h3 className="text-xl font-serif mb-6">Get in touch</h3>
                 <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                   <input type="email" placeholder="Your Email Address" className="w-full bg-transparent border-b border-slate-600 py-3 px-2 text-white focus:border-teal-500 outline-none transition-colors" />
                   <button className="flex items-center gap-2 text-teal-400 font-medium hover:text-white transition-colors mt-4">Send Message <ArrowRight size={16}/></button>
                 </form>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-sm">
               <p>&copy; 2024 Iron Forge Fitness.</p>
               <div className="flex gap-8">
                 <a href="#" className="hover:text-white transition-colors">Privacy</a>
                 <a href="#" className="hover:text-white transition-colors">Terms</a>
                 <a href="#" className="hover:text-white transition-colors">Cookies</a>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default LandingGymThree;