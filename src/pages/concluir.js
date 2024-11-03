import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BASE_URL from '../config'; // Certifique-se de que o BASE_URL está definido corretamente
import '../index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChair } from '@fortawesome/free-solid-svg-icons';

const Agendar = () => {
  const [schedulingData, setSchedulingData] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false); // Estado para controlar a abertura da modal
  const [selectedChair, setSelectedChair] = useState(null); // Estado para armazenar a cadeira selecionada
  const [selectedSchedulingId, setSelectedSchedulingId] = useState(null); // Armazena o ID do agendamento
  const navigate = useNavigate();
  const [cpf, setCpf] = useState(''); // Estado para armazenar o CPF
  const [personId, setPersonId] = useState(''); // Estado para armazenar o CPF
  const [userId, setUserId] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); // Estado para controlar a exibição da modal
  const [selectedTurnTime, setSelectedTurnTime] = useState(''); // Estado para armazenar o horário
  const [message, setMessage] = useState(''); // Estado para a mensagem de erro ou sucesso
  // console.log("segundo",cpf)
  
  

  useEffect(() => {
        // Recupera os dados do localStorage
        const storedUserId = localStorage.getItem('userId');
    const storedCpf = localStorage.getItem('cpf'); // Recupera o CPF do localStorage
    const storedIDbyCPF = localStorage.getItem('personId'); // Recupera o CPF do localStorage

    if (storedUserId ) {
      setUserId(storedUserId); // Salva o OrganizerId no estado
      console.log("esse e o id da pessoa logada", storedUserId)
    } else {
      // Se os dados não existirem, redireciona para a tela de login ou dashboard
      navigate('/login');
    }


    if (storedCpf) {
      setCpf(storedCpf); // Armazena o CPF no estado
      fetchSchedulingData(storedCpf); // Busca os dados de agendamento usando o CPF
    } else {
      navigate('/dashboard'); // Se não houver CPF, redireciona para o dashboard
    }
    if (storedIDbyCPF) {
      setPersonId(storedIDbyCPF); 
      console.log("esse e o id da pessoa do cpf", storedIDbyCPF)
      fetchSchedulingData(storedCpf); 
    } else {
      alert("nao pegou o id do cpf")
    }
  }, [navigate]);

  const fetchSchedulingData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/Scheduling/NotViewedSchedules`);
      const data = await response.json();

      // Agrupar os agendamentos pelo mesmo TurnTime
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

  const handleConfirmConclusion = async () =>{
    try {
      const response = await fetch(`${BASE_URL}/Scheduling/ConfirmPresence/${selectedSchedulingId}`, {
        method: 'PUT',
      });
      console.log("chegou1");
      if (response.ok) {
        console.log("chegou2");
        setShowConfirmationModal(true); // Mostra a modal de confirmação
  
        // Atualize o estado do schedulingData sem fazer um fetch novamente
        setSchedulingData(prevData => 
          prevData.map(item =>
            item.SchedulingId === selectedSchedulingId ? { ...item, SchedulingStatus: 3 } : item
          )
        );
        window.location.reload(); // Recarrega a página atual
        closeModal(); // Fechar modal após confirmar
  
        // Fecha automaticamente a modal de confirmação após 3 segundos
        setTimeout(() => {
          setShowConfirmationModal(false);
        }, 3000);
      } else if (response.status === 422) {
        const data = await response.json(); // Adicione esta linha para capturar a resposta JSON
        const errors = data.Errors ? data.Errors.join(', ') : 'Erro desconhecido';
        setMessage(`Erro no cadastro: ${errors}`); // Atualiza a mensagem com os erros recebidos
    }
      else {
        alert('Erro ao reservar a cadeira. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao reservar cadeira:', error);
    }

  }
  const handleChairSelection = (schedulingId, chairNumber, chairStatus, turnTime) => {
    if (chairStatus === 1 || chairStatus === 3) {
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

  // Fechar modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedSchedulingId(null);
    setSelectedChair(null);
  };


  


  // Função para determinar a cor do botão com base no status da cadeira
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
    <div  className="flex flex-col min-h-screen items-center justify-center"
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


      <div  className="p-6 rounded-lg shadow-md w-full max-w-sm md:max-w-md lg:max-w-lg largura"
  style={{ backgroundColor: '#1861af' }}>
      

          {/* Modal de confirmação */}
          {showConfirmationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-md shadow-lg text-center">
              <p className="text-lg font-semibold mb-2">Cadeira reservada com sucesso!</p>
              <p className="text-gray-500">Sua reserva foi confirmada.</p>
            </div>
          </div>
        )}
<p className="px-4 py-2 text-center text-white text-lg ">Concluir horários</p>
        <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
              {/* Tabela de agendamentos */}
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

      
      </div>

      <div className="mt-4 flex justify-between w-full max-w-md">
        <button className="text-white voltar py-2 px-4 rounded-md hover:bg-gray-400 transition-colors" onClick={() => navigate('/dashboard')}>
          Voltar
        </button>
  
        <button className="bg-blue-500 cadastrar text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors" onClick={handleOpenModal}>
          Confirmar
        </button>
      </div>

      {/* Modal de confirmação */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
            <h2 className="text-xl font-semibold text-center mb-4">Confirmar Agendamento</h2>
            <p className="text-center mb-4">
              Tem certeza que deseja confirmar o horário da cadeira <strong>{selectedChair}</strong> do horário <strong>{new Date(selectedTurnTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>?
            </p>
            {/* Flex para os botões */}
            <div className="flex justify-between space-x-4">
              <button
                className="w-1/2 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                onClick={closeModal}
              >
                Fechar
              </button>
              <button
                className="w-1/2 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                onClick={handleConfirmConclusion}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}



    </div>

    
  );
};

export default Agendar;
