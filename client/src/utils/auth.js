import { jwtDecode } from "jwt-decode";

export default function isUserLoggedIn() {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
        const payload = jwtDecode(token)

        const expToken = payload.exp * 1000;

        if (Date.now() > expToken) {
            localStorage.removeItem('token');
            return null;
        }

        return payload;
    } catch (error) {
        localStorage.removeItem('token');
        return null;
    }
}