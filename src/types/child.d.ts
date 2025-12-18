export interface CHILD_FORM_DATA {
    avatar: string,
    name: string,
    age: string,
    gender: string
    pin: string,
}

export type Child = {
    id: number;
    created_at: string;
    full_name: string;
    age: number;
    gender: "male" | "female" | string;
    avatar_id: number;
    parent_id: string;
    pin: string;
};