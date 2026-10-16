export default function isUserLoggedIn() {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]))

        const expToken = payload.exp * 1000;

        if (Date.now() > expToken) {
            localStorage.removeItem('token');
            return false;
        }

        return true;
    } catch (error) {
        localStorage.removeItem('token');
        return false;
    }
}