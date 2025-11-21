
import React, { useState, useEffect } from "react";
import {
  Menu, X, Check, ArrowRight, Flame, 
  Activity, Zap, Star, Shield, Instagram, Twitter, Trophy
} from "lucide-react";

const LandingTrainerOne= () => {
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
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-red-600 selection:text-white">
      
      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-zinc-900 py-3 shadow-lg' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className={`text-2xl font-black italic tracking-tighter uppercase ${isScrolled ? 'text-white' : 'text-zinc-900'}`}>
            Max<span className="text-red-600">Power</span>.
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['Filosofía', 'Resultados', 'Planes', 'Contacto'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item.toLowerCase() === 'filosofía' ? 'philosophy' : item.toLowerCase() === 'resultados' ? 'results' : item.toLowerCase() === 'planes' ? 'pricing' : 'contact')}
                className={`text-sm font-bold uppercase tracking-wider hover:text-red-600 transition-colors ${isScrolled ? 'text-zinc-300' : 'text-zinc-800'}`}
              >
                {item}
              </button>
            ))}
            <button 
              onClick={() => scrollToSection('contact')}
              className="bg-red-600 text-white px-8 py-2 skew-x-[-12deg] font-bold uppercase tracking-wider hover:bg-red-700 transition-all"
            >
              <span className="skew-x-[12deg] inline-block">Empezar</span>
            </button>
          </div>

          <button className={`md:hidden ${isScrolled ? 'text-white' : 'text-zinc-900'}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-zinc-900 p-6 md:hidden flex flex-col gap-6 border-t border-zinc-800">
             {['Filosofía', 'Resultados', 'Planes', 'Contacto'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item.toLowerCase() === 'filosofía' ? 'philosophy' : item.toLowerCase() === 'resultados' ? 'results' : item.toLowerCase() === 'planes' ? 'pricing' : 'contact')}
                className="text-left text-xl font-black uppercase italic text-white hover:text-red-600"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative min-h-screen flex items-center overflow-hidden bg-zinc-100">
        {/* Background Graphic (Diagonal) */}
        <div className="absolute top-0 right-0 w-full lg:w-[55%] h-full bg-zinc-900 skew-x-[-12deg] translate-x-20 lg:translate-x-0 origin-bottom"></div>
        
        <div className="container mx-auto px-6 relative z-10 pt-20">
          <div className="flex flex-col lg:flex-row items-center">
            
            {/* Content */}
            <div className="lg:w-1/2 mb-12 lg:mb-0">
               <div className="inline-flex items-center gap-2 text-red-600 font-black uppercase tracking-widest mb-4">
                  <Zap size={20} fill="currentColor" />
                  <span>Entrenamiento de Alto Rendimiento</span>
               </div>
               <h1 className="text-6xl lg:text-8xl font-black italic uppercase leading-[0.9] text-zinc-900 mb-6">
                 Rompe <br/>
                 Tus <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">Límites</span>
               </h1>
               <p className="text-xl font-medium text-zinc-600 max-w-md mb-10 border-l-4 border-red-600 pl-4">
                 No vendo milagros. Vendo disciplina, estrategia y la mejor versión física de tu vida.
               </p>
               
               <div className="flex flex-col sm:flex-row gap-4">
                 <button onClick={() => scrollToSection('pricing')} className="bg-red-600 text-white px-10 py-4 font-black uppercase italic tracking-wider hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 skew-x-[-12deg]">
                    <span className="skew-x-[12deg] inline-block">Únete al Equipo</span>
                 </button>
                 <button onClick={() => scrollToSection('results')} className="bg-transparent border-2 border-zinc-900 text-zinc-900 px-10 py-4 font-black uppercase italic tracking-wider hover:bg-zinc-900 hover:text-white transition-all skew-x-[-12deg]">
                    <span className="skew-x-[12deg] inline-block">Ver Cambios</span>
                 </button>
               </div>
            </div>

            {/* Image Area */}
            <div className="lg:w-1/2 relative h-[500px] lg:h-[800px] w-full flex items-center justify-center">
               <div className="relative z-10 w-full h-full">
                 <img 
                   src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop" 
                   alt="Athlete Trainer" 
                   className="w-full h-full object-cover object-top mask-image-gradient" 
                   style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)' }}
                 />
                 
                 {/* Stat Card */}
                 <div className="absolute bottom-10 left-0 lg:-left-10 bg-white p-6 shadow-2xl border-b-4 border-red-600 max-w-xs">
                    <div className="flex items-center gap-4">
                       <div className="bg-zinc-900 p-3 text-white">
                          <Trophy size={24} />
                       </div>
                       <div>
                          <p className="text-zinc-500 text-xs font-bold uppercase">Experiencia</p>
                          <p className="text-xl font-black text-zinc-900 uppercase italic">10+ Años Forjando Atletas</p>
                       </div>
                    </div>
                 </div>
               </div>
            </div>

          </div>
        </div>
      </header>

      {/* --- PHILOSOPHY (High Energy) --- */}
      <section id="philosophy" className="py-24 bg-white relative">
         <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
               {[
                 { icon: Activity, title: "Movimiento Real", desc: "Entrenamos patrones de movimiento, no solo músculos aislados. Funcionalidad pura." },
                 { icon: Flame, title: "Intensidad", desc: "Si no te desafía, no te cambia. Mis sesiones están diseñadas para sacarte de tu zona de confort." },
                 { icon: Shield, title: "Disciplina", desc: "La motivación va y viene. La disciplina se queda. Construimos hábitos de acero." },
               ].map((item, idx) => (
                 <div key={idx} className="group p-8 border-2 border-zinc-100 hover:border-red-600 hover:shadow-2xl hover:shadow-red-600/10 transition-all duration-300 bg-white">
                    <item.icon size={40} className="text-zinc-400 group-hover:text-red-600 mb-6 transition-colors" />
                    <h3 className="text-2xl font-black uppercase italic text-zinc-900 mb-4">{item.title}</h3>
                    <p className="text-zinc-600 font-medium leading-relaxed">{item.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* --- RESULTS (Dark Mode) --- */}
      <section id="results" className="py-24 bg-zinc-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        
        <div className="container mx-auto px-6 relative z-10">
           <div className="flex flex-col md:flex-row justify-between items-end mb-16">
              <div>
                 <span className="text-red-600 font-bold uppercase tracking-widest mb-2 block">Testimonios</span>
                 <h2 className="text-4xl md:text-5xl font-black italic uppercase">Resultados <span className="text-white">Visibles</span></h2>
              </div>
              <div className="flex gap-2 mt-6 md:mt-0">
                 <Star fill="#dc2626" className="text-red-600" />
                 <Star fill="#dc2626" className="text-red-600" />
                 <Star fill="#dc2626" className="text-red-600" />
                 <Star fill="#dc2626" className="text-red-600" />
                 <Star fill="#dc2626" className="text-red-600" />
              </div>
           </div>

           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: "Javier R.", result: "-15kg Grasa", text: "No fue fácil, pero Alex estuvo ahí cada día. La mejor decisión de mi vida.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop" },
                { name: "Maria L.", result: "+Fuerza", text: "Pasé de no poder hacer una flexión a levantar mi peso corporal. Me siento invencible.", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop" },
                { name: "Tomás B.", result: "Preparación 21k", text: "Me preparó físicamente para mi primera media maratón sin lesiones. Un profesional.", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop" }
              ].map((t, i) => (
                <div key={i} className="bg-zinc-800 p-8 border-l-4 border-red-600 relative group hover:bg-zinc-700 transition-colors">
                   <div className="flex items-center gap-4 mb-6">
                      <img src={t.img} alt={t.name} className="w-14 h-14 rounded-full object-cover border-2 border-zinc-600" />
                      <div>
                         <h4 className="font-bold uppercase text-white">{t.name}</h4>
                         <span className="text-red-500 text-xs font-black uppercase tracking-wider">{t.result}</span>
                      </div>
                   </div>
                   <p className="text-zinc-300 italic">"{t.text}"</p>
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                      <Check size={40} />
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* --- PRICING / PROGRAMS --- */}
      <section id="pricing" className="py-24 bg-zinc-50">
         <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
               <h2 className="text-4xl md:text-5xl font-black italic uppercase text-zinc-900 mb-4">Elige Tu <span className="text-red-600">Desafío</span></h2>
               <p className="text-zinc-600 font-medium text-lg">Programas diseñados para destruir excusas y construir legado.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 items-center">
               {/* Basic */}
               <div className="bg-white p-10 shadow-lg border-t-8 border-zinc-300 hover:border-zinc-500 transition-all">
                  <h3 className="text-2xl font-black uppercase italic text-zinc-400 mb-2">Starter</h3>
                  <div className="text-4xl font-black text-zinc-900 mb-6">$50<span className="text-lg font-bold text-zinc-500">/mes</span></div>
                  <p className="text-zinc-600 mb-8 text-sm font-medium">Para quienes necesitan la hoja de ruta pero caminan solos.</p>
                  <ul className="space-y-4 mb-8">
                     <li className="flex gap-3 text-sm font-bold text-zinc-700"><Check size={18} className="text-red-600"/> Rutina en App</li>
                     <li className="flex gap-3 text-sm font-bold text-zinc-700"><Check size={18} className="text-red-600"/> Guía de Macros</li>
                  </ul>
                  <button className="w-full py-4 border-2 border-zinc-900 text-zinc-900 font-black uppercase tracking-wider hover:bg-zinc-900 hover:text-white transition-colors">
                     Comenzar
                  </button>
               </div>

               {/* PRO (Featured) */}
               <div className="bg-zinc-900 text-white p-12 shadow-2xl border-t-8 border-red-600 transform lg:scale-110 z-10 relative">
                  <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-black uppercase px-4 py-2">Más Popular</div>
                  <h3 className="text-2xl font-black uppercase italic text-white mb-2">Total Transformation</h3>
                  <div className="text-5xl font-black text-white mb-6">$150<span className="text-lg font-bold text-zinc-500">/mes</span></div>
                  <p className="text-zinc-400 mb-8 text-sm font-medium">Coaching 1 a 1. Yo me encargo de pensar, tú de ejecutar.</p>
                  <ul className="space-y-4 mb-10">
                     <li className="flex gap-3 text-sm font-bold text-zinc-300"><Check size={18} className="text-red-600"/> Todo lo del Starter</li>
                     <li className="flex gap-3 text-sm font-bold text-zinc-300"><Check size={18} className="text-red-600"/> Plan Nutricional Completo</li>
                     <li className="flex gap-3 text-sm font-bold text-zinc-300"><Check size={18} className="text-red-600"/> Video Check-ins Semanales</li>
                     <li className="flex gap-3 text-sm font-bold text-zinc-300"><Check size={18} className="text-red-600"/> WhatsApp 24/7</li>
                  </ul>
                  <button onClick={() => scrollToSection('contact')} className="w-full py-5 bg-red-600 text-white font-black uppercase tracking-wider hover:bg-red-700 transition-colors shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                     Aplicar Ahora
                  </button>
               </div>

               {/* Elite */}
               <div className="bg-white p-10 shadow-lg border-t-8 border-zinc-300 hover:border-zinc-500 transition-all">
                  <h3 className="text-2xl font-black uppercase italic text-zinc-400 mb-2">Híbrido</h3>
                  <div className="text-4xl font-black text-zinc-900 mb-6">Consultar</div>
                  <p className="text-zinc-600 mb-8 text-sm font-medium">Lo mejor de los dos mundos: Online + Presencial.</p>
                  <ul className="space-y-4 mb-8">
                     <li className="flex gap-3 text-sm font-bold text-zinc-700"><Check size={18} className="text-red-600"/> Todo lo del Total Trans.</li>
                     <li className="flex gap-3 text-sm font-bold text-zinc-700"><Check size={18} className="text-red-600"/> 4 Sesiones Presenciales</li>
                     <li className="flex gap-3 text-sm font-bold text-zinc-700"><Check size={18} className="text-red-600"/> Acceso a Gym Privado</li>
                  </ul>
                  <button className="w-full py-4 border-2 border-zinc-900 text-zinc-900 font-black uppercase tracking-wider hover:bg-zinc-900 hover:text-white transition-colors">
                     Consultar Cupo
                  </button>
               </div>
            </div>
         </div>
      </section>

      {/* --- CONTACT FORM --- */}
      <section id="contact" className="py-24 bg-white">
         <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row bg-zinc-900 text-white overflow-hidden">
               <div className="md:w-1/2 p-12 md:p-16 flex flex-col justify-center relative">
                  <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
                  <div className="relative z-10">
                     <h2 className="text-4xl font-black uppercase italic mb-6">¿Estás Listo Para <span className="text-red-600">Comprometerte?</span></h2>
                     <p className="text-lg text-zinc-300 mb-8 font-medium">
                        Solo busco personas serias. Si estás dispuesto a invertir en ti y seguir el plan, te garantizo resultados.
                     </p>
                     <div className="flex gap-6">
                        <a href="#" className="text-zinc-400 hover:text-white transition-colors"><Instagram size={28}/></a>
                        <a href="#" className="text-zinc-400 hover:text-white transition-colors"><Twitter size={28}/></a>
                     </div>
                  </div>
               </div>

               <div className="md:w-1/2 p-12 md:p-16 bg-zinc-800">
                  <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                     <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-2">Nombre Completo</label>
                        <input type="text" className="w-full bg-zinc-900 border border-zinc-700 p-4 text-white font-bold focus:border-red-600 outline-none transition-colors" placeholder="TU NOMBRE" />
                     </div>
                     <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-2">Email</label>
                        <input type="email" className="w-full bg-zinc-900 border border-zinc-700 p-4 text-white font-bold focus:border-red-600 outline-none transition-colors" placeholder="TU@EMAIL.COM" />
                     </div>
                     <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-2">Meta Principal</label>
                        <select className="w-full bg-zinc-900 border border-zinc-700 p-4 text-white font-bold focus:border-red-600 outline-none transition-colors">
                           <option>Perder Grasa</option>
                           <option>Ganar Músculo</option>
                           <option>Rendimiento Deportivo</option>
                        </select>
                     </div>
                     <button className="w-full bg-white text-zinc-900 py-4 font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
                        Enviar Solicitud
                     </button>
                  </form>
               </div>
            </div>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-zinc-950 py-10 border-t border-zinc-900">
         <div className="container mx-auto px-6 text-center">
            <p className="text-zinc-600 font-bold text-xs uppercase tracking-widest mb-4">© {new Date().getFullYear()} Max Power Training Systems.</p>
            <p className="text-zinc-700 text-xs">Diseñado para ganadores.</p>
         </div>
      </footer>
    </div>
  );
};

export default LandingTrainerOne;
