import { LOGIN_FORM_DATA, SIGNUP_FROM_DATA } from "@src/types/auth"
import { server } from "@src/utils/server"

export const signUpService = async (formData: SIGNUP_FROM_DATA) => {

    const { data, error } = await server.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
            data: {
                full_name: formData.name
            }
        }
    });

    if(error) throw error.message

    return data.user
}

export const loginService = async (formData:LOGIN_FORM_DATA) => {

    const { data, error} = await server.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
    })

    if(error) throw error

    return {
        session: data.session,
        user: data.user,
      };
}
