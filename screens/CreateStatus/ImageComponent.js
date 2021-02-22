import React, { Component } from 'react'
import { TouchableOpacity, Image, Text } from 'react-native';
import PropTypes from 'prop-types'
import {uploadUnPublishedStatusPicture} from '../../apis/';

export default class ImageComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      image: {
        index: null,
        image: {
          uri: null,
          type: "image",
          height: null,
          width: null,
          name: null,
        },
      },
      context: null,
      token: null,
    };


  }

  removePictureCallBack(index){
    this.props.removePictureFromList(index, this.props.context);
  }


  static = {
    image: PropTypes.object,
    removePictureFromList: PropTypes.func,
    context: PropTypes.object,
  }

  async componentDidMount(){
    await this.setState({image: this.props.image, context: this.props.context});

  }

  render() {
    return (
      <TouchableOpacity
      onLongPress={() => {this.removePictureCallBack(this.state.image.index)}}
      style={{width: '32%', height: 130, margin:2, justifyContent: 'center'}}>
      <Image style={{height: 130, margin:2, }} source={{uri: this.state.image.image.uri}} />
      {!this.state.image.isUploaded &&
      <Text
      style={{position: 'absolute', alignSelf: 'center', color: 'white', backgroundColor: 'black',opacity: .5}}
      >Long Press to delete</Text>
    }
      </TouchableOpacity>
    )
  }
}
