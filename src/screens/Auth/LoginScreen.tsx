import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '@constants/colors';
import { useNavigation, NavigationProp } from '@react-navigation/core';
import type { RootStackParamList } from '@src/types/navigation';
import KWText from '@components/KWText';
import { useForm, Controller, SubmitErrorHandler, SubmitHandler } from 'react-hook-form';
import { useToast } from '@hooks/useToast';
import { loginService } from '@services/auth.service';

// Define the form data type
interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginScreen: React.FC = () => {
  const nav = useNavigation<NavigationProp<RootStackParamList>>();

  const { showToast } = useToast();
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({ mode: 'onChange' });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      await loginService(data);

      showToast('Login Success', 'success')
      nav.navigate('dashboard')
    } catch (error) {
      console.log(error);
      showToast('Login failed', 'error');
    }
  };

  const onError: SubmitErrorHandler<LoginFormInputs> = (formErrors) => {
    if (formErrors.email) {
      showToast('Email is required', 'error');
    } else if (formErrors.password) {
      showToast('Password must be at least 6 characters', 'error');
    }
  };

  return (
    <View style={styles.container}>
      <KWText variant="title">Sign in</KWText>
      <KWText variant="subtitle">Sign in with one of the following options.</KWText>

      <KWText variant="label">Email</KWText>
      <Controller
        control={control}
        rules={{ required: true }}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={"gray"}
            keyboardType="email-address"
            autoCapitalize="none"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
      {errors.email && <KWText style={styles.errorText}>Email is required</KWText>}

      <KWText variant="label">Password</KWText>
      <Controller
        control={control}
        rules={{ required: true, minLength: 6 }}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={"gray"}
            secureTextEntry
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
      {errors.password && <KWText style={styles.errorText}>Password must be at least 6 characters</KWText>}

      <TouchableOpacity>
        <KWText variant="caption" align="right" style={{ marginBottom: 20 }}>Forgot Password ?</KWText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={handleSubmit(onSubmit, onError)}>
        <KWText style={styles.btnText}>LOGIN</KWText>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => nav.navigate("register")}> 
        <KWText style={styles.bottomText}>
          Don't have an account ? <KWText variant="link">Register</KWText>
        </KWText>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

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
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.gray
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
  },
  errorText: {
    color: '#FF3333',
    marginBottom: 10,
    marginLeft: 4,
    fontSize: 14,
  },
});
