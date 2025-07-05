import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, } from 'react-native';
import { theme } from '../../color';
import { useNavigation } from '@react-navigation/core';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigation()

  const handleLogin = () => {
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Sign in</Text>
      <Text style={styles.subtitle}>Sign in with one of the following options.</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor={"gray"} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />

      <Text style={styles.label}>Password</Text>
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor={"gray"} secureTextEntry value={password} onChangeText={setPassword} />

      <TouchableOpacity>
        <Text style={{ textAlign: "right", marginBottom: 20, fontSize: 15, color: theme.gray }}>Forgot Password ?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>LOGIN</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>nav.navigate("register")}>
        <Text style={{ textAlign: "center", marginTop: 20, fontSize: 17, color: theme.black,fontWeight:"300"}}>Don't have an account ? <Text style={{color:theme.orange,fontWeight:"400"}}>Register</Text></Text>
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
  title: {
    fontSize: 34,
    fontWeight: '600',
    color: theme.black,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: theme.black,
    marginBottom: 50,
  },
  label: {
    fontSize: 17,
    marginBottom: 8
  },
  input: {
    backgroundColor:theme.bg,
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
});
