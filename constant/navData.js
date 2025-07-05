import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import DefaultScreen from "../screens/DefaultScreen";
import ChildProfileScreen from "../screens/Onboarding/ChildProfileScreen";

export const navData = [
    {
        id: 1,
        name: "default",
        component: DefaultScreen,
    },
    {
        id: 2,
        name: "login",
        component: LoginScreen,
    },
    {
        id: 3,
        name: "register",
        component: RegisterScreen,
    },
    {
        id: 3,
        name: "onboarding",
        component: ChildProfileScreen,
    },
]