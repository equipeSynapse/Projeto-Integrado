import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CadastroPage } from './pages/cadastro/page';
import { LoginPage } from './pages/login/login';
import Header from './components/Header';
import { PubliCard } from './components/publicacoes/PubliCard';
import HomePage from './pages/home/home';

function App() {

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cadastro" element={<CadastroPage />} />
            <Route path="/login" element={<LoginPage />} />
          
        </Routes>
    </BrowserRouter>

  )
}

export default App