import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../config';

const Planilha = () => {
  const [dados, setDados] = useState([]);
  const [selectedOption, setSelectedOption] = useState(7); // Valor inicial
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Controle de visibilidade do menu
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const response = await fetch(`${BASE_URL}/Scheduling/Dashboard/${selectedOption}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const textData = await response.text();
        console.log("Resposta bruta:", textData);

        const cleanedData = textData.replace(/NaN/g, 'null');
        const data = JSON.parse(cleanedData);
  
        setDados(data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };
  
    fetchDados();
  }, [selectedOption]);

  const getStatusLabel = (status) => {
    switch (status) {
      case 1:
        return 'Disponível';
      case 2:
        return 'Agendado';
      case 3:
        return 'Confirmado';
      default:
        return 'Desconhecido';
    }
  };

  const formatCPF = (cpf) => {
    if (!cpf) return '-';
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  };

  const formatData = (SchedulingDate) => {
    if (!SchedulingDate) return '-';
    return SchedulingDate.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  };

  return (
    <div
      className="flex flex-col min-h-screen items-center justify-center"
      style={{
        backgroundImage: `url('/fundomenu.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        paddingTop: "60px",
        paddingBottom: "100px",
        position: "relative"
      }}
    >
      {/* Botão de seleção de data */}
      <div className="mb-8">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none font-latam"
          onClick={() => setIsMenuOpen(!isMenuOpen)} // Alterna a visibilidade do menu
        >
          Selecione a data
        </button>

        {isMenuOpen && ( // Mostra o menu apenas se isMenuOpen for true
          <div className="relative">
            <div className="absolute z-10 bg-white shadow-md rounded mt-2 font-latam">
            
              <button
                onClick={() => { setSelectedOption(7); setIsMenuOpen(false); }}
                className={`w-full px-4 py-2 hover:bg-gray-200 ${selectedOption === 7 ? "bg-blue-100" : ""}`}
              >
                07/11/2024
              </button>
              <button
                onClick={() => { setSelectedOption(9); setIsMenuOpen(false); }}
                className={`w-full px-4 py-2 hover:bg-gray-200 ${selectedOption === 9 ? "bg-blue-100" : ""}`}
              >
                09/11/2024
              </button>
              <button
                onClick={() => { setSelectedOption(10); setIsMenuOpen(false); }}
                className={`w-full px-4 py-2 hover:bg-gray-200 ${selectedOption === 10 ? "bg-blue-100" : ""}`}
              >
                10/11/2024
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Botão de retorno */}
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2"
        style={{ zIndex: 50 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div
        className="overflow-x-auto rounded-lg shadow-md my-8 mx-auto"
        style={{ maxWidth: '90%', backgroundColor: '#ebf8ff' }}
      >
        <table className="w-full border border-gray-300">
          <thead style={{ backgroundColor: '#1e3a8a' }}>
            <tr className="text-white uppercase text-sm leading-normal font-latam">
              <th className="py-3 px-6 text-left">Horário</th>
              <th className="py-3 px-6 text-left">Poltrona</th>
              <th className="py-3 px-6 text-left">Nome</th>
              <th className="py-3 px-6 text-left">CPF</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-center">Data do Agendamento</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm font-light">
            {dados.map((item, index) => (
              <tr key={index} className="border-b border-gray-300 hover:bg-blue-200">
                <td className="py-3 px-6 text-left whitespace-nowrap">{item.TurnTime}</td>
                <td className="py-3 px-6 text-left">{item.ChairName}</td>
                <td className="py-3 px-6 text-left">{item.PersonName}</td>
                <td className="py-3 px-6 text-left">{formatCPF(item.Cpf)}</td>
                <td className="py-3 px-6 text-center">
                  <span
                    className={`py-1 px-3 rounded-full text-xs ${
                      item.SchedulingStatus === 1
                        ? 'bg-green-200 text-green-600'
                        : item.SchedulingStatus === 2
                        ? 'bg-red-200 text-red-600'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {getStatusLabel(item.SchedulingStatus)}
                  </span>
                </td>
                <td className="py-3 px-6 text-center">{formatData(item.SchedulingDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Planilha;
