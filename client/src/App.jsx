import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { CadastroPage } from './pages/cadastro/page';
import { LoginPage } from './pages/login/login';

function App() {

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<h1> Home do Mural </h1>} />
            <Route path="/cadastro" element={<CadastroPage />} />
            <Route path="/login" element={<LoginPage />} />
          
        </Routes>
    </BrowserRouter>

  )
}

export default App