import Dashboard from "@src/screens/Dashboard";
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import DefaultScreen from "../screens/DefaultScreen";
import ChildProfileScreen from "../screens/Onboarding/ChildProfileScreen";

export const navData = [
    {
        id: 1,
        name: "default",
        component: DefaultScreen,
        isPrivate: false,
    },
    {
        id: 2,
        name: "login",
        component: LoginScreen,
        isPrivate: false,
    },
    {
        id: 3,
        name: "register",
        component: RegisterScreen,
        isPrivate: false,
    },
    {
        id: 3,
        name: "onboarding",
        component: ChildProfileScreen,
        isPrivate: false,
    },
    {
        id: 4,
        name: "dashboard",
        component: Dashboard,
        isPrivate: true,
    }
]