import React from 'react'
import {
    Text,
    TouchableOpacity,
    FlatList,
    ScrollView,
    View,
    TextInput,
    Button,
    Alert,
    PermissionsAndroid,
    Platform,
    ActivityIndicator
} from 'react-native'
import { Icon } from 'react-native-elements'
import { updateClubDescription, getClubDescriptions, endpoint } from '../../apis/';
import base64 from 'react-native-base64';
import * as ImagePicker from 'react-native-image-picker';
import ImageComponent from '../CreateStatus/ImageComponent'
import { DescriptionImagesFlatList } from './ClubDescriptionComponents.js'
import RBSheet from "react-native-raw-bottom-sheet";
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default class EditDescription extends React.Component {

    constructor(props) {
        super(props);
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
                    let images = this.state.status_images;
                    let image = {
                        name: response.fileName,
                        uri: response.uri,
                        type: response.type,
                        height: response.height,
                        width: response.width
                    };
                    images.push(image);

                    this.setState({
                        status_images: images,
                        imagesListVisibility: this.state.imagesListVisibility == false ? true : true
                    });

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
                    let images = this.state.status_images;
                    let image = {
                        name: response.fileName,
                        uri: response.uri,
                        type: response.type,
                        height: response.height,
                        width: response.width
                    };
                    images.push(image);

                    this.setState({ status_images: images, imagesListVisibility: this.state.imagesListVisibility == false ? true : true });

                }

            });
        }
    }

    state = {
        description: null,
        token: null,
        club_id: 0,
        club_descriptions: [],
        status_images: [],
        imagesListVisibility: false,
        isLoading: false,
    }

    componentDidMount() {
        const { club_id } = this.props.route.params;
        this.setState({
            club_id: club_id
        })

        this.getDescriptions(club_id);
    }

    async getDescriptions(cid) {
        const response = await getClubDescriptions(this, cid)
        if (response.status) {
            const res = response.response
            this.setState({
                club_descriptions: res.club_descriptions
            })
        }
    }


    saveDescription = async () => {
        this.setState({ isLoading: true })
        let form = new FormData();
        let encodedDescription = base64.encode(this.state.description);

        await this.state.status_images.forEach((item, i) => {
            form.append("images[]", {
                uri: item.uri,
                type: "image/jpeg",
                name: item.name || `name${i}.jpg`,
            });
        });

        form.append("desc", encodedDescription);


        const response = await updateClubDescription(this, this.state.club_id, form)

        if (response.status) {
            const res = response.response;
            if (res.isUpdated) {
                Alert.alert('Description updated');
                this.setState({ imagesListVisibility: false, description: '', isLoading: false })
            } else {
                Alert.alert(res.message);
            }
        }

    }

    removePictureFromList(index, context) {
        let pictures = context.state.status_images;
        pictures.splice(index, 1);
        context.setState({ status_images: pictures, imagesListVisibility: pictures.length == 0 ? false : true });
    }

    render() {

        return (
            <>

                {this.state.isLoading &&
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 12 }}>
                        <ActivityIndicator size="large" color='green' />
                        <Text>Your description is being uploaded....</Text>
                    </View>
                }
                <ScrollView style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white', height: '100%' }}>


                    <View style={{ flex: 1, flexDirection: 'column', paddingHorizontal: 12, marginTop: 12 }}>
                        <TextInput onChangeText={(text) => this.setState({ description: text })} multiline={true}
                            style={{ borderWidth: .5, borderColor: 'lightgray', height: 200 }} />

                        <View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 12, marginTop: 12 }}>


                            <Button title="Save" onPress={() => this.saveDescription()} />

                            <TouchableOpacity
                                style={{ alignSelf: 'flex-end', marginHorizontal: 12 }}
                                onPress={() => this.RBSheet.open()}
                            >
                                <Icon name='image'
                                    color='green'
                                    size={30}
                                />

                            </TouchableOpacity>

                        </View>
                    </View>

                    {this.state.imagesListVisibility &&
                        <FlatList
                            style={{ height: 400, margin: 8 }}
                            data={this.state.status_images}
                            keyExtractor={(item) => {
                                return item.index
                            }}
                            numColumns={3}
                            renderItem={(item) => {
                                const image = item.item
                                return (
                                    <ImageComponent
                                        status_id={this.state.status_id}
                                        image={{ index: item.index, image: image }}
                                        context={this}
                                        removePictureFromList={this.removePictureFromList}
                                    />
                                )
                            }}
                        />
                    }

                    {this.state.club_descriptions.length > 0 &&
                        <FlatList
                            data={this.state.club_descriptions}
                            keyExtractor={(item) => {
                                return item.des_id
                            }}
                            renderItem={(item) => {
                                const des = item.item

                                return (
                                    <View style={{ flex: 1, flexDirection: 'column', paddingHorizontal: 12, marginTop: 12 }}>
                                        <View>
                                            <Text style={{ color: 'green' }}>@{des.first_name}</Text>
                                            <Text style={{ textAlign: 'justify' }}>
                                                {des.des_text}

                                            </Text>
                                            {des.des_media != "" &&
                                                <DescriptionImagesFlatList media={des.des_media} />
                                            }

                                        </View>
                                    </View>

                                )
                            }}
                        />
                    }


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
        )
    }
}
