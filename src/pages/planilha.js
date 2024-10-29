import React, { useState, useEffect } from 'react';
import BASE_URL from '../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChair } from '@fortawesome/free-solid-svg-icons';
//1 disponivel verde 2 - ocupado vermelho 3 - confirmado cinza (fazer uma legenda)
//quando clicar no agendamento pedir o cpf do cliente (pois sempre tera que carregar esse id para cadastrar a no agendamento)
//agendamento traz o endpoint http://3.133.92.17:3333/Scheduling/NotViewedSchedules
//confirmar presença trará todos os horarios das pessoas que colocou o cpf e qunado clicar no vermleho ele ficará cinza (confirmação)
//o dashboard vai ser uma planilha de todo mundo
const Planilha = () => {
  const [schedulingData, setSchedulingData] = useState([]);

  // Função para buscar os dados do endpoint
  const fetchSchedulingData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/Scheduling/Dashboard`);
      const data = await response.json();
      setSchedulingData(data); // Armazena os dados do agendamento
    } catch (error) {
      console.error('Erro ao buscar dados de agendamento:', error);
    }
  };

  useEffect(() => {
    fetchSchedulingData(); // Busca os dados ao montar o componente
  }, []);

  // Função para definir a cor do ícone baseado no status
  const getIconColor = (status) => {
    if (status === 2) {
      return 'text-green-500'; // Verde se o status for 2
    } else if (status === 3) {
      return 'text-red-500'; // Vermelho se o status for 3
    } else {
      return 'text-gray-400'; // Cor padrão para outros status
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-semibold mb-6">Agendamento de Cadeiras</h2>
      <div className="flex flex-col gap-6">
        {schedulingData.map((item, index) => {
          // Exibe as cadeiras em pares (duplas)
          if (index % 2 === 0) {
            return (
              <div key={index} className="flex justify-center gap-4 bg-white p-4 rounded-md shadow-md w-full max-w-md">
                {/* Primeira cadeira */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg">{item.TurnTime}</span>
                    <FontAwesomeIcon
                      icon={faChair}
                      className={`text-3xl cursor-pointer ${getIconColor(item.SchedulingStatus)}`}
                    />
                  </div>
                  <div className="flex flex-col text-left">
                    <span>CPF: {item.Cpf}</span>
                    <span>Nome: {item.PersonName}</span>
                  </div>
                </div>

                {/* Segunda cadeira (se existir) */}
                {schedulingData[index + 1] && (
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg">{schedulingData[index + 1].TurnTime}</span>
                      <FontAwesomeIcon
                        icon={faChair}
                        className={`text-3xl cursor-pointer ${getIconColor(schedulingData[index + 1].SchedulingStatus)}`}
                      />
                    </div>
                    <div className="flex flex-col text-left">
                      <span>CPF: {schedulingData[index + 1].Cpf}</span>
                      <span>Nome: {schedulingData[index + 1].PersonName}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>
    </div>
  );
};

export default Planilha;
