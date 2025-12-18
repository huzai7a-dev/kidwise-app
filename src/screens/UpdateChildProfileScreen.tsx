import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Image, Alert, ToastAndroid, KeyboardAvoidingView, ScrollView, Pressable } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/core';
import { useForm, Controller } from 'react-hook-form';
import { theme } from '@constants/colors';
import KWText from '@components/KWText';
import female from "@assets/onboarding/female.png";
import male from "@assets/onboarding/male.png";
import neutral from "@assets/onboarding/neutral.png";
import { AVATARS } from '@src/constants/avatars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getChildProfile, updateChildService } from '@src/services/child.service';
import Ionicons from "react-native-vector-icons/Ionicons";

interface ChildProfileFormData {
    avatar: string;
    name: string;
    age: string;
    gender: string;
    pin: string;
}

const UpdateChildProfileScreen = () => {
    const nav = useNavigation<NavigationProp<any>>();

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
            avatar: '',
            name: '',
            age: '',
            gender: '',
            pin: ''
        },
        mode: 'onChange',
    });

    const [childId, setChildId] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const storedId = await AsyncStorage.getItem("child_id");
            if (!storedId) return;

            setChildId(storedId);

            try {
                const child = await getChildProfile(storedId);

                // preload form values
                setValue("avatar", String(child.avatar_id));
                setValue("name", child.full_name);
                setValue("age", String(child.age));
                setValue("gender", child.gender);
                setValue("pin", child.pin);
            } catch (err) {
                console.log("failed loading child profile", err);
            }
        })();
    }, []);

    const onSubmit = async (data: ChildProfileFormData) => {
        try {
            if (!childId) return;

            await updateChildService(childId, data);

            ToastAndroid.show('Child profile updated successfully!', ToastAndroid.SHORT);

            nav.goBack();
        } catch (error) {
            console.log(error);
            Alert.alert("Failed to update, try again");
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <View style={{ flex: 1, paddingTop: 50 }}>

                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>

                    <Pressable style={{ marginTop: -10 }} onPress={() => nav.goBack()}>
                        <Ionicons name="chevron-back" style={{ color: theme.darkGray }} size={20} />
                    </Pressable>

                    <KWText variant="title" size={28}>Update Child Profile</KWText>

                </View>


                <ScrollView>
                    <KWText variant="heading" size={18} style={styles.sectionTitle}>Choose Avatar</KWText>

                    <Controller
                        control={control}
                        name="avatar"
                        rules={{ required: 'Please select an avatar' }}
                        render={({ field: { value } }) => (
                            <View style={styles.avatarContainer}>
                                {avatars.map((avatar, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => setValue("avatar", avatar.id, { shouldValidate: true })}
                                    >
                                        <Image source={avatar.src} style={[styles.avatarImage, value === avatar.id && styles.selectedAvatarBorder]} />
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
                        rules={{ required: 'Baby name is required' }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[styles.textInput, errors.name && styles.inputError]}
                                placeholder="Baby Name"
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />

                    <KWText variant="label">Baby Age</KWText>

                    <Controller
                        control={control}
                        name="age"
                        rules={{ required: 'Age required', pattern: { value: /^\d+$/, message: 'Must be a number' } }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[styles.textInput, errors.age && styles.inputError]}
                                placeholder="Age"
                                keyboardType="numeric"
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />

                    <KWText variant="heading" size={18}>Select Gender</KWText>

                    <Controller
                        control={control}
                        name="gender"
                        rules={{ required: 'Select gender' }}
                        render={({ field: { value } }) => (
                            <View style={styles.genderContainer}>
                                {genders.map((option) => (
                                    <TouchableOpacity
                                        key={option.value}
                                        style={[styles.genderOption, value === option.value && styles.selectedGenderOption]}
                                        onPress={() => setValue("gender", option.value, { shouldValidate: true })}
                                    >
                                        <Image source={option.icon} style={styles.genderIcon} />
                                        <KWText>{option.label}</KWText>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    />

                    <KWText variant="label">PIN</KWText>

                    <Controller
                        control={control}
                        name="pin"
                        rules={{ required: "PIN required" }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[styles.textInput, errors.pin && styles.inputError]}
                                placeholder="PIN"
                                secureTextEntry
                                keyboardType="numeric"
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />

                </ScrollView>

            </View>

            <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                disabled={!isValid}
                style={[styles.continueButton, !isValid && styles.btnDisabled]}
            >
                <KWText style={styles.continueButtonText}>Save Changes</KWText>
            </TouchableOpacity>

        </KeyboardAvoidingView>
    );
};

export default UpdateChildProfileScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.bg, paddingHorizontal: 30 },
    sectionTitle: { marginBottom: 10 },
    avatarContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
    avatarImage: { width: 80, height: 80, borderRadius: 10 },
    selectedAvatarBorder: { borderWidth: 3, borderColor: theme.primary },
    genderContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
    genderOption: { padding: 15, borderRadius: 10, backgroundColor: "#fff" },
    selectedGenderOption: { borderColor: theme.primary, borderWidth: 2 },
    genderIcon: { width: 50, height: 50 },
    textInput: { borderWidth: 1, borderColor: theme.gray, borderRadius: 10, padding: 12, marginBottom: 20, color: theme.black },
    continueButton: { backgroundColor: theme.primary, padding: 15, borderRadius: 10, alignItems: "center", marginBottom: 20 },
    continueButtonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
    inputError: { borderColor: "red" },
    btnDisabled: { opacity: 0.5 }
});
