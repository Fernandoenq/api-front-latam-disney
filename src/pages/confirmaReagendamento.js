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
  const [message, setMessage] = useState(''); // Estado para a mensagem de erro ou sucesso
  const [isSuccess, setIsSuccess] = useState(false); // Para saber se foi sucesso ou erro

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
    } else {
      // alert("Não foi possível recuperar o ID pelo CPF.");
    }
  }, [navigate]);
  

  const fetchOldSchedulingId = async (cpf) => {
    
    
    // Remove pontos, hífens e outros caracteres não numéricos do CPF
    const cpfFormatted = cpf.replace(/\D/g, ''); 
    // console.log("Fetching old scheduling ID for CPF:", cpfFormatted);
    // console.log("Fetching old scheduling ID for CPF:", cpf); // Verifica se a função está sendo chamada
    try {
        const response = await fetch(`${BASE_URL}/Scheduling/SchedulingsByCpf/${cpfFormatted}`);
        // console.log("Response status:", response.status); // Verifica o status da resposta
        const data = await response.json();
        // console.log("Dados recebidos da API:", data); // Para verificar a resposta da API

        if (data && data.length > 0 && data[0].SchedulingId !== undefined) {
            setOldSchedulingId(data[0].SchedulingId);
            localStorage.setItem('oldSchedulingId', data[0].SchedulingId);
        } else {
            // console.log("Nenhum agendamento encontrado para o CPF fornecido.");
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
    if (chairStatus === 2 || chairStatus === 3) {
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
      // alert("Selecione uma cadeira antes de confirmar.");
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
    
    // console.log("Reagendando o horário com o ID antigo:", schedulingId); 


    
    
    try {
      console.log(schedulingId);
      console.log(selectedSchedulingId);
      
      const response = await fetch(`${BASE_URL}/Scheduling/Rescheduling`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          NewSchedulingId: Number(selectedSchedulingId), 
          OldSchedulingId: Number(schedulingId),  // Utilize o ID que já estava agendado ,
          PersonId: Number(personId)
        }),
      });

      if (response.ok) {
        setShowConfirmationModal(true);
        fetchSchedulingData();
        closeModal();
        setTimeout(() => {
          setShowConfirmationModal(false);
          navigate('/agendamento');
        }, 1000);
      } else if (response.status === 422) {
        // Erro de validação (422 Unprocessable Entity) vindo do backend
        const data = await response.json(); // Captura a resposta do corpo
        setIsSuccess(false);
        const errors = data.Errors ? data.Errors.join(', ') : 'Erro desconhecido';
        setMessage(`${errors}`);
        closeModal(); // Fecha a modal de confirmação ao encontrar um erro
       
      } 
      
      else {
        // alert('Erro ao reservar a cadeira. Tente novamente.');
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
    <div className="flex flex-col min-h-screen items-center  celular-agendar body-cad" style={{ backgroundImage: `url('/fundomenu.png')`, backgroundSize: 'cover' }}>
     <div
          className="img tabletModelo-destino tabletModelo-agendar geral-cadastro"
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

      
      <div className=" p-6 rounded-lg shadow-md w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-3/5 largura horarios-agendar"  style={{ 
      backgroundColor: 'rgba(65, 105, 225, 0.2)',
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.8)',
      border: '0.4px solid black',
    }}>
      <p className="px-4 py-2 text-center text-white text-lg aumentando-horarios">Horários</p>

        {showConfirmationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-latam">
            <div className="bg-white p-4 rounded-md shadow-lg text-center font-latam">
              <p className="text-lg font-semibold mb-2 font-latam">Poltrona reservada com sucesso!</p>
              <p className="text-gray-500 font-latam">Sua reserva foi confirmada.</p>
            </div>
          </div>
        )}


        <div style={{ maxHeight: '180px', overflowY: 'auto' }} className="horarios">
          <table className="table-auto w-full shadow-md text-white rounded-md text-sm md:text-lg" style={{ overflowX: 'auto' }}>
            <tbody>
              {schedulingData.length > 0 ? (
                schedulingData.map((item, index) => (
                  <tr key={index} className="border-b border-dotted">
                    <td className="px-2 py-1 text-center  md:text-6xl horarios-cadeiras font-latam">
                      {new Date(item.TurnTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-2 py-1  md:text-6xl horarios-cadeiras">
                      <button
                        className={getChairButtonClass(item.chair1, item.schedulingId1, 1)}
                        onClick={() => handleChairSelection(item.schedulingId1, 1, item.chair1, item.TurnTime)}
                        disabled={!item.schedulingId1}
                      >
                        <FontAwesomeIcon icon={faChair} /> 
                      </button>
                    </td>
                    <td className="px-2 py-1  md:text-6xl horarios-cadeiras">
                      <button
                        className={getChairButtonClass(item.chair2, item.schedulingId2, 2)}
                        onClick={() => handleChairSelection(item.schedulingId2, 2, item.chair2, item.TurnTime)}
                        disabled={!item.schedulingId2}
                      >
                        <FontAwesomeIcon icon={faChair} /> 
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center px-4 py-2 text-gray-500">Nenhuma poltrona disponível.</td>
                </tr>
              )}
            </tbody>
          </table>

          </div>       
       

          {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 font-latam">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm font-latam">
            <h2 className="text-xl font-semibold text-center mb-4">Confirmar Agendamento</h2>
            <p className="text-center mb-4 font-latam">
              Tem certeza que deseja <strong>reagendar</strong> o CPF <strong>{cpf}</strong> na poltrona {selectedChair} das {new Date(selectedTurnTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}?
            </p>
            <div className="flex justify-between">
              <button className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 font-latam" onClick={closeModal}>
                Cancelar
              </button>
              <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 font-latam" onClick={handleConfirmReservation}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      </div>

       {/* Alinhamento dos botões "Voltar" e "Confirmar" */}
  <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-3/5  max-w-[1100px] flex justify-between mt-4">
    <button 
      className="w-[170px] h-[40px] voltar text-white text-xl font-bold hover:bg-blue-600 transition-colors rounded-[20px] flex justify-center items-center mb-2 md:mb-0 font-latam " 
      style={{
        boxShadow: '0px 10px 10px -5px rgba(0, 0, 0, 0.8)',
        borderBottom: '3px solid black',
      }} 
      onClick={() => navigate('/agendamento')}
    >
      Voltar
    </button>

    <button 
      className="w-[170px] h-[40px] cadastrar text-white text-xl font-bold hover:bg-blue-600 transition-colors rounded-[20px] flex justify-center items-center mb-2 md:mb-0 font-latam" 
      style={{
        boxShadow: '0px 10px 10px -5px rgba(0, 0, 0, 0.8)',
        borderBottom: '3px solid black',
      }} 
      onClick={handleOpenModal}
    >
      Confirmar
    </button>

    
  </div>
    {/* Exibição de mensagem de erro ou sucesso */}
{message && (
          <div className={`mt-4 text-center ${isSuccess ? 'text-green-500 font-latam' : 'text-white font-latam'}`}>
            {message}
          </div>
        )}

   {/* Imagem colocada abaixo dos inputs e botões */}
   <div className="flex justify-center items-center"> {/* Container flex para centralizar */}
            <div
              className=" tabletModelo-assinatura "
              style={{
                height: '12vh',
                width: '20vw',
                backgroundImage: 'url(assinatura.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
               
              }}
            />
          </div>

    </div>
  );
};

export default Reagendamento;
