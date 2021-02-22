import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Input, Button } from "react-native-elements";
import AsyncStorage from '@react-native-async-storage/async-storage';
import base64 from 'react-native-base64';
import { unAuthPost } from '../../apis/'
export default class Register extends React.Component {

    state = {
        email: '',
        erroMessage: '',
        password: '',
        isLoading: false,
        firstname: '',
        lastname: '',
    }

    storeUserDate = async (user, token) => {
        var tk = base64.encode(token);
        try {
            await AsyncStorage.setItem('user', JSON.stringify(user))
            await AsyncStorage.setItem('token', tk)
        } catch (e) {
            // save error
        }

    }

    componentDidMount() {
    }

    register = async () => {
        this.setState({ isLoading: true })

        let form = new FormData();
        form.append("firstname", this.state.firstname);
        form.append("lastname", this.state.lastname);
        form.append("password", this.state.password);
        form.append("email", this.state.email);

        let response = await unAuthPost('user/signup', form)
        if (response.status) {
            let res = response.response
            if (res.isRegistered) {
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

                <Text style={styles.title}>Register</Text>
                <Text style={{ color: 'red' }}>{this.state.erroMessage}</Text>
                <Input
                    placeholder='First name'
                    value={this.state.firstname}
                    errorStyle={{ color: 'red' }}
                    leftIcon={{ type: 'font-awesome', name: 'user', color: 'lightgray' }}
                    errorMessage='*'
                    onChangeText={(text) => this.setState({ firstname: text })}
                />

                <Input
                    placeholder='Last name'
                    value={this.state.lastname}
                    errorStyle={{ color: 'red' }}
                    leftIcon={{ type: 'font-awesome', name: 'user', color: 'lightgray' }}
                    errorMessage='*'
                    onChangeText={(text) => this.setState({ lastname: text })}
                />

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
                    title="Register"
                    buttonStyle={{ backgroundColor: '#066E31', paddingHorizontal: 24 }}
                    onPress={() => this.register()}
                />
                <TouchableOpacity style={{ marginTop: 12 }} onPress={() => this.props.navigation.navigate('login')}>
                    <Text style={{ fontSize: 16 }}>Have ID?</Text>
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
        fontSize: 24,
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
