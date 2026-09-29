import './App.css'
import { Routes, Route } from 'react-router-dom';

import { CadastroPage } from './pages/cadastro/page';

function App() {

  return (

        <Routes>
            <Route path="/" element={<h1> Home do Mural </h1>} />
            <Route path="/cadastro" element={<CadastroPage />} />
        </Routes>

  )
}

export default App
