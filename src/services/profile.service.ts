import { server } from "@src/utils/server";

export const fetchProfile = async () => {
    try {
        const { data: { user }, error } = await server.auth.getUser();
        if (error) throw error;
        return user;
    } catch (err) {
        console.log("fetchProfile error:", err);
        return null;
    }
};
