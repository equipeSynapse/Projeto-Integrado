import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/home';
import PublicacaoPage from './pages/home/publicacao';
import RedefinirSenhaPage from './pages/redefinirSenha/redefinirSenha';

function App() {

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/publicacao/:id" element={<PublicacaoPage />} />         
            <Route path="/redefinir-senha" element={<RedefinirSenhaPage />} />
        </Routes>
    </BrowserRouter>

  )
}

export default App