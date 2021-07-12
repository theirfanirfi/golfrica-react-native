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
    Alert,
    PermissionsAndroid,
} from "react-native";
import { get } from "../../apis/";
import RBSheet from "react-native-raw-bottom-sheet";

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
import { ActivityIndicator } from "react-native";



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
        change_image_selection: 'profile',
        is_requesting: true,
        facebook: '',
        instagram: '',
        twitter: '',
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

    requestExternalWritePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'External Storage Write Permission',
                        message: 'App needs write permission',
                    },
                );
                // If WRITE_EXTERNAL_STORAGE Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                alert('Write permission err', err);
            }
            return false;
        } else { return true };
    };

    requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'App needs camera permission',
                    },
                );
                // If CAMERA Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        } else { return true };
    };

    async launchImageLibrary() {
        let granted = await this.requestExternalWritePermission();
        // const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync(writeOnly);
        //    console.log(status);
        if (!granted) {
            alert('Permissions were denied.');
        } else {
            let result = await ImagePicker.launchImageLibrary({
                mediaType: 'photo',
                quality: 1,
            }, (response) => {
                if (!response.didCancel) {
                    let image = {
                        name: response.fileName,
                        uri: response.uri,
                        type: response.type,
                        height: response.height,
                        width: response.width
                    };


                    if (this.state.change_image_selection == 'profile') {
                        this.setState({ profile_image: response.uri, profile_image_upload: image });
                    } else if (this.state.change_image_selection == 'cover') {
                        this.setState({ cover_image: response.uri, cover_image_upload: image });

                    }
                }

            });
        }
    }


    async launchCamera() {
        let granted = await this.requestCameraPermission();
        // const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync(writeOnly);
        //    console.log(status);
        if (!granted) {
            alert('Permissions were denied.');
        } else {
            let result = await ImagePicker.launchCamera({
                mediaType: 'photo',
                quality: 1,
            }, (response) => {
                if (!response.didCancel) {
                    let image = {
                        name: response.fileName,
                        uri: response.uri,
                        type: response.type,
                        height: response.height,
                        width: response.width
                    };

                    if (this.state.change_image_selection == 'profile') {
                        this.setState({ profile_image: response.uri, profile_image_upload: image });
                    } else if (this.state.change_image_selection == 'cover') {
                        this.setState({ cover_image: response.uri, cover_image_upload: image });

                    }
                }

            });
        }
    }

    saveChanges = async () => {
        this.setState({ is_requesting: true });
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
        form.append("facebook", this.state.facebook);
        form.append("instagram", this.state.instagram);
        form.append("twitter", this.state.twitter);

        let response = await postWithImages(this, 'user/my_profile', form)
        if (response.status) {
            let res = response.response
            if (res.isUpdated) {
                console.log(res);
                // this.props.navigation.navigate('profile', { screen: 'PlayerProfile', params: { user_id: this.state.user.user_id } })
                // this.props.navigation.getParams('callBack')();
                // this.props.navigation.goBack()
                this.setState({ is_requesting: false }, () => this.storeUserData(res.user));



            } else {
                this.setState({ is_requesting: false });
                alert('Error occurred');
            }
        } else {
            this.setState({ is_requesting: false });
            alert('Error occurred');
        }
    }

    storeUserData = async (user) => {
        try {
            await AsyncStorage.setItem('user', JSON.stringify(user))
            this.props.route.params.onGoBack();
            this.props.navigation.goBack();
        } catch (e) {
            console.log(e)
        }

    }

    async componentDidMount() {
        const response = await get(this, 'user/my_profile/');
        console.log(response)
        if (response.status) {
            this.setState({
                user: response.response,
                firstname: response.response.first_name,
                lastname: response.response.last_name,
                email: response.response.email,
                profile_description: response.response.profile_description,
                is_requesting: false,
                facebook: response.response.facebook,
                twitter: response.response.twitter,
                instagram: response.response.instagram,
            });
        } else {
            this.setState({ is_requesting: false });
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
                        onPress={() => this.setState({ change_image_selection: 'cover' }, () => this.RBSheet.open())}
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
                            onPress={() => { this.setState({ change_image_selection: 'profile' }, () => this.RBSheet.open()) }}
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

                    <Text
                        style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 30 }}
                    >Social Media
                    </Text>

                    <Text style={{ fontSize: 14, marginTop: 12 }}>Facebook Profile Link</Text>

                    <Input
                        placeholder='Facebook Profile Link'
                        value={this.state.facebook}
                        errorStyle={{ color: 'red' }}
                        leftIcon={{ type: 'font-awesome', name: 'facebook', color: 'lightgray' }}

                        errorMessage='*'
                        onChangeText={(text) => this.setState({ facebook: text })}
                    />

                    <Text style={{ fontSize: 14, marginTop: 12 }}>Instagram Profile Link</Text>

                    <Input
                        placeholder='Instagram Profile Link'
                        value={this.state.instagram}
                        errorStyle={{ color: 'red' }}
                        leftIcon={{ type: 'font-awesome', name: 'instagram', color: 'lightgray' }}

                        errorMessage='*'
                        onChangeText={(text) => this.setState({ instagram: text })}
                    />

                    <Text style={{ fontSize: 14, marginTop: 12 }}>Twitter Profile Link</Text>

                    <Input
                        placeholder='Twitter Profile Link'
                        value={this.state.twitter}
                        errorStyle={{ color: 'red' }}
                        leftIcon={{ type: 'font-awesome', name: 'twitter', color: 'lightgray' }}

                        errorMessage='*'
                        onChangeText={(text) => this.setState({ twitter: text })}
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

        if (this.state.is_requesting) {
            return (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color='green' style={{ alignSelf: 'center' }} />
                    <Text style={{ alignSelf: 'center', fontSize: 16 }}>Changes are being made, please wait</Text>
                </View>
            )
        }

        return (
            <>
                <ScrollView style={styles.scroll}>
                    <View style={styles.container}>
                        <Card containerStyle={styles.cardContainer}>
                            {this.renderHeader()}
                        </Card>
                    </View>
                </ScrollView>

                <RBSheet
                    ref={ref => {
                        this.RBSheet = ref;
                    }}
                    height={160}
                    openDuration={250}
                    customStyles={{
                        container: {
                            justifyContent: "center",
                            alignItems: "center"
                        }
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'column',
                            justifyContent: 'flex-start', alignItems: 'flex-start',
                            padding: 12
                        }}>
                        <TouchableOpacity
                            onPress={() => this.launchCamera()}
                            style={{
                                flexDirection: 'row', justifyContent: 'flex-start',
                            }}>
                            <Icon name='camera' color='black' size={25} style={{ alignSelf: 'flex-start', marginVertical: 12 }} />
                            <Text style={{ alignSelf: 'flex-start', color: 'black', fontSize: 20, marginVertical: 12, marginLeft: 6 }}>Camera</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => this.launchImageLibrary()}
                            style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                            <Icon name='image' color='black' size={25} style={{ alignSelf: 'flex-start', marginVertical: 12 }} />
                            <Text style={{ alignSelf: 'flex-start', fontSize: 20, marginVertical: 12, marginLeft: 6 }}>Gallery</Text>
                        </TouchableOpacity>
                    </View>
                </RBSheet>
            </>
        );
    }
}
