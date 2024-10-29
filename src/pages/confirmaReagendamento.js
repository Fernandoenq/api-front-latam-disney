import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../config';
import '../index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChair } from '@fortawesome/free-solid-svg-icons';

const Reagendamento = () => {
  const [schedulingData, setSchedulingData] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedChair, setSelectedChair] = useState(null);
  const [selectedSchedulingId, setSelectedSchedulingId] = useState(null);
  const [selectedTurnTime, setSelectedTurnTime] = useState(''); // Estado para armazenar o horário
  const [cpf, setCpf] = useState('');
  const [personId, setPersonId] = useState('');
  const [userId, setUserId] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [oldSchedulingId, setOldSchedulingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedCpf = localStorage.getItem('cpf');
    
    const storedIDbyCPF = localStorage.getItem('personId');
  
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      navigate('/login');
      return; // Saia do useEffect para evitar chamadas adicionais
    }
  
    if (storedCpf) {
      setCpf(storedCpf);
      fetchSchedulingData(storedCpf);
      fetchOldSchedulingId(storedCpf); // Passe o CPF armazenado diretamente
     
    } else {
      navigate('/dashboard');
      return;
    }
  
    if (storedIDbyCPF) {
      setPersonId(storedIDbyCPF);
    }
  }, [navigate]);
  

  const fetchOldSchedulingId = async (cpf) => {
    
    
    // Remove pontos, hífens e outros caracteres não numéricos do CPF
    const cpfFormatted = cpf.replace(/\D/g, ''); 
    console.log("Fetching old scheduling ID for CPF:", cpfFormatted);
    console.log("Fetching old scheduling ID for CPF:", cpf); // Verifica se a função está sendo chamada
    try {
        const response = await fetch(`${BASE_URL}/Scheduling/SchedulingsByCpf/${cpfFormatted}`);
        console.log("Response status:", response.status); // Verifica o status da resposta
        const data = await response.json();
        console.log("Dados recebidos da API:", data); // Para verificar a resposta da API

        if (data && data.length > 0 && data[0].SchedulingId !== undefined) {
            setOldSchedulingId(data[0].SchedulingId);
            localStorage.setItem('oldSchedulingId', data[0].SchedulingId);
        } else {
            console.log("Nenhum agendamento encontrado para o CPF fornecido.");
            setOldSchedulingId(null);
        }
    } catch (error) {
        console.error("Erro ao buscar o agendamento antigo:", error);
    }
};


  
  
  

  const fetchSchedulingData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/Scheduling/NotViewedSchedules`);
      const data = await response.json();

      const groupedData = data.reduce((acc, curr) => {
        const found = acc.find(item => item.TurnTime === curr.TurnTime);
        if (found) {
          found[`chair${curr.SchedulingId % 2 === 0 ? 2 : 1}`] = curr.SchedulingStatus;
          found[`schedulingId${curr.SchedulingId % 2 === 0 ? 2 : 1}`] = curr.SchedulingId;
        } else {
          acc.push({
            TurnTime: curr.TurnTime,
            [`chair${curr.SchedulingId % 2 === 0 ? 2 : 1}`]: curr.SchedulingStatus,
            [`schedulingId${curr.SchedulingId % 2 === 0 ? 2 : 1}`]: curr.SchedulingId,
          });
        }
        return acc;
      }, []);

      setSchedulingData(groupedData);
    } catch (error) {
      console.error('Erro ao buscar dados de agendamento:', error);
    }
  };

  const handleOpenModal = (schedulingId, chairNumber, chairStatus, turnTime) => {
    if (chairStatus === 2) {
      return;
    }
    setSelectedSchedulingId(schedulingId);
    setSelectedChair(chairNumber);
    setSelectedTurnTime(turnTime); // Armazena o horário selecionado
    fetchOldSchedulingId(cpf); // Garante que o OldSchedulingId será obtido
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedSchedulingId(null);
    setSelectedChair(null);
  };

  const handleConfirmReservation = async () => {
    // Recupera o ID do agendamento específico do localStorage
    const schedulingId = localStorage.getItem('schedulingId');
    
    console.log("Reagendando o horário com o ID antigo:", schedulingId); 


    
    
    try {
      const response = await fetch(`${BASE_URL}/Scheduling/Rescheduling`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          NewSchedulingId: selectedSchedulingId, 
          OldSchedulingId: schedulingId,  // Utilize o ID que já estava agendado , 
        }),
      });

      if (response.ok) {
        setShowConfirmationModal(true);
        fetchSchedulingData();
        closeModal();
        setTimeout(() => {
          setShowConfirmationModal(false);
          navigate('/agendamento');
        }, 3000);
      } else {
        alert('Erro ao reservar a cadeira. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao reservar cadeira:', error);
    }
  };

  const getChairButtonClass = (status) => {
    switch (status) {
      case 1:
        return 'bg-green-500 hover:bg-green-600';
      case 2:
        return 'bg-red-500 hover:bg-red-600';
      case 3:
        return 'bg-gray-500 hover:bg-gray-600';
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <img src="logoLATAM.png" alt="Logo" className="w-24 h-auto mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-center mb-4">Reagendar Cadeira</h2>

        {showConfirmationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-md shadow-lg text-center">
              <p className="text-lg font-semibold mb-2">Cadeira reservada com sucesso!</p>
              <p className="text-gray-500">Sua reserva foi confirmada.</p>
            </div>
          </div>
        )}

        <table className="table-auto w-full bg-white shadow-md rounded-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Horário</th>
              <th className="px-4 py-2">Cadeira 1</th>
              <th className="px-4 py-2">Cadeira 2</th>
            </tr>
          </thead>
          <tbody>
            {schedulingData.length > 0 ? (
              schedulingData.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2 text-center">
                    {new Date(item.TurnTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className={`${getChairButtonClass(item.chair1)} text-white py-2 px-4 rounded-md transition-colors`}
                      onClick={() => handleOpenModal(item.schedulingId1, 1, item.chair1, item.TurnTime)}
                      disabled={!item.schedulingId1}
                    >
                      <FontAwesomeIcon icon={faChair} /> 1
                    </button>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className={`${getChairButtonClass(item.chair2)} text-white py-2 px-4 rounded-md transition-colors`}
                      onClick={() => handleOpenModal(item.schedulingId2, 2, item.chair2, item.TurnTime)}
                      disabled={!item.schedulingId2}
                    >
                      <FontAwesomeIcon icon={faChair} /> 2
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center px-4 py-2 text-gray-500">Nenhuma cadeira disponível.</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="mt-4 flex justify-between">
          <button
            className="bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
            onClick={() => navigate('/agendamento')}
          >
            Voltar
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
              <h2 className="text-xl font-semibold text-center mb-4">Confirmar Reagendamento</h2>
              <p className="text-center mb-4">
                Tem certeza que deseja reagendar o CPF <strong>{cpf}</strong> na cadeira <strong>{selectedChair}</strong> do horário <strong>{new Date(selectedTurnTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>?
              </p>
              <div className="flex justify-between space-x-4">
                <button
                  className="w-1/2 bg-gray-300 text-black py-2 rounded-md hover:bg-gray-400 transition-colors"
                  onClick={closeModal}
                >
                  Fechar
                </button>
                <button
                  className="w-1/2 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                  onClick={handleConfirmReservation}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reagendamento;
