import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View, TextInput, ToastAndroid } from 'react-native';
import { Image } from 'react-native';
import security from '@assets/security.png';
import { theme } from '@src/constants/colors';
import { verifyChildPinService } from '@src/services/child.service';
import { useNavigation } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";

const PinScreen = () => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputs = useRef<TextInput[]>([]);
    const navigation = useNavigation();

    const handleChange = (text: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text && index < 5) {
            inputs.current[index + 1].focus();
        }
    };

    const verifyNow = async () => {
        const userInputPin = otp.join("");
        if (userInputPin.length < 6) {
            ToastAndroid.show("PIN must be 6 digits", ToastAndroid.SHORT);
            return;
        }

        try {
            const isValid = await verifyChildPinService(userInputPin);
            if (!isValid) {
                ToastAndroid.show("Invalid PIN", ToastAndroid.SHORT);
                return;
            }
            navigation.navigate("profile" as never)
            ToastAndroid.show("PIN Verified!", ToastAndroid.SHORT);

        } catch {
            ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: 20 }}>

            <Pressable style={{position:"absolute",top:50,left:0}} onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" style={{ color: theme.darkGray }} size={30} />
            </Pressable>

            <Image source={security} style={{ width: "50%", objectFit: "contain", height: 300 }} />

            <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                    <TextInput
                        key={index}
                        ref={(ref) => { if (ref) inputs.current[index] = ref; }}
                        style={styles.otpBox}
                        keyboardType="number-pad"
                        maxLength={1}
                        value={digit}
                        secureTextEntry
                        onChangeText={(text) => handleChange(text, index)}
                        onKeyPress={({ nativeEvent }) => {
                            if (nativeEvent.key === "Backspace" && otp[index] === "") {
                                if (index > 0) inputs.current[index - 1].focus();
                                const newOtp = [...otp];
                                newOtp[index - 1] = "";
                                setOtp(newOtp);
                            }
                        }}
                    />

                ))}
            </View>

            <Pressable style={styles.primaryBtn} onPress={verifyNow}>
                <Text style={styles.primaryBtnText}>Verify Now</Text>
            </Pressable>
        </View>
    );
};

export default PinScreen;

const styles = StyleSheet.create({
    otpContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
        marginTop: -50
    },
    otpBox: {
        width: 45,
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: theme.primary,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
        color: theme.black
    },
    primaryBtn: {
        marginTop: 20,
        backgroundColor: theme.primary,
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 10,
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    primaryBtnText: { color: theme.white, fontSize: 16 },
});
