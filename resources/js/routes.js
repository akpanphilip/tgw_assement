import Home from "./components/pages/home";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
export const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
        meta: { requiresAuth: true },
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
        meta: { guest: true },
    },
    {
        path: "/register",
        name: "Register",
        component: Register,
        meta: { guest: true },
    },
];
