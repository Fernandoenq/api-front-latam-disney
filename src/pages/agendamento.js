import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../config';
import '../index.css';

const Agendamento = () => {
  const [cpf, setCpf] = useState('');
  const [schedulingData, setSchedulingData] = useState([]);
 
  const navigate = useNavigate();

  const removerMascaraCpf = (cpf) => {
    return cpf.replace(/[^\d]+/g, ''); // Remove tudo que não é dígito
  };

  useEffect(() => {
    const storedCpf = localStorage.getItem('cpf');
    if (storedCpf) {
      const cpfLimpo = removerMascaraCpf(storedCpf); // Remove a máscara
      setCpf(cpfLimpo);
      fetchSchedulingData(cpfLimpo);
      fetchPersonId(cpfLimpo);
    } else {
      navigate('/dashboard');
    }
  }, [navigate]);

  const fetchSchedulingData = async (cpf) => {
    try {
      const response = await fetch(`${BASE_URL}/Scheduling/SchedulingsByCpf/${cpf}`);
      const data = await response.json();
      console.log('Dados de agendamento:', data); 
      setSchedulingData(data);
    } catch (error) {
      console.error('Erro ao buscar dados de agendamento:', error);
    }
  };

  const fetchPersonId = async (cpf) => {
    try {
      const response = await fetch(`${BASE_URL}/Person/PersonByCpf/${cpf}`);
      const data = await response.json();
      localStorage.setItem('personId', data.PersonId);
    } catch (error) {
      console.error('Erro ao buscar PersonId:', error);
    }
  };

  const filteredSchedulingData = schedulingData.filter(item => item.SchedulingStatus === 2 || item.SchedulingStatus === 3);

  const handleNovoClick = () => {
    const cpfLimpo = removerMascaraCpf(cpf);
    localStorage.setItem('cpf', cpfLimpo);
    navigate('/agendar');
  };

  const handleReagendarClick = (schedulingId) => {
    localStorage.setItem('schedulingId', schedulingId); // Armazena o ID do agendamento
    console.log(schedulingId)
    
    navigate('/reagendamento'); // Navega para a tela de confirmação de reagendamento
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm md:max-w-md lg:max-w-lg largura">
        <img src="logoLATAM.png" alt="Logo" className="w-24 h-auto mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-center mb-4">Agendamento de Cadeiras - CPF: {cpf}</h2>

        {/* Tabela de agendamentos */}
        <table className="table-auto w-full bg-white shadow-md rounded-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Seus horários agendados</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchedulingData.length > 0 ? (
              filteredSchedulingData.map((item) => (
                <tr key={item.SchedulingId} className="border-b">
                  <td className="px-4 py-2 text-center">
                    {new Date(item.TurnTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="bg-yellow-500 text-white py-1 px-2 rounded-md hover:bg-yellow-600 transition-colors"
                      onClick={() => handleReagendarClick(item.SchedulingId)} // Passa o horário para reagendar
                    >
                      Reagendar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center px-4 py-2 text-gray-500">Nenhuma cadeira disponível.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-4 flex justify-between">
          <button
            className="bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
            onClick={() => navigate('/dashboard')}
          >
            Voltar
          </button>
          <div className="flex space-x-2">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
              onClick={() => handleNovoClick()}
            >
              Novo Agendamento
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agendamento;
