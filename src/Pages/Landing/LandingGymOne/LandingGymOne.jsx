import React, { useState, useEffect } from "react";
import {
  Menu, X, MapPin, Phone, Mail, Instagram, Facebook, Twitter,
  ArrowRight, Star, Clock, Check, Trophy, Target, Dumbbell
} from "lucide-react";

const LandingGymOne = () => {
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
  const config = {
    locations: [
      { area: "Distrito Financiero", address: "Calle 50 & Av. Central", type: "Flagship" },
      { area: "Zona Norte", address: "Av. Libertador 8000", type: "Premium Club" },
      { area: "Residencial Oeste", address: "Boulevard Los Andes 400", type: "24/7 Access" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605296867304-6f2b63b8ad4c?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590487988256-9ed24133863e?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517963879466-cd11b83271bc?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542766788-a2f588f447ee?q=80&w=600&auto=format&fit=crop",
    ],
    pricing: [
      { title: "Executive", price: "$50", features: ["Acceso Global", "Toallas Premium", "Locker Privado"] },
      { title: "Black Card", price: "$85", features: ["Acceso Total + Spa", "Entrenador Personal (2x/mes)", "Invitados Ilimitados"], recommended: true },
      { title: "Signature", price: "$120", features: ["Todo Incluido", "Nutrición Personalizada", "Estacionamiento Valet"] },
    ]
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans selection:bg-amber-600 selection:text-white">
      
      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-black/90 backdrop-blur-sm py-4 border-b border-neutral-800' : 'bg-transparent py-8'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 border-2 border-amber-600 rounded-none flex items-center justify-center transform rotate-45 group-hover:rotate-90 transition-transform duration-500">
              <div className="w-4 h-4 bg-amber-600"></div>
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-2xl font-serif tracking-widest text-white font-bold">IRON</span>
              <span className="text-xs text-amber-600 tracking-[0.3em] uppercase font-bold">Signature</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-12">
            {['Clubes', 'Servicios', 'Galería', 'Membresía'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item.toLowerCase() === 'clubes' ? 'locations' : item.toLowerCase() === 'servicios' ? 'features' : item.toLowerCase() === 'membresía' ? 'pricing' : 'gallery')}
                className="text-sm font-medium uppercase tracking-widest hover:text-amber-500 transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-amber-500 transition-all group-hover:w-full"></span>
              </button>
            ))}
            <button onClick={() => scrollToSection('contact')} className="border border-neutral-700 text-white px-8 py-2 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300">
              Reservar
            </button>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-white hover:text-amber-500 transition-colors" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-neutral-900 border-b border-neutral-800 p-8 md:hidden flex flex-col gap-6 shadow-2xl">
             {['Clubes', 'Servicios', 'Galería', 'Membresía', 'Contacto'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item.toLowerCase() === 'clubes' ? 'locations' : item.toLowerCase() === 'servicios' ? 'features' : item.toLowerCase() === 'membresía' ? 'pricing' : item.toLowerCase() === 'contacto' ? 'contact' : 'gallery')}
                className="text-left text-xl font-serif text-neutral-300 hover:text-amber-500 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1600&auto=format&fit=crop" 
            alt="Luxury Gym" 
            className="w-full h-full object-cover opacity-40 grayscale" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-90"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0a0a0a_100%)]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-block mb-6">
            <div className="h-[1px] w-24 bg-amber-600 mb-2 mx-auto"></div>
            <span className="text-amber-500 uppercase tracking-[0.4em] text-xs font-bold">Est. MMXXIV</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-serif text-white mb-8 tracking-tight">
            ELEVATE YOUR <br />
            <span className="italic text-neutral-500">STANDARDS</span>
          </h1>
          
          <p className="text-neutral-400 text-lg max-w-xl mx-auto mb-12 font-light leading-relaxed">
            Más que un gimnasio, un santuario para el desarrollo físico y mental. 
            Experimenta la excelencia en cada detalle.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-6">
            <button onClick={() => scrollToSection('pricing')} className="bg-amber-700 text-white px-10 py-4 uppercase tracking-widest text-sm hover:bg-amber-600 transition-colors shadow-[0_0_20px_rgba(180,83,9,0.3)]">
              Comenzar Ahora
            </button>
            <button onClick={() => scrollToSection('locations')} className="border border-neutral-600 text-white px-10 py-4 uppercase tracking-widest text-sm hover:border-white transition-colors bg-transparent backdrop-blur-sm">
              Ver Clubes
            </button>
          </div>
        </div>
      </header>

      {/* --- FEATURES (SERVICIOS) --- */}
      <section id="features" className="py-32 bg-black">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-16">
            {[
              { icon: Trophy, title: "Equipamiento Elite", desc: "Línea Artis de Technogym y zona de pesos libres calibrados." },
              { icon: Target, title: "Training Personal", desc: "Entrenadores de alto rendimiento dedicados a tu evolución." },
              { icon: Dumbbell, title: "Espacios Privados", desc: "Salas exclusivas para sesiones one-on-one y recuperación." },
            ].map((feature, i) => (
              <div key={i} className="text-center group">
                <div className="w-20 h-20 mx-auto border border-neutral-800 rounded-full flex items-center justify-center mb-8 group-hover:border-amber-600 transition-colors duration-500">
                  <feature.icon size={32} className="text-neutral-500 group-hover:text-amber-500 transition-colors duration-500" />
                </div>
                <h3 className="text-xl text-white font-serif mb-4">{feature.title}</h3>
                <div className="w-8 h-[1px] bg-amber-600 mx-auto mb-4"></div>
                <p className="text-neutral-500 font-light leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- LOCATIONS (SUCURSALES) --- */}
      <section id="locations" className="py-32 bg-neutral-900 relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-neutral-800 pb-8">
             <div>
               <h2 className="text-4xl font-serif text-white mb-2">Nuestros Clubes</h2>
               <p className="text-neutral-500 font-light">Ubicaciones estratégicas para tu comodidad.</p>
             </div>
             <button className="hidden md:flex items-center gap-2 text-amber-600 uppercase text-xs tracking-widest font-bold hover:text-amber-500 transition-colors mt-4 md:mt-0">
               Ver Mapa Completo <ArrowRight size={16} />
             </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {config.locations.map((loc, idx) => (
              <div key={idx} className="bg-neutral-950 p-10 border border-neutral-900 hover:border-amber-900/50 transition-colors duration-500 group">
                <div className="flex justify-between items-start mb-8">
                  <MapPin className="text-neutral-600 group-hover:text-amber-600 transition-colors" size={24} />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 border border-neutral-800 px-3 py-1">{loc.type}</span>
                </div>
                <h3 className="text-2xl text-white font-serif mb-2">{loc.area}</h3>
                <p className="text-neutral-500 font-light mb-8">{loc.address}</p>
                <ul className="space-y-3 mb-8 border-t border-neutral-900 pt-6">
                  <li className="flex items-center gap-3 text-sm text-neutral-400">
                    <Clock size={14} className="text-amber-700" /> Lun-Vie: 06:00 - 23:00
                  </li>
                  <li className="flex items-center gap-3 text-sm text-neutral-400">
                    <Clock size={14} className="text-amber-700" /> Sab-Dom: 08:00 - 20:00
                  </li>
                </ul>
                <button className="w-full py-3 bg-neutral-900 text-neutral-300 uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-colors">
                  Agendar Visita
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- GALLERY --- */}
      <section id="gallery" className="py-32 bg-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-serif text-white mb-4">Espacios de Excelencia</h2>
            <div className="w-16 h-[1px] bg-amber-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            {config.gallery.map((img, idx) => (
              <div key={idx} className={`relative group overflow-hidden h-80 ${idx === 0 ? 'md:col-span-2' : ''}`}>
                <img 
                  src={img} 
                  alt="Gallery" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0" 
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-transparent transition-colors duration-500"></div>
                <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                  <span className="text-white text-sm uppercase tracking-widest font-bold border-l-2 border-amber-600 pl-3">
                    Iron Zone {idx + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRICING (MEMBRESIA) --- */}
      <section id="pricing" className="py-32 bg-neutral-900">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
            {config.pricing.map((plan, idx) => (
              <div 
                key={idx} 
                className={`relative p-10 flex flex-col ${
                  plan.recommended 
                    ? 'bg-neutral-950 border-y-4 border-y-amber-600 z-10 shadow-2xl' 
                    : 'bg-neutral-950/50 border border-neutral-800'
                }`}
              >
                {plan.recommended && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-amber-600 text-black text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2">Recomendado</span>
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-amber-600 text-xs font-bold uppercase tracking-[0.2em] mb-4">{plan.title}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-serif text-white">{plan.price}</span>
                    <span className="text-neutral-500 font-light">/ mes</span>
                  </div>
                </div>

                <ul className="space-y-6 mb-10 flex-1">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-4 text-neutral-400 text-sm font-light">
                      <div className="w-1 h-1 bg-amber-600 rounded-full"></div>
                      {feat}
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-4 uppercase text-xs tracking-[0.2em] transition-colors ${
                  plan.recommended 
                    ? 'bg-amber-600 text-black hover:bg-white' 
                    : 'border border-neutral-700 text-white hover:border-white'
                }`}>
                  Seleccionar
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CONTACT / FOOTER --- */}
      <footer id="contact" className="bg-black text-white pt-32 pb-12 border-t border-neutral-900">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-20 mb-20">
            <div>
              <h2 className="text-4xl font-serif mb-8">Ready to Join?</h2>
              <p className="text-neutral-500 font-light max-w-md mb-10">
                Déjanos tus datos y un asesor de membresías se pondrá en contacto contigo para agendar tu visita exclusiva.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-amber-600"><MapPin size={20} /></div>
                  <div>
                    <h4 className="uppercase text-xs tracking-widest font-bold mb-1">Oficina Central</h4>
                    <p className="text-neutral-500 text-sm">Av. Libertador 1234, Piso 10, Buenos Aires</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-amber-600"><Phone size={20} /></div>
                  <div>
                    <h4 className="uppercase text-xs tracking-widest font-bold mb-1">Teléfono VIP</h4>
                    <p className="text-neutral-500 text-sm">+54 11 9999-9999</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-neutral-900 p-10 border border-neutral-800">
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-neutral-500 mb-2">Nombre</label>
                    <input type="text" className="w-full bg-black border border-neutral-800 p-3 text-white focus:border-amber-600 outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-neutral-500 mb-2">Apellido</label>
                    <input type="text" className="w-full bg-black border border-neutral-800 p-3 text-white focus:border-amber-600 outline-none transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-500 mb-2">Email</label>
                  <input type="email" className="w-full bg-black border border-neutral-800 p-3 text-white focus:border-amber-600 outline-none transition-colors" />
                </div>
                <button className="w-full bg-amber-700 text-white py-4 uppercase tracking-widest text-xs hover:bg-amber-600 transition-colors mt-4">
                  Solicitar Membresía
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-neutral-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-neutral-600 text-xs uppercase tracking-widest">© {new Date().getFullYear()} Iron Forge Signature.</p>
            <div className="flex gap-6">
               <Instagram size={18} className="text-neutral-600 hover:text-white cursor-pointer transition-colors" />
               <Twitter size={18} className="text-neutral-600 hover:text-white cursor-pointer transition-colors" />
               <Facebook size={18} className="text-neutral-600 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingGymOne;
