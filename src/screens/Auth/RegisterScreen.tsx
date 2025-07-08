import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/core';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { theme } from '@constants/colors';
import KWText from '@components/KWText';
import { signUpService } from '@src/services/auth.service';
import type { SIGNUP_FROM_DATA } from '@src/types/auth';
import type { RootStackParamList } from '@src/types/navigation';


const RegisterScreen: React.FC = () => {
  const nav = useNavigation<NavigationProp<RootStackParamList>>();
  
  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<SIGNUP_FROM_DATA>({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    },
    mode: 'onChange'
  });

  const onSubmit: SubmitHandler<SIGNUP_FROM_DATA> = async (data) => {
    try {
      const response = await signUpService(data);
      if (response && response.id) {
        nav.navigate('onboarding', { parentId: response.id });
      } else {
        Alert.alert('Signup failed! try again.');
      }
    } catch (error: any) {
      console.log(error);
      Alert.alert(error?.details || 'Signup failed! try again.');
    }
  };

  return (
    <View style={styles.container}>
      <KWText variant="title">Sign up</KWText>
      <KWText variant="subtitle">Sign up with one of the following options.</KWText>

      <KWText variant="label">Name</KWText>
      <Controller
        control={control}
        name="name"
        rules={{
          required: 'Name is required',
          minLength: {
            value: 2,
            message: 'Name must be at least 2 characters'
          }
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            placeholder="Name"
            placeholderTextColor="gray"
            keyboardType="default"
            autoCapitalize="words"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.name && <KWText variant="error">{errors.name.message}</KWText>}

      <KWText variant="label">Email</KWText>
      <Controller
        control={control}
        name="email"
        rules={{
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Please enter a valid email address'
          }
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Email"
            placeholderTextColor="gray"
            keyboardType="email-address"
            autoCapitalize="none"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.email && <KWText variant="error">{errors.email.message}</KWText>}

      <KWText variant="label">Password</KWText>
      <Controller
        control={control}
        name="password"
        rules={{
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters'
          }
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Password"
            placeholderTextColor="gray"
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.password && <KWText variant="error">{errors.password.message}</KWText>}

      <TouchableOpacity 
        style={[styles.btn, !isValid && styles.btnDisabled]} 
        onPress={handleSubmit(onSubmit)}
        disabled={!isValid}
      >
        <KWText style={styles.btnText}>Register</KWText>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => nav.navigate('login')}>
        <KWText style={styles.bottomText}>
          Already have an account ? <KWText variant="link">Login</KWText>
        </KWText>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 30,
    paddingVertical: 70
  },
  input: {
    backgroundColor: theme.bg,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: theme.black,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: theme.gray
  },
  inputError: {
    borderColor: '#ff4444',
    borderWidth: 2,
  },
  btn: {
    backgroundColor: theme.orange,
    paddingVertical: 15,
    borderRadius: 100,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
    marginTop: 10
  },
  btnDisabled: {
    backgroundColor: '#cccccc',
    opacity: 0.6,
  },
  btnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  bottomText: { 
    textAlign: "center", 
    marginTop: 20, 
    fontSize: 17, 
    color: theme.black,
    fontWeight: "300"
  }
});
