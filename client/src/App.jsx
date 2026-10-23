import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/home';
import PublicacaoPage from './pages/home/publicacao';
import PerfilPage from './pages/home/profile/perfil';
import PrivateRoute from './PrivateRoute';
import isUserLoggedIn from './utils/auth';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/publicacao/:id" element={<PublicacaoPage />} />

        <Route element={<PrivateRoute/>}>
          <Route path="/perfil" element={<PerfilPage/>} />
        </Route>
        
      </Routes>
    </BrowserRouter>

  )
}

export default App