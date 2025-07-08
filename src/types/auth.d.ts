

export interface LOGIN_FORM_DATA {
    email: string,
    password: string
}

export interface SIGNUP_FROM_DATA extends LOGIN_FORM_DATA {
    name: string,
}