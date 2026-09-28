import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import CadastroForm from './pages/cadastro/page';

function App() {

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/cadastro" element={<CadastroForm />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
