import LoginForm from '../../components/LoginForm';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
    const navigate = useNavigate();

    const handleSuccess = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <LoginForm onSucess={handleSuccess} />
        </div>
    );
}