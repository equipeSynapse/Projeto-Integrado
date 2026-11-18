import { Navigate, Outlet } from "react-router-dom";
import isUserLoggedIn from "./utils/auth";

export default function PrivateRoute () {
    if (!isUserLoggedIn()) {
        return <Navigate to="/" replace/>
    }

    return <Outlet/>
}