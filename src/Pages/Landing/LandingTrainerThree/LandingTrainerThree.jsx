import React, { useState, useEffect } from "react";
import {
  Menu, X, ArrowRight, Check, PlayCircle, Instagram, Youtube, Twitter, 
  Dumbbell, Timer, TrendingUp, Users, Quote
} from "lucide-react";

const LandingTrainerThree= () => {
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
    <div className="min-h-screen bg-white text-zinc-950 font-sans selection:bg-lime-400 selection:text-black">
      
      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md border-b-2 border-zinc-100 py-3' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-1 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="font-black text-2xl italic tracking-tighter uppercase border-2 border-black px-2 bg-lime-400 transform -skew-x-6">
              LIFT
            </div>
            <div className="font-black text-2xl italic tracking-tighter uppercase">
              LIFE.
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {['Enfoque', 'Historias', 'Planes', 'Comunidad'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item.toLowerCase() === 'enfoque' ? 'focus' : item.toLowerCase() === 'historias' ? 'stories' : item.toLowerCase() === 'planes' ? 'plans' : 'community')}
                className="text-sm font-extrabold uppercase tracking-wide hover:text-lime-600 transition-colors"
              >
                {item}
              </button>
            ))}
            <button 
              onClick={() => scrollToSection('plans')}
              className="bg-black text-white px-6 py-3 font-black uppercase tracking-wider hover:bg-lime-400 hover:text-black transition-all border-2 border-transparent hover:border-black shadow-[4px_4px_0px_0px_rgba(163,230,53,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              Entrenar
            </button>
          </div>

          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b-4 border-lime-400 flex flex-col p-6 shadow-xl">
             {['Enfoque', 'Historias', 'Planes', 'Comunidad'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item.toLowerCase() === 'enfoque' ? 'focus' : item.toLowerCase() === 'historias' ? 'stories' : item.toLowerCase() === 'planes' ? 'plans' : 'community')}
                className="text-left py-4 text-2xl font-black uppercase italic border-b border-zinc-100 hover:text-lime-600"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-1/4 right-[-10%] w-[600px] h-[600px] bg-lime-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
        <div className="absolute bottom-0 left-[-10%] w-[500px] h-[500px] bg-zinc-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            
            <div className="lg:w-1/2">
               <div className="inline-flex items-center gap-2 border-2 border-black bg-white px-4 py-2 rounded-full mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="w-3 h-3 bg-lime-500 rounded-full animate-ping"></div>
                  <span className="text-xs font-black uppercase tracking-widest">Cupos Disponibles: 4</span>
               </div>
               
               <h1 className="text-6xl md:text-8xl font-black uppercase leading-[0.9] tracking-tighter mb-8">
                 Define Tu <br/>
                 <span className="relative z-10 inline-block px-2">
                   <span className="relative z-10">Propia</span>
                   <span className="absolute inset-0 bg-lime-400 transform -rotate-2 -z-0"></span>
                 </span> <br/>
                 Fuerza.
               </h1>
               
               <p className="text-xl text-zinc-600 font-medium max-w-md mb-10 leading-relaxed">
                 Entrenamiento funcional diseñado para la vida real. 
                 Sin atajos. Sin excusas. Solo movimiento inteligente y energía pura.
               </p>
               
               <div className="flex flex-col sm:flex-row gap-4">
                 <button onClick={() => scrollToSection('plans')} className="px-8 py-4 bg-black text-white font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-lime-400 hover:text-black border-2 border-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                   Empezar Ahora <ArrowRight size={20} />
                 </button>
                 <button className="px-8 py-4 bg-white text-black font-black uppercase tracking-wider border-2 border-zinc-200 hover:border-black transition-all flex items-center justify-center gap-2 group">
                   <PlayCircle size={20} className="group-hover:text-lime-500 transition-colors"/> Ver Video
                 </button>
               </div>
            </div>

            <div className="lg:w-1/2 relative">
              {/* Image Container */}
              <div className="relative z-10">
                 <img 
                    src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop" 
                    alt="Trainer Active" 
                    className="w-full h-auto object-cover grayscale contrast-125 mask-image-blob"
                    style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 90%, 0% 100%)' }}
                 />
                 {/* Floating Card */}
                 <div className="absolute bottom-10 left-0 bg-white p-6 border-2 border-black shadow-[8px_8px_0px_0px_rgba(163,230,53,1)] max-w-[200px]">
                    <p className="text-4xl font-black">98%</p>
                    <p className="text-xs font-bold uppercase text-zinc-500">Tasa de Éxito</p>
                 </div>
              </div>
              {/* Pattern dots */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[url('https://www.transparenttextures.com/patterns/dot-grid.png')] opacity-50 z-0"></div>
            </div>

          </div>
        </div>
      </header>

      {/* --- STATS STRIP --- */}
      <div className="bg-black text-white py-12 border-y-4 border-lime-400">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Atletas", val: "400+" },
            { label: "Programas", val: "50+" },
            { label: "Años", val: "08" },
            { label: "Calificación", val: "5.0" },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-4xl md:text-5xl font-black italic text-lime-400">{stat.val}</div>
              <div className="text-xs md:text-sm font-bold uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* --- FOCUS SECTION (Cards) --- */}
      <section id="focus" className="py-24 bg-zinc-50">
         <div className="container mx-auto px-6">
            <div className="mb-16 md:flex justify-between items-end">
               <div className="max-w-2xl">
                 <h2 className="text-4xl md:text-5xl font-black uppercase mb-4">Tu Cuerpo <br/> <span className="text-lime-600">En Movimiento</span></h2>
                 <p className="text-lg text-zinc-600 font-medium">
                   No entrenamos para la foto. Entrenamos para rendir. 
                   Mi metodología combina fuerza, movilidad y resistencia metabólica.
                 </p>
               </div>
               <button className="hidden md:block text-black font-bold uppercase border-b-2 border-lime-400 hover:bg-lime-400 transition-all px-2">
                 Leer Manifiesto
               </button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
               {[
                 { icon: Dumbbell, title: "Fuerza Híbrida", desc: "Combina levantamientos pesados con calistenia avanzada." },
                 { icon: Timer, title: "Alta Intensidad", desc: "Circuitos metabólicos cortos pero devastadores para quemar grasa." },
                 { icon: TrendingUp, title: "Progresión", desc: "Sistema de tracking digital para asegurar que superas tus marcas." },
               ].map((item, idx) => (
                 <div key={idx} className="bg-white p-10 border-2 border-zinc-100 hover:border-black transition-all duration-300 group shadow-sm hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative top-0 hover:-top-2">
                    <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mb-8 group-hover:bg-lime-400 transition-colors border-2 border-transparent group-hover:border-black">
                       <item.icon size={32} className="text-black" />
                    </div>
                    <h3 className="text-2xl font-black uppercase italic mb-4">{item.title}</h3>
                    <p className="text-zinc-600 font-medium leading-relaxed">{item.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* --- TESTIMONIALS (Stories) --- */}
      <section id="stories" className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
           <h2 className="text-center text-4xl md:text-6xl font-black uppercase tracking-tight mb-20">
             Historias <span className="text-white bg-black px-2 inline-block transform -rotate-1">Reales</span>
           </h2>

           <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Featured Story Image */}
              <div className="relative">
                 <div className="absolute inset-0 bg-lime-400 transform translate-x-4 translate-y-4 border-2 border-black"></div>
                 <img 
                    src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800&auto=format&fit=crop" 
                    alt="Transformation" 
                    className="relative z-10 w-full h-auto object-cover border-2 border-black grayscale hover:grayscale-0 transition-all duration-500"
                 />
              </div>

              {/* Featured Story Text */}
              <div>
                 <Quote size={60} className="text-lime-200 mb-6" fill="currentColor" />
                 <h3 className="text-3xl font-black uppercase italic mb-6">"Nunca me sentí tan fuerte."</h3>
                 <p className="text-xl text-zinc-600 font-medium leading-relaxed mb-8">
                   "Llegué a Diego buscando perder unos kilos, pero encontré una nueva mentalidad. 
                   Los entrenamientos son duros, pero la energía que se genera es adictiva. 
                   En 6 meses, hago cosas que creí imposibles."
                 </p>
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-200 rounded-full overflow-hidden border-2 border-black">
                       <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" alt="User" />
                    </div>
                    <div>
                       <p className="font-black uppercase">Camila S.</p>
                       <p className="text-xs font-bold text-lime-600 uppercase tracking-wider">Programa Híbrido</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* --- PRICING PLANS --- */}
      <section id="plans" className="py-24 bg-zinc-950 text-white relative">
         {/* Decorative Grid */}
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

         <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
               <h2 className="text-4xl md:text-6xl font-black uppercase mb-6">Invierte En <span className="text-lime-400">Ti</span></h2>
               <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                 Elige el nivel de compromiso que mejor se adapte a tu estilo de vida.
               </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
               {[
                 { name: "App Access", price: "39", period: "mes", features: ["Rutina Diaria", "Video Biblioteca", "Comunidad Global"] },
                 { name: "Coaching 1:1", price: "149", period: "mes", features: ["Plan 100% Personalizado", "Revisión de Técnica", "Contacto WhatsApp", "Nutrición"], active: true },
                 { name: "Pack Trimestral", price: "399", period: "3 meses", features: ["Todo lo del Coaching", "Ahorras 15%", "Camiseta de Regalo"] },
               ].map((plan, idx) => (
                 <div key={idx} className={`flex flex-col p-8 border-2 ${plan.active ? 'bg-white text-black border-lime-400 transform md:-translate-y-4 shadow-[0_0_40px_rgba(163,230,53,0.3)]' : 'bg-black border-zinc-800 text-zinc-300'}`}>
                    {plan.active && <div className="bg-lime-400 text-black text-center text-xs font-black uppercase py-1 mb-6 border-2 border-black tracking-widest">Recomendado</div>}
                    
                    <h3 className={`text-xl font-black uppercase italic mb-2 ${plan.active ? 'text-black' : 'text-white'}`}>{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mb-8">
                       <span className="text-5xl font-black">${plan.price}</span>
                       <span className="text-sm font-bold opacity-60">/{plan.period}</span>
                    </div>
                    
                    <ul className="space-y-4 mb-8 flex-1">
                       {plan.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-3 font-bold text-sm">
                             <Check size={18} className={plan.active ? "text-lime-600" : "text-lime-400"} /> {f}
                          </li>
                       ))}
                    </ul>
                    
                    <button className={`w-full py-4 font-black uppercase tracking-wider border-2 transition-all ${plan.active ? 'bg-black text-white border-black hover:bg-lime-400 hover:text-black' : 'bg-transparent border-zinc-700 hover:border-white hover:text-white'}`}>
                       Seleccionar
                    </button>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* --- CONTACT / FOOTER --- */}
      <footer className="bg-white border-t-2 border-zinc-100 pt-24 pb-12">
         <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 mb-20">
               <div>
                  <h2 className="text-5xl font-black uppercase leading-none mb-8">
                    ¿Listo Para <br/> <span className="bg-lime-400 px-2">Sudar?</span>
                  </h2>
                  <p className="text-zinc-600 font-medium mb-8 max-w-md">
                    No esperes al lunes. El mejor momento para construir tu futuro es ahora. Escríbeme y diseñemos tu plan.
                  </p>
                  <div className="flex gap-4">
                     <a href="#" className="w-12 h-12 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"><Instagram size={24} /></a>
                     <a href="#" className="w-12 h-12 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"><Twitter size={24} /></a>
                     <a href="#" className="w-12 h-12 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"><Youtube size={24} /></a>
                  </div>
               </div>

               <div className="bg-zinc-50 p-10 border-2 border-zinc-100">
                  <form className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Nombre" className="bg-white border-2 border-zinc-200 p-4 font-bold text-black outline-none focus:border-black uppercase placeholder:text-zinc-400" />
                        <input type="text" placeholder="Apellido" className="bg-white border-2 border-zinc-200 p-4 font-bold text-black outline-none focus:border-black uppercase placeholder:text-zinc-400" />
                     </div>
                     <input type="email" placeholder="Email" className="w-full bg-white border-2 border-zinc-200 p-4 font-bold text-black outline-none focus:border-black uppercase placeholder:text-zinc-400" />
                     <button className="w-full bg-lime-400 text-black py-4 font-black uppercase tracking-widest border-2 border-black hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
                        Enviar Mensaje
                     </button>
                  </form>
               </div>
            </div>
            
            <div className="border-t border-zinc-100 pt-8 flex flex-col md:flex-row justify-between items-center">
               <p className="text-xs font-bold uppercase text-zinc-500">© {new Date().getFullYear()} Lift Life Training.</p>
               <div className="flex gap-6 text-xs font-bold uppercase text-zinc-500">
                  <a href="#" className="hover:text-black">Legal</a>
                  <a href="#" className="hover:text-black">Privacidad</a>
               </div>
            </div>
         </div>
      </footer>

    </div>
  );
};

export default LandingTrainerThree;