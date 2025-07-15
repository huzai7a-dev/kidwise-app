import Dashboard from "@src/screens/Dashboard";
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import DefaultScreen from "../screens/DefaultScreen";
import ChildProfileScreen from "../screens/Onboarding/ChildProfileScreen";
import Notification from "@src/screens/Notification";
import Profile from "@src/screens/Profile";
import Stories from "@src/screens/Stories";

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
    },
    {
        id: 5,
        name: "notification",
        component: Notification,
        isPrivate: true,
    },
    {
        id: 6,
        name: "profile",
        component: Profile,
        isPrivate: true,
    },
    {
        id: 7,
        name: "stories",
        component: Stories,
        isPrivate: true,
    },
]