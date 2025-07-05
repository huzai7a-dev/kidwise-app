import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { theme } from '../../color';
import avatar1 from "../../assets/onboarding/avatar1.png";
import avatar2 from "../../assets/onboarding/avatar2.png";
import avatar3 from "../../assets/onboarding/avatar3.png";
import female from "../../assets/onboarding/female.png";
import male from "../../assets/onboarding/male.png";
import neutral from "../../assets/onboarding/neutral.png";
import { useNavigation } from '@react-navigation/core';

const ChildProfileScreen = () => {
  const [selectedAvatar, setSelectedAvatar] = useState(avatar2);
  const [babyName, setBabyName] = useState('');
  const [babyAge, setBabyAge] = useState(5);
  const [selectedGender, setSelectedGender] = useState(null);
  const nav = useNavigation()

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Create Your Child Profile</Text>
      <Text style={styles.headerSubtitle}>Setup to Continue</Text>

      <Text style={styles.sectionTitle}>Choose Avatar</Text>
      <View style={styles.avatarContainer}>
        {[avatar1, avatar2, avatar3].map((avatar, index) => (
          <TouchableOpacity key={index} onPress={() => setSelectedAvatar(avatar)}>
            <Image source={avatar} style={[styles.avatarImage, selectedAvatar === avatar && styles.selectedAvatarBorder]} />
            {selectedAvatar === avatar && (
              <View style={styles.selectedCheckmarkContainer}>
                <Text style={styles.selectedCheckmark}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Baby Name</Text>
      <TextInput style={styles.textInput} placeholder="Baby Name" placeholderTextColor="gray" value={babyName} onChangeText={setBabyName}/>

      <Text style={styles.label}>Baby Age</Text>
      <TextInput style={styles.textInput} placeholder="Baby Age" placeholderTextColor="gray" keyboardType="numeric" value={String(babyAge)} onChangeText={(val) => setBabyAge(Number(val))}/>

      <Text style={styles.sectionTitle}>Select Gender</Text>
      <View style={styles.genderContainer}>
        {[{ label: 'Female', value: 'female', icon: female },{ label: 'Male', value: 'male', icon: male },{ label: 'Other', value: 'neutral', icon: neutral },].map((option, index) => (
          <TouchableOpacity key={index} style={[styles.genderOption,selectedGender === option.value && styles.selectedGenderOption,]} onPress={() => setSelectedGender(option.value)}>
            <Image source={option.icon} style={styles.genderIcon} />
            <Text style={styles.genderText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={()=>nav.navigate("login")} style={styles.continueButton}>
        <Text style={styles.continueButtonText}>Save</Text>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: theme.black,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.black,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: theme.black,
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
  label: {
    fontSize: 17,
    marginBottom: 8,
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
    fontSize: 16,
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
});
