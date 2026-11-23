import { Navigate, Outlet } from "react-router-dom";
import isUserLoggedIn from "./utils/auth";

export default function AdminRoute () {
    if (isUserLoggedIn().email !== "casmd@virtual.ufc.br") {
        return <Navigate to="/" replace/>
    }

    return <Outlet/>
}