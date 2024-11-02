import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../config';
import '../index.css';

const Agendamento = () => {
  const [cpf, setCpf] = useState('');
  const [schedulingData, setSchedulingData] = useState([]);
  const [selectedSchedulingId, setSelectedSchedulingId] = useState(null); // Estado para armazenar o horário selecionado
  const navigate = useNavigate();

  const removerMascaraCpf = (cpf) => cpf.replace(/[^\d]+/g, '');

  useEffect(() => {
    const storedCpf = localStorage.getItem('cpf');
    if (storedCpf) {
      const cpfLimpo = removerMascaraCpf(storedCpf);
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

  const handleReagendarClick = () => {
    if (selectedSchedulingId) {
      localStorage.setItem('schedulingId', selectedSchedulingId);
      navigate('/reagendamento');
    }
  };

  const handleSelectScheduling = (schedulingId) => {
    setSelectedSchedulingId(schedulingId);
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center"
      style={{ backgroundImage: `url('/fundomenu.png')`, backgroundSize: 'cover' }}>

      <div className="img"
        style={{
          height: '38vh',
          width: '90vw',
          backgroundImage: 'url(destinos.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

<div
  className="p-6 rounded-lg shadow-md w-full max-w-sm md:max-w-md lg:max-w-lg largura"
  style={{ backgroundColor: '#1861af' }}
>
  <p className="px-4 py-2 text-center text-white text-lg font-semibold">Agendamento de Cadeiras - CPF: {cpf}</p>

  <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
    <table className="table-auto w-full shadow-md text-white rounded-md" style={{ backgroundColor: '#1861af' }}>
      <thead>
        <tr className="bg-gray-200" style={{ backgroundColor: '#1861af' }}>
          <th className="px-4 py-2">Seus horários</th>
        </tr>
      </thead>
      <tbody>
        {filteredSchedulingData.length > 0 ? (
          filteredSchedulingData.map((item) => (
            <tr
              key={item.SchedulingId}
              className={`border-b border-dotted ${selectedSchedulingId === item.SchedulingId ? 'bg-blue-900' : ''}`}
              onClick={() => handleSelectScheduling(item.SchedulingId)}
              style={{ cursor: 'pointer' }}
            >
              <td className="px-4 py-2 text-center text-5xl font-bold text-white">
                {new Date(item.TurnTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
  </div>
</div>



      <div className="mt-4  flex justify-between w-full max-w-md">
        <button
          className="text-white voltar  py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
          onClick={() => navigate('/dashboard')}
        >
          Voltar
        </button>

        <button
          className="bg-blue-500 agendar text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          onClick={handleReagendarClick}
          disabled={!selectedSchedulingId} // Desativa o botão se nenhum horário estiver selecionado
        >
          Reagendar
        </button>

        <button
          className="bg-blue-500 cadastrar text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          onClick={handleNovoClick}
        >
          Novo Agendamento
        </button>
      </div>

      <div
        className="flex justify-center assinatura-dashboard"
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

export default Agendamento;
