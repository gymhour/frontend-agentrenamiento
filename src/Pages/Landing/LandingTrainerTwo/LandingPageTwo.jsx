import React, { useState, useEffect } from "react";
import {
  Menu, X, ArrowRight, CheckCircle2, Play, Dumbbell, 
  Target, Zap, Quote, Instagram, Youtube, Twitter, ChevronDown
} from "lucide-react";

const LandingTrainerTwo = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);

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

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const faqs = [
    { q: "¿Necesito equipo de gimnasio?", a: "No necesariamente. Tengo planes adaptados a casa (peso corporal/mancuernas) o gimnasio completo. Tú decides dónde entrenar." },
    { q: "¿Es para principiantes?", a: "Sí. La intensidad es relativa. Mi trabajo es ajustar el volumen y la carga a TU nivel actual para progresar sin lesiones." },
    { q: "¿Incluye dieta?", a: "Incluye una guía de macronutrientes y ejemplos de comidas. No es una dieta clínica, es educación nutricional para el rendimiento." },
    { q: "¿Cómo es el seguimiento?", a: "Hacemos check-ins semanales vía email/app donde revisamos fotos, medidas y cargas. Ajusto el plan cada semana según tu progreso." },
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-red-600 selection:text-white">
      
      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-black/90 border-zinc-800 py-4 backdrop-blur-md' : 'bg-transparent border-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 bg-red-600 flex items-center justify-center transform -skew-x-12">
              <span className="text-white font-black text-xl skew-x-12">X</span>
            </div>
            <div className="leading-none">
              <span className="block text-white font-black uppercase italic text-lg tracking-tighter">COACH</span>
              <span className="block text-red-600 font-bold uppercase text-xs tracking-widest">ALEX</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            {['Método', 'Planes', 'Bio', 'FAQs'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item.toLowerCase() === 'método' ? 'method' : item.toLowerCase() === 'planes' ? 'pricing' : item.toLowerCase() === 'bio' ? 'about' : 'faq')}
                className="text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
              </button>
            ))}
            <button 
              onClick={() => scrollToSection('pricing')}
              className="bg-white text-black px-6 py-2 font-black uppercase italic tracking-wider hover:bg-red-600 hover:text-white transition-all transform hover:-translate-y-1"
            >
              Asesoría Online
            </button>
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-zinc-900 border-b border-zinc-800 flex flex-col">
             {['Método', 'Planes', 'Bio', 'FAQs'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item.toLowerCase() === 'método' ? 'method' : item.toLowerCase() === 'planes' ? 'pricing' : item.toLowerCase() === 'bio' ? 'about' : 'faq')}
                className="text-left px-8 py-6 text-xl font-black uppercase italic text-zinc-300 border-b border-zinc-800 hover:bg-zinc-800 hover:text-red-600 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* --- HERO SECTION (Cinematic) --- */}
      <header className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1517963879466-cd11b83271bc?q=80&w=1600&auto=format&fit=crop" 
            alt="Gym Atmosphere" 
            className="w-full h-full object-cover opacity-50 grayscale" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60"></div>
          {/* Grid Overlay */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto mt-10">
           <div className="mb-6 animate-fade-in-up">
             <span className="inline-block border border-red-600 text-red-500 px-4 py-1 font-bold uppercase text-xs tracking-[0.3em] bg-black/50 backdrop-blur-sm">
               Online Coaching & Programming
             </span>
           </div>
           
           <h1 className="text-5xl md:text-8xl font-black uppercase italic leading-[0.9] mb-8 tracking-tight">
             Construye Un <br/>
             Físico <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">Dominante</span>
           </h1>
           
           <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
             Deja de adivinar en el gimnasio. Ciencia aplicada, intensidad bruta y un plan diseñado específicamente para tu fisiología.
           </p>

           <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
             <button onClick={() => scrollToSection('pricing')} className="w-full sm:w-auto bg-red-600 text-white px-10 py-4 font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all clip-path-slant">
               Ver Planes
             </button>
             <button onClick={() => scrollToSection('method')} className="w-full sm:w-auto flex items-center justify-center gap-3 text-white font-bold uppercase tracking-wider hover:text-red-500 transition-colors">
               <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center">
                 <Play size={16} fill="currentColor" className="ml-1" />
               </div>
               Cómo Funciona
             </button>
           </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-zinc-500">
          <ChevronDown size={32} />
        </div>
      </header>

      {/* --- TICKER (High Energy) --- */}
      <div className="bg-red-600 text-black overflow-hidden py-3 select-none relative z-20 transform -rotate-1 scale-105">
        <div className="animate-marquee whitespace-nowrap flex gap-8">
           {[1,2,3,4,5].map(i => (
             <span key={i} className="text-3xl font-black uppercase italic flex items-center gap-6">
               Train Hard <Zap fill="black" size={24} /> Eat Smart <Zap fill="black" size={24} /> Recover Fast <Zap fill="black" size={24} />
             </span>
           ))}
        </div>
      </div>

      {/* --- ABOUT (The Coach) --- */}
      <section id="about" className="py-24 bg-black relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Image Side */}
            <div className="lg:w-1/2 relative">
               <div className="relative z-10 border-2 border-zinc-800 p-2 bg-zinc-900">
                  <img 
                    src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop" 
                    alt="Coach Alex" 
                    className="w-full h-auto filter grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
                  />
                  {/* Floating Badge */}
                  <div className="absolute -bottom-6 -right-6 bg-red-600 text-white p-6 shadow-lg hidden md:block">
                    <p className="font-black text-4xl italic leading-none">10+</p>
                    <p className="text-xs font-bold uppercase tracking-wider">Años Exp.</p>
                  </div>
               </div>
               {/* Decor */}
               <div className="absolute top-10 -left-10 w-full h-full border-2 border-red-600/30 -z-0 hidden md:block"></div>
            </div>

            {/* Text Side */}
            <div className="lg:w-1/2">
               <h2 className="text-red-600 font-bold uppercase tracking-widest mb-4">El Entrenador</h2>
               <h3 className="text-4xl md:text-6xl font-black uppercase italic mb-8 leading-none text-white">
                 Obsesionado con <br/> Tu <span className="text-zinc-500 line-through">Potencial</span> Progreso
               </h3>
               <p className="text-zinc-400 text-lg mb-6 leading-relaxed">
                 Soy Alex. No soy un influencer fitness. Soy un entrenador certificado que odia las pérdidas de tiempo. 
               </p>
               <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                 He visto a demasiada gente fallar por seguir rutinas genéricas de internet. Mi método se basa en biomecánica, periodización y consistencia agresiva. Si haces lo que te digo, cambiarás. Punto.
               </p>
               
               <div className="grid grid-cols-2 gap-6">
                 <div>
                   <h4 className="text-white font-black text-2xl">500+</h4>
                   <p className="text-zinc-500 text-sm font-bold uppercase">Atletas Transformados</p>
                 </div>
                 <div>
                   <h4 className="text-white font-black text-2xl">100%</h4>
                   <p className="text-zinc-500 text-sm font-bold uppercase">Basado en Ciencia</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- METHODOLOGY --- */}
      <section id="method" className="py-24 bg-zinc-900 border-y border-zinc-800">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-black uppercase italic text-white mb-4">El Sistema <span className="text-red-600">Trifecta</span></h2>
            <p className="text-zinc-400">Tres pilares innegociables que separan a los que sueñan de los que logran.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Dumbbell, title: "Estímulo", desc: "Entrenamiento de fuerza programado para la sobrecarga progresiva. Cada repetición tiene un propósito." },
              { icon: Target, title: "Nutrición", desc: "Combustible, no solo comida. Estrategias de macros flexibles que te permiten comer lo que te gusta sin sabotearte." },
              { icon: Zap, title: "Mentalidad", desc: "Construimos resiliencia. Aprenderás a disfrutar la incomodidad y a mantener la disciplina cuando la motivación falle." },
            ].map((item, idx) => (
              <div key={idx} className="bg-black p-8 border border-zinc-800 hover:border-red-600 transition-colors group">
                <div className="w-14 h-14 bg-zinc-900 rounded-full flex items-center justify-center mb-6 group-hover:bg-red-600 group-hover:text-white transition-all text-red-600">
                  <item.icon size={28} />
                </div>
                <h3 className="text-2xl font-black uppercase italic text-white mb-4">{item.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRICING (Cards) --- */}
      <section id="pricing" className="py-24 bg-black relative">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-zinc-900 to-black"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
             <h2 className="text-4xl md:text-6xl font-black uppercase italic text-white">
               Elige Tu <span className="text-red-600">Nivel</span>
             </h2>
             <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest mt-4 md:mt-0">
               Planes Mensuales • Cancela Cuando Quieras
             </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
             {/* Card 1 */}
             <div className="bg-zinc-900 p-8 border border-zinc-800 flex flex-col hover:border-zinc-600 transition-colors">
                <h3 className="text-zinc-400 font-bold uppercase tracking-widest mb-2">Autónomo</h3>
                <div className="text-5xl font-black text-white mb-6">$49</div>
                <p className="text-zinc-500 text-sm mb-8 border-b border-zinc-800 pb-8">
                  Acceso a mi app con el programa de entrenamiento mensual. Ideal si ya sabes entrenar y solo necesitas la estructura.
                </p>
                <ul className="space-y-4 mb-8 flex-1">
                  {['Rutina Mensual', 'Video Tutoriales', 'Registro de Cargas', 'Soporte Básico (Email)'].map((feat, i) => (
                    <li key={i} className="flex gap-3 text-sm text-zinc-300 font-medium">
                      <CheckCircle2 size={18} className="text-zinc-600" /> {feat}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-4 border border-white text-white font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                  Comenzar
                </button>
             </div>

             {/* Card 2 (Highlighted) */}
             <div className="bg-red-600 p-8 border border-red-500 flex flex-col transform md:-translate-y-6 shadow-2xl shadow-red-900/50 relative">
                <div className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold uppercase px-3 py-1">Best Value</div>
                <h3 className="text-black/70 font-bold uppercase tracking-widest mb-2">1-on-1 Coaching</h3>
                <div className="text-5xl font-black text-white mb-6">$129</div>
                <p className="text-white/80 text-sm mb-8 border-b border-red-500 pb-8">
                  La experiencia completa. Diseño cada aspecto de tu rutina y nutrición. Soy tu sombra (virtual).
                </p>
                <ul className="space-y-4 mb-8 flex-1">
                  {['Todo lo de Autónomo', 'Plan Nutricional Personalizado', 'Check-ins Semanales (Video)', 'Ajustes Ilimitados', 'WhatsApp Directo'].map((feat, i) => (
                    <li key={i} className="flex gap-3 text-sm text-white font-bold">
                      <CheckCircle2 size={18} className="text-black" /> {feat}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors shadow-lg">
                  Aplicar Ahora
                </button>
             </div>

             {/* Card 3 */}
             <div className="bg-zinc-900 p-8 border border-zinc-800 flex flex-col hover:border-zinc-600 transition-colors">
                <h3 className="text-zinc-400 font-bold uppercase tracking-widest mb-2">Elite Competición</h3>
                <div className="text-5xl font-black text-white mb-6">$249</div>
                <p className="text-zinc-500 text-sm mb-8 border-b border-zinc-800 pb-8">
                  Preparación específica para sesiones de fotos, bodas o competiciones. Precisión quirúrgica.
                </p>
                <ul className="space-y-4 mb-8 flex-1">
                  {['Todo lo de 1-on-1', 'Estrategia de Puesta a Punto', 'Suplementación Avanzada', 'Análisis de Posing', 'Llamadas Quincenales'].map((feat, i) => (
                    <li key={i} className="flex gap-3 text-sm text-zinc-300 font-medium">
                      <CheckCircle2 size={18} className="text-zinc-600" /> {feat}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-4 border border-white text-white font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                  Consultar
                </button>
             </div>
          </div>
        </div>
      </section>

      {/* --- FAQ (Accordion) --- */}
      <section id="faq" className="py-24 bg-zinc-950">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl font-black uppercase italic text-center mb-12 text-white">Preguntas <span className="text-red-600">Frecuentes</span></h2>
          
          <div className="space-y-4">
            {faqs.map((item, idx) => (
              <div key={idx} className="border border-zinc-800 bg-black">
                <button 
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex justify-between items-center p-6 text-left hover:bg-zinc-900 transition-colors"
                >
                  <span className="text-lg font-bold uppercase text-zinc-200">{item.q}</span>
                  <span className={`transform transition-transform duration-300 ${activeAccordion === idx ? 'rotate-180 text-red-600' : 'text-zinc-500'}`}>
                    <ChevronDown />
                  </span>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ${activeAccordion === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="p-6 pt-0 text-zinc-400 leading-relaxed border-t border-zinc-800/50">
                    {item.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-black py-12 border-t border-zinc-900">
         <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <div className="text-2xl font-black uppercase italic text-white mb-2">Coach Alex</div>
              <p className="text-zinc-500 text-sm">Transformando vidas a través de la disciplina.</p>
            </div>

            <div className="flex gap-6">
              <a href="#" className="w-10 h-10 bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-red-600 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-red-600 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-red-600 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
            </div>
         </div>
         <div className="text-center mt-12 text-zinc-800 text-xs font-bold uppercase tracking-widest">
           © {new Date().getFullYear()} Coach Alex Systems. All Rights Reserved.
         </div>
      </footer>

    </div>
  );
};

export default LandingTrainerTwo;