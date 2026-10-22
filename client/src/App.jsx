import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/home';
import PublicacaoPage from './pages/home/publicacao';

function App() {

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/publicacao/:id" element={<PublicacaoPage />} />         
        </Routes>
    </BrowserRouter>

  )
}

export default App