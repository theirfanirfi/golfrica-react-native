import * as React from 'react';
import {
  FlatList, TouchableOpacity, TextInput,
  ScrollView, Alert, ActivityIndicator,
  Text, View, Platform, PermissionsAndroid,
}
  from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'react-native-image-picker';
import ImageComponent from './CreateStatus/ImageComponent'
import { uploadUnPublishedStatusPicture } from '../apis';
import RBSheet from "react-native-raw-bottom-sheet";

export default class CreateStatus extends React.Component {

  state = {
    status_images: [],
    status_text: null,
    token: null,
    imagesListVisibility: false,
    status_id: 0,
    isUploading: false,
    modelVisible: false,
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

          this.setState({ status_images: images, imagesListVisibility: this.state.imagesListVisibility == false ? true : true });

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


  async publishStatus() {
    this.setState({
      isUploading: true,
    })
    let form = new FormData();

    await this.state.status_images.forEach((item, i) => {
      form.append("images[]", {
        uri: item.uri,
        type: "image/jpeg",
        name: item.name || `name${i}.jpg`,
      });
    });

    form.append("status", this.state.status_text);

    const response = await uploadUnPublishedStatusPicture(this, form);
    if (response.status) {
      const res = response.response;
      console.log(res);
      if (res.isStatusPosted) {
        this.setState({ status_images: [], status_text: null, imagesListVisibility: false, isUploading: false }, () => {
          Alert.alert('Status Posted');
          // this.props.navigation.navigate('Feed')
        })
      } else {
        this.setState({ isUploading: false })
        Alert.alert('Error occurred in posting status. try again..');

      }
    }
  }

  removePictureFromList(index, context) {
    let pictures = context.state.status_images;
    pictures.splice(index, 1);
    context.setState({ status_images: pictures });
  }

  render() {
    return (
      <>
        {this.state.isUploading &&
          <>
            <ActivityIndicator size="large" color="gree" style={{ alignSelf: 'center', marginVertical: 8 }} />
            <Text style={{ alignSelf: 'center' }}>Please wait, your status is being posted. </Text>
          </>
        }
        <ScrollView style={{ backgroundColor: 'white' }}>
          <TextInput multiline={true}
            style={{ borderWidth: .5, borderColor: 'lightgray', padding: 8, height: 140, margin: 8 }}
            onChangeText={(text) => this.setState({ status_text: text })}
            placeholder="Your status goes here"
            value={this.state.status_text}
          />
          <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'flex-end' }}>
            <TouchableOpacity
              style={{ alignSelf: 'flex-end', marginHorizontal: 12 }}
              onPress={() => this.RBSheet.open()}

            >
              <Icon name='image'
                color='green'
                size={30}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{ alignSelf: 'flex-end', marginHorizontal: 24 }}

              onPress={() => this.publishStatus()}
            >
              <Icon name='send'
                color='green'
                size={30}
              />
            </TouchableOpacity>
          </View>
          {this.state.imagesListVisibility &&
            <FlatList
              style={{ height: 400, margin: 8 }}
              data={this.state.status_images}
              keyExtractor={(item) => { return item.index }}
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



        </ScrollView>
        <RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          height={300}
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
