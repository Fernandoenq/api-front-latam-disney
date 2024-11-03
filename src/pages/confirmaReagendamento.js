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

  const handleChairSelection = (schedulingId, chairNumber, chairStatus, turnTime) => {
    if (chairStatus === 2) {
      return; // Cadeira indisponível
    }
    setSelectedSchedulingId(schedulingId);
    setSelectedChair(chairNumber);
    setSelectedTurnTime(turnTime);
  };

  const handleOpenModal = () => {
    if (selectedChair !== null) {
      setModalOpen(true);
    } else {
      alert("Selecione uma cadeira antes de confirmar.");
    }
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

  const getChairButtonClass = (status, schedulingId, chairNumber) => {
    let baseClass = 'text-white py-2 px-3 rounded-md transition-colors';
  
    // Classe para o status da cadeira
    switch (status) {
      case 1:
        baseClass += ' bg-blue-500 hover:bg-blue-600';
        break;
      case 2:
        baseClass += ' bg-red-500 hover:bg-red-600';
        break;
      case 3:
        baseClass += ' bg-gray-500 hover:bg-gray-600';
        break;
      default:
        baseClass += ' bg-blue-500 hover:bg-blue-600';
    }
  
    // Adiciona borda amarela para cadeira selecionada
    if (selectedSchedulingId === schedulingId && selectedChair === chairNumber) {
      baseClass += ' border-4 border-yellow-500';
    }
  
    return baseClass;
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center" style={{ backgroundImage: `url('/fundomenu.png')`, backgroundSize: 'cover' }}>
      <div className="img" style={{ height: '38vh', width: '90vw', backgroundImage: 'url(destinos.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />

      
      <div className=" p-6 rounded-lg shadow-md w-full max-w-sm md:max-w-md lg:max-w-lg largura" style={{ backgroundColor: '#1861af' }}>
      <p className="px-4 py-2 text-center text-white text-lg">Horários</p>

        {showConfirmationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-md shadow-lg text-center">
              <p className="text-lg font-semibold mb-2">Cadeira reservada com sucesso!</p>
              <p className="text-gray-500">Sua reserva foi confirmada.</p>
            </div>
          </div>
        )}


              <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
              <table className="table-auto w-full shadow-md text-white rounded-md" style={{ backgroundColor: '#1861af' }}>
            <tbody>
              {schedulingData.length > 0 ? (
                schedulingData.map((item, index) => (
                  <tr key={index} className="border-b border-dotted">
                    <td className="px-4 py-2 text-center text-lg text-4xl">
                      {new Date(item.TurnTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-2 py-2 text-center">
                      <button
                        className={getChairButtonClass(item.chair1, item.schedulingId1, 1)}
                        onClick={() => handleChairSelection(item.schedulingId1, 1, item.chair1, item.TurnTime)}
                        disabled={!item.schedulingId1}
                      >
                        <FontAwesomeIcon icon={faChair} /> <span className="text-lg">1</span>
                      </button>
                    </td>
                    <td className="px-2 py-2 text-center">
                      <button
                        className={getChairButtonClass(item.chair2, item.schedulingId2, 2)}
                        onClick={() => handleChairSelection(item.schedulingId2, 2, item.chair2, item.TurnTime)}
                        disabled={!item.schedulingId2}
                      >
                        <FontAwesomeIcon icon={faChair} /> <span className="text-lg">2</span>
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

          </div>       
       

          {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
            <h2 className="text-xl font-semibold text-center mb-4">Confirmar Agendamento</h2>
            <p className="text-center mb-4">
              Tem certeza que deseja <strong>reagendar</strong> o CPF <strong>{cpf}</strong> na cadeira {selectedChair} das {new Date(selectedTurnTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}?
            </p>
            <div className="flex justify-between">
              <button className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400" onClick={closeModal}>
                Cancelar
              </button>
              <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600" onClick={handleConfirmReservation}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      </div>

      <div className="mt-4 flex justify-between w-full max-w-md">
        <button className="text-white voltar py-2 px-4 rounded-md hover:bg-gray-400 transition-colors" onClick={() => navigate('/agendamento')}>
          Voltar
        </button>
  
        <button className="bg-blue-500 cadastrar text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors" onClick={handleOpenModal}>
          Confirmar
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

export default Reagendamento;
