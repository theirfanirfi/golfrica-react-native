import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Card, Icon, Input, Button } from "react-native-elements";
import { unAuthPost } from '../../apis/'
import base64 from 'react-native-base64';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default class Login extends React.Component {

    state = {
        email: 'D@d.com',
        erroMessage: '',
        password: 'irfan001',
        isLoading: false,
    }

    componentDidMount() {
        // setTimeout(() => {
        //   this.props.navigation.reset({
        //     index: 0,
        //     routes: [{ name: 'Root', screen: 'Feed' }]
        //   });

        // }, 5000)
    }

    storeUserDate = async (user, token) => {
        var tk = base64.encode(token);
        console.log('encoded token = ' + tk)
        try {
            await AsyncStorage.setItem('user', JSON.stringify(user))
            await AsyncStorage.setItem('token', tk)
        } catch (e) {
            console.log(e)
        }

    }

    login = async () => {
        this.setState({ isLoading: true })
        let form = new FormData();
        form.append("password", this.state.password);
        form.append("email", this.state.email);

        let response = await unAuthPost('user/login', form)
        if (response.status) {
            let res = response.response
            if (res.isLoggedIn) {
                console.log('token= ' + res.token)
                await this.storeUserDate(res.user, res.token);
                this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'Root', screen: 'Feed' }]
                });
            } else {
                this.setState({ isLoading: false, erroMessage: res.message })
            }
        } else {
            this.setState({ isLoading: false, erroMessage: 'Error, try again.' })
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.isLoading &&
                    <ActivityIndicator size="large" color="#066E31" />
                }

                <Text style={styles.title}>Login</Text>
                <Text style={{ color: 'red' }}>{this.state.erroMessage}</Text>
                <Input
                    placeholder='Email'
                    value={this.state.email}
                    errorStyle={{ color: 'red' }}
                    leftIcon={{ type: 'font-awesome', name: 'envelope', color: 'lightgray' }}
                    errorMessage=''
                    onChangeText={(text) => this.setState({ email: text })}
                />

                <Input
                    secureTextEntry
                    placeholder='Password'
                    value={this.state.password}
                    errorStyle={{ color: 'red' }}
                    leftIcon={{ type: 'font-awesome', name: 'lock', color: 'lightgray' }}
                    errorMessage=''
                    onChangeText={(text) => this.setState({ password: text })}
                />

                <Button
                    title="Login"
                    buttonStyle={{ backgroundColor: '#066E31', paddingHorizontal: 24 }}
                    onPress={() => this.login()}
                />
                <TouchableOpacity style={{ marginTop: 12 }}>
                    <Text style={{ fontSize: 16 }} onPress={() => this.props.navigation.navigate('Register')} >Don't have ID?</Text>
                </TouchableOpacity>

            </View>
        );
    }
}

// export default function NotFoundScreen({
//   navigation,
// }: StackScreenProps<RootStackParamList, 'NotFound'>) {


//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>This screen doesn't exist.</Text>
//       <TouchableOpacity onPress={() => navigation.replace('Root')} style={styles.link}>
//         <Text style={styles.linkText}>Go to home screen!</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

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
