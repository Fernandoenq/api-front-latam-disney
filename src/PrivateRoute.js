// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Importa o contexto de autenticação

const PrivateRoute = ({ element }) => {
  const { userId } = useAuth(); // Obtém o ID do usuário do contexto

  // Verifica se o usuário está autenticado (userId deve estar definido)
  if (!userId) {
    return <Navigate to="/" />; // Redireciona para o login se não estiver autenticado
  }

  return element; // Renderiza o elemento se o usuário estiver autenticado
};

export default PrivateRoute;
