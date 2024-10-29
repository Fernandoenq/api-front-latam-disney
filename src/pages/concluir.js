import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../config';
import '../index.css';

const Concluir = () => {
  const [cpf, setCpf] = useState('');
  const [schedulingData, setSchedulingData] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false); // Estado para controlar a abertura da modal
  const [selectedChair, setSelectedChair] = useState(null); // Estado para armazenar a cadeira selecionada
  const [selectedSchedulingId, setSelectedSchedulingId] = useState(null); // Armazena o ID do agendamento
  const navigate = useNavigate();
  const [selectedTurnTime, setSelectedTurnTime] = useState(''); // Estado para armazenar o horário
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); // Estado para controlar a exibição da modal
  const [message, setMessage] = useState(''); // Estado para a mensagem de erro ou sucesso
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

  const filteredSchedulingData = schedulingData.filter(item => item.SchedulingStatus === 2);

  const handleConfirmarClick = (schedulingId, chairNumber, chairStatus, turnTime) => {
    localStorage.setItem('schedulingId', schedulingId, turnTime); // Armazena o ID do agendamento
    console.log("peguei o id da cadeira !!!!!!!!!",schedulingId)
    setSelectedSchedulingId(schedulingId); // Atualiza o estado de selectedSchedulingId
    setSelectedChair(chairNumber);
    setSelectedTurnTime(turnTime); // Armazena o horário selecionado
    setModalOpen(true); // Abrir modal
    
  };

  console.log(selectedSchedulingId)
  
  const handleConfirmChair = async () => {
    console.log("chegou", selectedSchedulingId);
    const cpf = localStorage.getItem('cpf'); // Recupera o CPF de localStorage
    if (!cpf) {
      console.error("CPF não encontrado");
      return;
    }
  
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
  };
  
  // Fechar modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedSchedulingId(null);
    setSelectedChair(null);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm md:max-w-md lg:max-w-lg largura">
        <img src="logoLATAM.png" alt="Logo" className="w-24 h-auto mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-center mb-4">Cadeiras - CPF: {cpf}</h2>

            {/* Modal de confirmação */}
            {showConfirmationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-md shadow-lg text-center">
              <p className="text-lg font-semibold mb-2">Cadeira reservada com sucesso!</p>
              <p className="text-gray-500">Reserva foi concluida.</p>
            </div>
          </div>
        )}

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
                      onClick={() => handleConfirmarClick(item.SchedulingId,1,item.chair1, item.TurnTime)} // Passa o horário para reagendar
                    >
                      Confirmar 
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
        
        </div>
      </div>

      
          {/* Modal de confirmação */}
          {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
            <h2 className="text-xl font-semibold text-center mb-4">Confirmar Agendamento</h2>
            <p className="text-center mb-4">
              Tem certeza que deseja confirmar com o agendamento <strong>{selectedChair}</strong> do horário <strong>{new Date(selectedTurnTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>?
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
                onClick={handleConfirmChair}
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

export default Concluir;
