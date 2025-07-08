import { CHILD_FORM_DATA } from "@src/types/child";
import { server } from "@src/utils/server";

export const createChildService = async(formData: CHILD_FORM_DATA, parentId: string)=> {
    const { error } = await server.from('children').insert({
        parent_id: parentId,
        full_name: formData.name,
        age: Number(formData.age),
        gender: formData.gender,
        avatar_id: Number(formData.avatar)
    })

    if(error) throw error.message
}