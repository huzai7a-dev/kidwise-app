import Dashboard from "@src/screens/Dashboard";
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import DefaultScreen from "../screens/DefaultScreen";
import ChildProfileScreen from "../screens/Onboarding/ChildProfileScreen";
import Notification from "@src/screens/Notification";
import Profile from "@src/screens/Profile";
import Stories from "@src/screens/Stories";
import AvatarScreen from "@src/screens/AvatarScreen";
import LessonScreen from "@src/screens/LessonScreen";
import QuestionsScreen from "@src/screens/QuestionsScreen";
import PinScreen from "@src/screens/PinScreen";
import UpdateChildProfileScreen from "@src/screens/UpdateChildProfileScreen";
import ProgressScreen from "@src/screens/ProgressScreen";

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
    {
        id: 8,
        name: "avatar",
        component: AvatarScreen,
        isPrivate: true,
    },
    {
        id: 9,
        name: "lesson",
        component: LessonScreen,
        isPrivate: true,
    },
    {
        id: 10,
        name: "lesson_questions",
        component: QuestionsScreen,
        isPrivate: true,
    },
    {
        id: 11,
        name: "pin",
        component: PinScreen,
        isPrivate: true,
    },
    {
        id: 12,
        name: "update_child_profile",
        component: UpdateChildProfileScreen,
        isPrivate: true,
    },
    {
        id: 13,
        name: "progress",
        component: ProgressScreen,
        isPrivate: true,
    },
]