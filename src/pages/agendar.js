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

  // Abrir a modal ao clicar em uma cadeira disponível
  const handleOpenModal = (schedulingId, chairNumber, chairStatus, turnTime) => {
    if (chairStatus === 2) {
      // Se a cadeira estiver ocupada (vermelha), não abre a modal
      return;
    }
    // console.log("terceiro ",cpf)
    console.log("esse e id da cadeira ",schedulingId)
    setSelectedSchedulingId(schedulingId);
    setSelectedChair(chairNumber);
    setSelectedTurnTime(turnTime); // Armazena o horário selecionado
  
    setModalOpen(true); // Abrir modal
  };

  // Fechar modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedSchedulingId(null);
    setSelectedChair(null);
  };


  
  // console.log("quart",cpf)
  // Função para confirmar a reserva
  const handleConfirmReservation = async () => {
    try {
      const response = await fetch(`${BASE_URL}/Scheduling/Scheduling`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          SchedulingId: selectedSchedulingId,
          OrganizerId: userId, 
          PersonId: personId, 
        }),
      });
      // console.log("quinto",cpf)
      if (response.ok) {
        setShowConfirmationModal(true); // Mostra a modal de confirmação
        fetchSchedulingData(); // Atualiza a lista após a reserva
        closeModal(); // Fechar modal após confirmar

         // Fecha automaticamente a modal de confirmação após 3 segundos
         setTimeout(() => {
          setShowConfirmationModal(false);
        }, 3000);
      } else {
        alert('Erro ao reservar a cadeira. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao reservar cadeira:', error);
    }
  };

  // Função para determinar a cor do botão com base no status da cadeira
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
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm md:max-w-md lg:max-w-lg largura">
        <img src="logoLATAM.png" alt="Logo" className="w-24 h-auto mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-center mb-4">Agendamento de Cadeiras</h2>

          {/* Modal de confirmação */}
          {showConfirmationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-md shadow-lg text-center">
              <p className="text-lg font-semibold mb-2">Cadeira reservada com sucesso!</p>
              <p className="text-gray-500">Sua reserva foi confirmada.</p>
            </div>
          </div>
        )}

        {/* Tabela de agendamentos */}
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
                      onClick={() => handleOpenModal(item.schedulingId1, 1,item.chair1, item.TurnTime)} // Abrir modal ao clicar na cadeira 1
                      disabled={!item.schedulingId1}
                    >
                      <FontAwesomeIcon icon={faChair} /> 1
                    </button>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className={`${getChairButtonClass(item.chair2)} text-white py-2 px-4 rounded-md transition-colors`}
                      onClick={() => handleOpenModal(item.schedulingId2, 2,item.chair2, item.TurnTime)} // Abrir modal ao clicar na cadeira 2
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
      </div>

      {/* Modal de confirmação */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
            <h2 className="text-xl font-semibold text-center mb-4">Confirmar Agendamento</h2>
            <p className="text-center mb-4">
              Tem certeza que deseja cadastrar o CPF <strong>{cpf}</strong> na cadeira <strong>{selectedChair}</strong> do horário <strong>{new Date(selectedTurnTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>?
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
                onClick={handleConfirmReservation}
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
