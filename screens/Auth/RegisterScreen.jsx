import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, } from 'react-native';
import { theme } from '../../color';
import { useNavigation } from '@react-navigation/core';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigation()

  const handleRegister = () => {
    nav.navigate("onboarding")
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Sign up</Text>
      <Text style={styles.subtitle}>Sign up with one of the following options.</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor={"gray"} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />

      <Text style={styles.label}>Password</Text>
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor={"gray"} secureTextEntry value={password} onChangeText={setPassword} />''

      <TouchableOpacity style={styles.btn} onPress={handleRegister}>
        <Text style={styles.btnText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>nav.navigate("login")}>
        <Text style={{ textAlign: "center", marginTop: 20, fontSize: 17, color: theme.black,fontWeight:"300"}}>Already have an account ? <Text style={{color:theme.orange,fontWeight:"400"}}>Login</Text></Text>
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
    marginTop:10
  },
  btnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
