import * as React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class SplashScreen extends React.Component {

    state = {
        isLoading: false,
    }

    getData = async () => {
        let isLoggedIn = await AsyncStorage.getItem('token').then(item => {
            console.log(item);
            if (item !== null) {
                this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'Root', screen: 'Feed' }]
                });
            } else {
                this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'Auth', screen: 'loginscreen' }]
                });
            }
        });
    }

    async componentDidMount() {
        setTimeout(() => {
            this.getData()
        }, 3000)
    }

    login = async () => {
        this.setState({ isLoading: true })
    }
    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#066E31" />
                <Text>Checking Status</Text>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
    linkText: {
        fontSize: 14,
        color: '#2e78b7',
    },
});
