import AsyncStorage from '@react-native-async-storage/async-storage';
import { Child, CHILD_FORM_DATA } from '@src/types/child';
import { server } from '@src/utils/server';

export const createChildService = async (
  formData: CHILD_FORM_DATA,
  parentId: string,
) => {
  const { error } = await server.from('children').insert({
    parent_id: parentId,
    full_name: formData.name,
    age: Number(formData.age),
    gender: formData.gender,
    avatar_id: Number(formData.avatar),
    pin: formData.pin,
  });

  if (error) throw error.message;
};

export const fetchChildrenByParent = async (): Promise<Child[]> => {
  try {
    const parent_id = await AsyncStorage.getItem('user_id');
    const { data, error } = await server
      .from('children')
      .select('*')
      .eq('parent_id', parent_id);
    if (error) throw error;
    if (data?.length) {
      const storedChildId = await AsyncStorage.getItem('child_id');
      if (!storedChildId) {
        await AsyncStorage.setItem('child_id', data[0].id.toString());
      }
    }
    return data || [];
  } catch (err) {
    console.log('fetchChildrenByParent error:', err);
    return [];
  }
};

export const verifyChildPinService = async (pin: string): Promise<boolean> => {
  try {
    const storedChildId = await AsyncStorage.getItem('child_id');
    if (!storedChildId) return false;

    const { data, error } = await server
      .from('children')
      .select('pin')
      .eq('id', storedChildId)
      .single();

    if (error) return false;

    return data.pin === pin;
  } catch {
    return false;
  }
};

export const updateChildService = async (
  childId: string,
  formData: CHILD_FORM_DATA,
) => {
  const { error } = await server
    .from('children')
    .update({
      full_name: formData.name,
      age: Number(formData.age),
      gender: formData.gender,
      avatar_id: Number(formData.avatar),
      pin: formData.pin,
    })
    .eq('id', childId);

  if (error) throw error.message;
};

export const getChildProfile = async (childId: string) => {
  const { data, error } = await server
    .from('children')
    .select('*')
    .eq('id', childId)
    .single();

  if (error) throw error;
  return data;
};
