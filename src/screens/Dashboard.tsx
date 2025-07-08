import KWText from "@src/components/KWText"
import { useAuth } from "@src/hooks/useAuth"
import { Button, StyleSheet, View } from "react-native"

const Dashboard = () => {
    const { signOut } = useAuth()
    return (
        <View style={styles.container}>
            <KWText>Welcome to Dashboard</KWText>
            <Button
            title="Logout"
            onPress={()=> signOut()}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
export default Dashboard