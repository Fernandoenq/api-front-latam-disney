import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../config';

const Planilha = () => {
  const [dados, setDados] = useState([]);
  const [filteredDados, setFilteredDados] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDados = async (dayOnly) => {
      try {
        const response = await fetch(`${BASE_URL}/Scheduling/Dashboard/${dayOnly}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const textData = await response.text();
       

        const cleanedData = textData.replace(/NaN/g, 'null');
        const data = JSON.parse(cleanedData);
  
        setDados(data);
        setFilteredDados(data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };
  
    fetchDados();
  }, []);

  const handleDateChange = (e) => {
    const selected = e.target.value;
    const selectedDay = selected.split('-')[2]; // Extrai apenas o dia da data
  
    // Armazena o dia da data em uma variável chamada `dayOnly`
    const dayOnly = selectedDay;
    
    setSelectedDate(selected);
  
    // Filtra os dados com base no dia do agendamento, se SchedulingDate não for nulo ou undefined
    const filtered = dados.filter((item) => {
      if (item.SchedulingDate) {
        const itemDay = item.SchedulingDate.split('-')[2]; // Extrai o dia da data do item
        return itemDay === dayOnly;
      }
      return false; // Exclui itens sem uma data válida
    });
  
    setFilteredDados(filtered);
  
    console.log("Dia selecionado:", dayOnly); // Exibe o dia selecionado no console
  };
  
  
  

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

  return (
    <div
      className="flex flex-col min-h-screen items-center justify-center" 
      style={{
        backgroundImage: `url('/fundomenu.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        paddingTop: "60px",
        paddingBottom: "100px",
        position: "relative",
        // border:' red 1px solid'
      }}
    >
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2"
        style={{ zIndex: 50 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Campo de input para selecionar a data */}
      <div className="mb-4 w-full flex justify-center">
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="p-2 border border-gray-300 rounded-lg shadow-sm text-gray-700"
        />
      </div>

      <div
        className="overflow-x-auto rounded-lg shadow-md my-8 mx-auto max-w-7xl"
        style={{ width: '90%', backgroundColor: '#ebf8ff', 
          // border:' red 1px solid' 
        }}
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
            {filteredDados.map((item, index) => (
              <tr key={index} className="border-b border-gray-300 hover:bg-blue-200">
                <td className="py-3 px-6 text-left whitespace-nowrap">{item.TurnTime}</td>
                <td className="py-3 px-6 text-left">{item.ChairName}</td>
                <td className="py-3 px-6 text-left">{item.PersonName || '-'}</td>
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
                <td className="py-3 px-6 text-center">{item.SchedulingDate || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Planilha;
