import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { CadastroPage } from './pages/cadastro/page';
import { LoginPage } from './pages/login/login';
import { CreatePub } from './pages/pubs/createPub';
import HomePage from './pages/home/home';
import PublicacaoPage from './pages/home/publicacao';
import PerfilPage from './pages/home/profile/perfil';
import PrivateRoute from './PrivateRoute';
import isUserLoggedIn from './utils/auth';
import RedefinirSenhaPage from './pages/redefinirSenha/redefinirSenha';

function App() {

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/"/>
            <Route path="/cadastro" element={<CadastroPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/createPub" element={<CreatePub />} />
          
        </Routes>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/publicacao/:id" element={<PublicacaoPage />} />
        <Route path="/redefinir-senha" element={<RedefinirSenhaPage />} />

        <Route element={<PrivateRoute/>}>
          <Route path="/perfil" element={<PerfilPage/>} />
        </Route>
        
      </Routes>
    </BrowserRouter>

  )
}

export default App