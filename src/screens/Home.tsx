import { StyleSheet, Text, View } from "react-native"

const Home = ()=> {
    return (
        <View>
            <Text style={styles.text}>Kid Wise</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#fff'
    }
})

export default Home;
