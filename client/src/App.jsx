import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { CadastroPage } from './pages/cadastro/page';
import { LoginPage } from './pages/login/login';
import { CreatePub } from './pages/pubs/createPub';
import HomePage from './pages/home/home';
import PublicacaoPage from './pages/home/publicacao';

function App() {

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<h1> Home do Mural </h1>} />
            <Route path="/cadastro" element={<CadastroPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/createPub" element={<CreatePub />} />
          
            <Route path="/" element={<HomePage />} />
            <Route path="/publicacao/:id" element={<PublicacaoPage />} />         
        </Routes>
    </BrowserRouter>

  )
}

export default App