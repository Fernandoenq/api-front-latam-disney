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
    <div className="flex flex-col min-h-screen items-center justify-center celular-agendar"
      style={{ backgroundImage: `url('/fundomenu.png')`, backgroundSize: 'cover' }}>

    <div
          className="img tabletModelo-destino"
          style={{
            height: '28vh',
            width: '90vw',
            backgroundImage: 'url(destinos.png)',
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            marginTop:'10px'
            // border:'solid yellow 1px'
          }}
        ></div>

<div
 className="p-6 rounded-lg shadow-md w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-3/5 largura horarios-agendar" 
 style={{ 
   backgroundColor: 'rgba(65, 105, 225, 0.2)',
   boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.8)',
   border: '0.4px solid black',
 }}
>
  <p className="px-4 py-2 text-center text-white text-lg ">Agendamento de Cadeiras - CPF: {cpf}</p>


  <div style={{ maxHeight: '220px', overflowY: 'auto' }} className="horarios">
    <table className="table-auto w-full shadow-md text-white rounded-md text-sm md:text-lg" style={{ overflowX: 'auto' }}>
      <thead>
        <tr >
          <th className="px-4 py-2 aumentando-horarios">Seus horários</th>
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
              <td className="px-2 py-1 text-center  md:text-6xl horarios-cadeiras font-latam">
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



<div className="mt-4 flex flex-wrap justify-between w-full btn-large-buttons celular-agendar"  style={{
           width:'400px',
            // border:'solid yellow 1px'
          }}>
  <button
    className="text-white font-bold voltar py-2 px-4 rounded-[20px]  transition-colors w-full sm:w-auto sm:mr-2 mb-2 btn-large font-latam" // Adiciona classe customizada
    style={{
      boxShadow: '0px 10px 10px -5px rgba(0, 0, 0, 0.8)',
      borderBottom: '3px solid black',
    }}
    onClick={() => navigate('/dashboard')}
  >
    Voltar
  </button>

  <button
    className=" font-bold agendar text-white py-2 px-4  rounded-[20px] transition-colors w-full sm:w-auto sm:mr-2 mb-2 btn-large font-latam" // Adiciona classe customizada
    style={{
      boxShadow: '0px 10px 10px -5px rgba(0, 0, 0, 0.8)',
      borderBottom: '3px solid black',
    }}
    onClick={handleReagendarClick}
    disabled={!selectedSchedulingId}
  >
    Reagendar
  </button>

  <button
    className=" cadastrar font-bold text-white py-2 px-4 rounded-[20px]  transition-colors w-full sm:w-auto btn-large-novo font-latam" // Adiciona classe customizada
    style={{
      boxShadow: '0px 10px 10px -5px rgba(0, 0, 0, 0.8)',
      borderBottom: '3px solid black',
    }}
    onClick={handleNovoClick}
  >
    Novo Agendamento
  </button>
</div>




       {/* Imagem colocada abaixo dos inputs e botões */}
  <div className="flex justify-center items-center"> {/* Container flex para centralizar */}
            <div
              className=" tabletModelo-assinatura "
              style={{
                height: '20vh',
                width: '20vw',
                backgroundImage: 'url(assinatura.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                marginTop:'10px'
              }}
            />
          </div>


    </div>
  );
};

export default Agendamento;
