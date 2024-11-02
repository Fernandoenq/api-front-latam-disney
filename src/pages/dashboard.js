import React, { useState } from "react";
import "../index.css"; // Certifique-se de que o Tailwind CSS está sendo importado corretamente
import { useNavigate } from 'react-router-dom';
import { FaChevronDown } from "react-icons/fa";
const Dashboard = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!userId) {
    navigate('/');
  }

  const logout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };
  
  const planilha = () => {
    navigate('/planilha');
  };

  const handleCadastroClick = () => {
    navigate('/cadastro');
  };

  const handleConfirmCPFClick = () => {
    navigate('/confirmacpf');
  };

  const handleConfirmarClick = () => {
    navigate('/confirmacao');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div 
      className="flex flex-col min-h-screen items-center justify-center" 
      style={{ backgroundImage: `url('/fundomenu.png')`, backgroundSize: 'cover' }}
    >
      {/* Botão do menu suspenso no canto superior direito */}
      <div className="absolute top-4 right-4">
          <button 
            onClick={toggleMenu} 
            className="text-white p-2 rounded-full focus:outline-none"
          >
            <FaChevronDown size={20} />
          </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg z-10">
            <button 
              onClick={logout} 
              className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-200 rounded-t-lg"
            >
              Sair
            </button>
            <button 
              onClick={planilha} 
              className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-200 rounded-b-lg"
            >
              Planilha
            </button>
          </div>
        )}
      </div>

      <div
        className="img"
        style={{
          height: '38vh',
          width: '90vw',
          backgroundImage: 'url(destinos.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Container das divs */}
      <div className="card flex flex-col sm:flex-row justify-center gap-5 items-center mt-5 sm:mt-10"
        style={{ minHeight: '300px', width: '100%', padding: '0 10px' }}
      >
        {/* Card de Cadastro */}
        <div 
          onClick={handleCadastroClick}
          className="p-6 rounded-lg shadow-md w-full sm:max-w-xs flex flex-col items-center justify-center card-dashboard"
          style={{ backgroundColor: '#1861af', height: '250px', maxWidth: '300px' }}
        >
          <img src="cadastro.png" alt="Ícone de Cadastro" className="w-50 h-50 sm:w-50 sm:h-50" />
          <h2 className="text-base sm:text-lg text-white font-semibold text-center mb-10">CADASTRO</h2>
        </div> 

        {/* Card de Agendamento */}
        <div 
          onClick={handleConfirmCPFClick}
          className="p-6 rounded-lg shadow-md w-full sm:max-w-xs flex flex-col items-center justify-center card-dashboard"
          style={{ backgroundColor: '#1861af', height: '250px', maxWidth: '300px' }}
        >
          <img src="agendamento.png" alt="Ícone de Agendamento" className="w-50 h-50 sm:w-50 sm:h-50" />
          <h2 className="text-base sm:text-lg text-white font-semibold text-center mb-10">AGENDAMENTO</h2>
        </div>

        {/* Card de Confirmar Presença */}
        <div 
          onClick={handleConfirmarClick}
          className="p-6 rounded-lg shadow-md w-full sm:max-w-xs flex flex-col items-center justify-center card-dashboard"
          style={{ backgroundColor: '#1861af', height: '250px', maxWidth: '300px' }}
        >
          <img src="presenca.png" alt="Ícone de Confirmar Presença" className="w-50 h-50 sm:w-50 sm:h-50" />
          <h2 className="text-base sm:text-lg text-white font-semibold text-center mb-10">CONFIRMAR PRESENÇA</h2>
        </div>
      </div>

      {/* Imagem colocada abaixo dos inputs e botões */}
      <div 
        className="flex justify-center assinatura-dashboard "
        style={{
          height: '20vh',
          width: '20vw',
          backgroundImage: 'url(assinatura.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          
        }}
      />

      
    </div>
  );
};

export default Dashboard;
