import './App.css'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/home/home';
import PublicacaoPage from './pages/home/publicacao';
import PerfilPage from './pages/profile/perfil';
import PrivateRoute from './PrivateRoute';
import RedefinirSenhaPage from './pages/redefinirSenha/redefinirSenha';
import { useEffect, useState } from 'react';
import AdminRoute from './AdminRoute';
import DenunciasPage from './pages/denuncias/denuncias';

function AnunciadorDeRota() {
  const { pathname } = useLocation();
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    let nomeTela = 'Página inicial';

    if (pathname === '/') nomeTela = 'Página inicial';
    else if (pathname.startsWith('/publicacao/')) nomeTela = 'Detalhes da publicação';
    else if (pathname === '/redefinir-senha') nomeTela = 'Redefinir senha';
    else if (pathname === '/perfil') nomeTela = 'Meu perfil';

    setMensagem(`Você está na tela: ${nomeTela}`);
  }, [pathname]);

  return (
    <span className="sr-only" aria-live="polite" aria-atomic="true">
      {mensagem}
    </span>
  );
}


function App() {

  return (
    <BrowserRouter>
      <AnunciadorDeRota />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/publicacao/:id" element={<PublicacaoPage />} />
        <Route path="/redefinir-senha" element={<RedefinirSenhaPage />} />

        <Route element={<PrivateRoute/>}>
          <Route path="/perfil" element={<PerfilPage/>} />
        </Route>

        <Route element={<AdminRoute/>}>
            <Route path="/denuncias" element={<DenunciasPage/>} />
        </Route>
        
      </Routes>
    </BrowserRouter>

  )
}

export default App