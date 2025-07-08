import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/core';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

import { theme } from '@constants/colors';
import KWText from '@components/KWText';
import female from "@assets/onboarding/female.png";
import male from "@assets/onboarding/male.png";
import neutral from "@assets/onboarding/neutral.png";
import { AVATARS } from '@src/constants/avatars';
import { createChildService } from '@src/services/child.service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@src/types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'onboarding'>;

interface ChildProfileFormData {
  avatar: string;
  name: string;
  age: string;
  gender: string;
}


const ChildProfileScreen = ({ route }:Props) => {
  const nav = useNavigation<NavigationProp<RootStackParamList>>();

  const parentId = route?.params?.parentId;
  if (!parentId) nav.goBack();

  const avatars = Object.entries(AVATARS).map(([id, src]) => ({ id, src }));

  const genders = [
    { label: 'Female', value: 'female', icon: female },
    { label: 'Male', value: 'male', icon: male },
    { label: 'Other', value: 'neutral', icon: neutral },
  ];

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm<ChildProfileFormData>({
    defaultValues: {
      avatar: avatars[1].id,
      name: '',
      age: '',
      gender: '',
    },
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<ChildProfileFormData> = async (data) => {
    try {
      await createChildService(data, parentId);
      nav.navigate('login');
    } catch (error) {
      console.log(error)
      Alert.alert('Child profile creation failed, please try again.')
    }
  };

  return (
    <View style={styles.container}>
      <KWText variant="title" size={28}>Create Your Child Profile</KWText>
      <KWText variant="subtitle" size={16}>Setup to Continue</KWText>

      <KWText variant="heading" size={18} style={styles.sectionTitle}>Choose Avatar</KWText>
      <Controller
        control={control}
        name="avatar"
        rules={{ required: 'Please select an avatar' }}
        render={({ field: { value } }) => (
          <View style={styles.avatarContainer}>
            {avatars.map((avatar, index) => (
              <TouchableOpacity key={index} onPress={() => setValue('avatar', avatar.id, { shouldValidate: true })}>
                <Image source={avatar.src} style={[styles.avatarImage, value === avatar.id && styles.selectedAvatarBorder]} />
                {value === avatar.id && (
                  <View style={styles.selectedCheckmarkContainer}>
                    <KWText style={styles.selectedCheckmark}>✓</KWText>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      />
      {errors.avatar && <KWText variant="error">{errors.avatar.message}</KWText>}

      <KWText variant="label">Baby Name</KWText>
      <Controller
        control={control}
        name="name"
        rules={{
          required: 'Baby name is required',
          minLength: { value: 2, message: 'Name must be at least 2 characters' },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.textInput, errors.name && styles.inputError]}
            placeholder="Baby Name"
            placeholderTextColor="gray"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
      {errors.name && <KWText variant="error">{errors.name.message}</KWText>}

      <KWText variant="label">Baby Age</KWText>
      <Controller
        control={control}
        name="age"
        rules={{
          required: 'Baby age is required',
          pattern: { value: /^\d+$/, message: 'Age must be a number' },
          min: { value: 0, message: 'Age must be at least 0' },
          max: { value: 18, message: 'Age must be 18 or less' },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.textInput, errors.age && styles.inputError]}
            placeholder="Baby Age"
            placeholderTextColor="gray"
            keyboardType="numeric"
            value={String(value)}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
      {errors.age && <KWText variant="error">{errors.age.message}</KWText>}

      <KWText variant="heading" size={18} style={styles.sectionTitle}>Select Gender</KWText>
      <Controller
        control={control}
        name="gender"
        rules={{ required: 'Please select a gender' }}
        render={({ field: { value } }) => (
          <View style={styles.genderContainer}>
            {genders.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.genderOption, value === option.value && styles.selectedGenderOption]}
                onPress={() => setValue('gender', option.value, { shouldValidate: true })}
              >
                <Image source={option.icon} style={styles.genderIcon} />
                <KWText variant="body" style={styles.genderText}>{option.label}</KWText>
              </TouchableOpacity>
            ))}
          </View>
        )}
      />
      {errors.gender && <KWText variant="error">{errors.gender.message}</KWText>}

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        style={[styles.continueButton, !isValid && styles.btnDisabled]}
        disabled={!isValid}
      >
        <KWText style={styles.continueButtonText}>Save</KWText>
      </TouchableOpacity>
    </View>
  );
};

export default ChildProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 30,
    paddingVertical: 70,
  },
  sectionTitle: {
    marginBottom: 15,
    marginTop: 20,
  },
  avatarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  selectedAvatarBorder: {
    borderWidth: 3,
    borderColor: theme.orange,
  },
  selectedCheckmarkContainer: {
    position: 'absolute',
    bottom: -10,
    right: 0,
    backgroundColor: theme.purple,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.bg,
  },
  selectedCheckmark: {
    color: theme.bg,
    fontSize: 15,
    fontWeight: 'bold',
  },
  textInput: {
    backgroundColor: theme.bg,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: theme.black,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.gray,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  genderOption: {
    backgroundColor: 'white',
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
    width: '30%',
  },
  selectedGenderOption: {
    borderWidth: 2,
    borderColor: theme.orange,
  },
  genderIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  genderText: {
    color: theme.black,
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: theme.orange,
    borderRadius: 100,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 'auto',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  continueButtonText: {
    color: theme.bg,
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputError: {
    borderColor: '#ff4444',
    borderWidth: 2,
  },
  btnDisabled: {
    backgroundColor: '#cccccc',
    opacity: 0.6,
  },
});
