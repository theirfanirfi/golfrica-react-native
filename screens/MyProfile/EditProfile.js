import React, { Component } from "react";
import { Card, Icon, Input, Button } from "react-native-elements";
import * as ImagePicker from 'react-native-image-picker';
import base64 from 'react-native-base64';
import { postWithImages } from '../../apis/'
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    Image,
    ImageBackground,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert
} from "react-native";
import { get } from "../../apis/";
const cover_image = require('../images/golfcover.jpg');
const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: "#FFF",
        borderWidth: 0,
        flex: 1,
        margin: 0,
        padding: 0,
    },
    container: {
        flex: 1,
    },
    emailContainer: {
        backgroundColor: "#FFF",
        flex: 1,
        paddingTop: 30,
    },
    headerBackgroundImage: {
        paddingBottom: 20,
        paddingTop: 45,
    },
    headerContainer: {},
    headerColumn: {
        backgroundColor: "transparent",
        ...Platform.select({
            ios: {
                alignItems: "center",
                elevation: 1,
                marginTop: -1,
            },
            android: {
                alignItems: "center",
            },
        }),
    },
    placeIcon: {
        color: "white",
        fontSize: 26,
    },
    scroll: {
        backgroundColor: "#FFF",
    },
    telContainer: {
        backgroundColor: "#FFF",
        flex: 1,
        paddingTop: 30,
    },
    userAddressRow: {
        alignItems: "center",
        flexDirection: "row",
    },
    userCityRow: {
        backgroundColor: "transparent",
    },
    userCityText: {
        color: "#A5A5A5",
        fontSize: 15,
        fontWeight: "600",
        textAlign: "center",
    },
    userImage: {
        borderColor: "#FFF",
        borderRadius: 85,
        borderWidth: 3,
        height: 170,
        marginTop: 20,
        marginBottom: 15,
        width: 170,
    },
    userNameText: {
        color: "#FFF",
        fontSize: 22,
        fontWeight: "bold",
        paddingBottom: 8,
        textAlign: "center",
    },
});

import { getProfileImage } from '../shared/utils';

export default class EditProfile extends Component {



    state = {
        user: [],
        token: null,
        isLoggedIn: false,
        firstname: '',
        lastname: '',
        email: '',
        profile_description: '',
        cover_image: null,
        cover_image_upload: null,
        profile_image: null,
        profile_image_upload: null,
    }

    removeValue = async () => {
        const keys = ['user', 'token']
        try {
            await AsyncStorage.multiRemove(keys)
            this.props.navigation.reset({
                index: 0,
                routes: [{ name: 'Splash', screen: 'SplashScreen' }]
            });
        } catch (e) {
            // remove error
            Alert.alert(e);
        }

        console.log('Done.')
    }

    async chooseImage(action) {
        // const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync(writeOnly);
        //    console.log(status);
        // if (status !== 'granted') {
        //   console.log()
        //   alert('Sorry, we need camera roll permissions to make this work!');
        // }else {
        let result = await ImagePicker.launchImageLibrary({
            mediaTypes: 'photos',
            allowsEditing: true,

            aspect: [4, 3],
            quality: 1,
        });


        if (!result.cancelled) {

            let image = {
                name: 'photo.jpg',
                uri: result.uri,
                type: 'image',
                height: result.height,
                width: result.width
            };
            if (action == 'profile') {
                this.setState({ profile_image: result.uri, profile_image_upload: image });
            } else if (action == 'cover') {
                this.setState({ cover_image: result.uri, cover_image_upload: image });

            }

        }
    }

    saveChanges = async () => {
        let form = new FormData()
        if (this.state.profile_image_upload != null) {
            form.append("profile_image", this.state.profile_image_upload);

        }

        if (this.state.cover_image_upload != null) {
            form.append("cover_image", this.state.cover_image_upload);

        }


        form.append("firstname", this.state.firstname);
        form.append("lastname", this.state.lastname);
        form.append("bio", base64.encode(this.state.profile_description));
        form.append("email", this.state.email);

        let response = await postWithImages(this, 'user/my_profile', form)
        if (response.status) {
            let res = response.response
            Alert.alert(res.message);
        }
    }

    async componentDidMount() {
        const response = await get(this, 'user/my_profile');
        console.log(response)
        if (response.status) {
            this.setState({
                user: response.response,
                firstname: response.response.first_name,
                lastname: response.response.last_name,
                email: response.response.email,
                profile_description: response.response.profile_description,
            });
        }
    }


    fieldWithLabel(label, value, eventHandler) {
        return (
            <>
                <Text style={{ fontSize: 14 }}>{label}</Text>
                <Input
                    placeholder={label}
                    value={value}
                    errorStyle={{ color: 'red' }}
                    errorMessage='Can not be empty'
                // onChangeText={(text) => this.setState({})}
                />
            </>
        )
    }


    renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <ImageBackground
                    style={styles.headerBackgroundImage}
                    blurRadius={10}
                    source={{ uri: this.state.cover_image == null ? this.getUserCoverImage() : this.state.cover_image }}
                >
                    <TouchableOpacity
                        onPress={() => this.chooseImage('cover')}
                        style={{
                            position: 'absolute',
                            top: 8, alignSelf: 'center',
                            backgroundColor: 'black',
                            padding: 12,
                            borderRadius: 20,
                            opacity: 0.7
                        }}>
                        <Text style={{ alignSelf: 'center', color: 'white' }}>Change Cover Image</Text>

                    </TouchableOpacity>
                    <View style={styles.headerColumn}>
                        <Image
                            style={styles.userImage}
                            source={{ uri: this.state.profile_image == null ? this.getUserProfileImage() : this.state.profile_image }}
                            s
                        />
                        <TouchableOpacity
                            onPress={() => this.chooseImage('profile')}
                            style={{
                                position: 'absolute',
                                top: '35%', alignSelf: 'center',
                                backgroundColor: 'black',
                                padding: 12,
                                borderRadius: 20,
                                opacity: 0.7
                            }}>
                            <Text style={{ alignSelf: 'center', color: 'white' }}>Change Profile Image</Text>

                        </TouchableOpacity>
                    </View>
                </ImageBackground>

                <ScrollView style={{ padding: 12, flexDirection: 'column' }}>
                    <Text
                        style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 30 }}
                    >Profile Details
                    </Text>

                    <Text style={{ fontSize: 14, marginTop: 12 }}>Bio</Text>
                    <Input
                        inputStyle={{ height: 80 }}
                        placeholder='Bio/Description'
                        multiline={true}
                        maxLength={200}
                        value={this.state.profile_description}
                        errorStyle={{ color: 'red' }}
                        leftIcon={{ type: 'font-awesome', name: 'user-md', color: 'lightgray' }}

                        errorMessage='*'
                        onChangeText={(text) => this.setState({ profile_description: text })}
                    />

                    <Text style={{ fontSize: 14 }}>First name</Text>
                    <Input
                        placeholder='First name'
                        value={this.state.firstname}
                        errorStyle={{ color: 'red' }}
                        leftIcon={{ type: 'font-awesome', name: 'user', color: 'lightgray' }}
                        errorMessage='*'
                        onChangeText={(text) => this.setState({ firstname: text })}
                    />

                    <Text style={{ fontSize: 14, marginTop: 12 }}>Last name</Text>
                    <Input
                        placeholder='Last name'
                        value={this.state.lastname}
                        errorStyle={{ color: 'red' }}
                        leftIcon={{ type: 'font-awesome', name: 'user', color: 'lightgray' }}
                        errorMessage='*'
                        onChangeText={(text) => this.setState({ lastname: text })}
                    />

                    <Text style={{ fontSize: 14, marginTop: 12 }}>Email</Text>

                    <Input
                        placeholder='Email'
                        value={this.state.email}
                        errorStyle={{ color: 'red' }}
                        leftIcon={{ type: 'font-awesome', name: 'envelope', color: 'lightgray' }}

                        errorMessage='*'
                        onChangeText={(text) => this.setState({ email: text })}
                    />

                    <Button title="Save changes" onPress={() => this.saveChanges()} buttonStyle={{ backgroundColor: '#066E31' }} />
                    <Button title="Logout" onPress={() => this.removeValue()} status='danger' buttonStyle={{ marginVertical: 12 }} />
                </ScrollView>
            </View>
        );
    };


    getUserProfileImage = () => {
        return getProfileImage('user', this.state.user.profile_image);
    }

    getUserCoverImage = () => {
        return getProfileImage('user', this.state.user.cover_image);
    }

    render() {
        return (
            <ScrollView style={styles.scroll}>
                <View style={styles.container}>
                    <Card containerStyle={styles.cardContainer}>
                        {this.renderHeader()}
                    </Card>
                </View>
            </ScrollView>
        );
    }
}
