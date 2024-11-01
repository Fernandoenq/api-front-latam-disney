import React, { useState, useEffect } from 'react';

const Planilha = () => {
  // Estado para armazenar os dados recebidos do endpoint
  const [dados, setDados] = useState([]);

  // Função para buscar dados do endpoint
  useEffect(() => {
    const fetchDados = async () => {
      try {
        const response = await fetch('http://3.133.92.17:3333/Scheduling/Dashboard');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        // Obter como texto para análise
        const textData = await response.text();
        console.log("Resposta bruta:", textData);  // Verificar o conteúdo completo
  
        // Remover valores `NaN` ou outros que não sejam válidos
        const cleanedData = textData.replace(/NaN/g, 'null');
        const data = JSON.parse(cleanedData);
  
        setDados(data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };
  
    fetchDados();
  }, []);
  

  // Função para exibir o status de agendamento com base no número
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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">TurnTime</th>
            <th className="py-3 px-6 text-left">Cadeira</th>
            <th className="py-3 px-6 text-left">Nome</th>
            <th className="py-3 px-6 text-left">CPF</th>
            <th className="py-3 px-6 text-center">Status</th>
            <th className="py-3 px-6 text-center">Data do Agendamento</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm font-light">
          {dados.map((item, index) => (
            <tr key={index} className="border-b border-gray-300 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{item.TurnTime}</td>
              <td className="py-3 px-6 text-left">{item.ChairName}</td>
              <td className="py-3 px-6 text-left">{item.PersonName}</td>
              <td className="py-3 px-6 text-left">{item.Cpf}</td>
              <td className="py-3 px-6 text-center">
                <span
                  className={`py-1 px-3 rounded-full text-xs ${
                    item.SchedulingStatus === 1
                      ? 'bg-green-200 text-green-600'   // Status 1: Verde
                      : item.SchedulingStatus === 2
                      ? 'bg-red-200 text-red-600'       // Status 2: Vermelho
                      : 'bg-gray-200 text-gray-600'     // Status 3: Cinza
                  }`}
                >
                  {getStatusLabel(item.SchedulingStatus)}
                </span>
              </td>
              <td className="py-3 px-6 text-center">{item.SchedulingDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Planilha;
