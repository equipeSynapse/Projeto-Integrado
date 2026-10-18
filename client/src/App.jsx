import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CadastroPage } from './pages/cadastro/page';
import { LoginPage } from './pages/login/login';
import Header from './components/Header';
import { PubliCard } from './components/publicacoes/PubliCard';
import HomePage from './pages/home/home';
import PublicacaoPage from './pages/home/publicacao';

function App() {

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/publicacao/:id" element={<PublicacaoPage />} />
            <Route path="/cadastro" element={<CadastroPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/publicacoes" element={<PublicacoesPage />} />
          
        </Routes>
    </BrowserRouter>

  )
}

export default App