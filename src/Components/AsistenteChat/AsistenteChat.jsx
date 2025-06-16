import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './AsistenteChat.css';
import { ReactComponent as CloseIcon } from '../../assets/icons/close.svg';

const AsistenteChat = () => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const endRef = useRef(null);

  // Cuando abrimos el chat, opcionalmente inyectamos un saludo inicial
  useEffect(() => {
    if (open) {
      setMessages([{
        sender: 'bot',
        text: '¡Hola! Soy tu asistente de gimnasio. ¿En qué puedo ayudarte hoy?'
      }]);
    } else {
      setMessages([]);
    }
  }, [open]);

  // Scroll automático al final
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => setOpen(o => !o);

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text) return;
    // agrego mensaje del usuario
    setMessages(ms => [...ms, { sender: 'user', text }]);
    setInputValue('');
    try {
      const { data } = await axios.post(
        'http://localhost:5003/asistente/prompt',
        { question: text }
      );
      setMessages(ms => [...ms, { sender: 'bot', text: data.response }]);
    } catch (err) {
      setMessages(ms => [...ms, {
        sender: 'bot',
        text: 'Ups, hubo un error de conexión. Por favor, intentá de nuevo.'
      }]);
      console.error(err);
    }
  };

  return (
    <>
      {open ? (
        <div className="assistant-chat-window">
          <div className="assistant-header">
            {/* <img src={RobotIcon} alt="Asistente" className="assistant-avatar" /> */}
            <button className="assistant-close" onClick={toggleChat}>
              {/* <img src={CloseIcon} alt="Cerrar" /> */}
              <CloseIcon/>
            </button>
          </div>
          <div className="assistant-messages">
            {messages.map((m, i) => (
              <div key={i} className={`message ${m.sender}`}>
                {m.text}
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="assistant-input">
            <input
              type="text"
              placeholder="Escribí tu mensaje..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="send-button">➤</button>
          </div>
        </div>
      ) : (
        <div className="assistant-bubble" onClick={toggleChat}>
          {/* <img src={RobotIcon} alt="Asistente" className="assistant-icon" /> */}
          <span className="assistant-text">
            Realizar consultas del gimnasio, entrenamiento y nutrición
          </span>
        </div>
      )}
    </>
  );
};

export default AsistenteChat;
