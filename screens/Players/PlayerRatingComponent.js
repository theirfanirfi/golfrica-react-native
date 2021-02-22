import React from 'react'
import { StyleSheet, Text, TouchableOpacity, FlatList, ScrollView, View, TextInput, Button, Image, Platform, Alert } from 'react-native'
import { Icon } from 'react-native-elements'
import PropTypes from 'prop-types'
import {ratePlayer} from '../../apis/';
import base64 from 'react-native-base64';
import { AirbnbRating } from 'react-native-ratings';

import Modal, { ModalContent, FadeAnimation, ModalTitle, ModalFooter, ModalButton } from 'react-native-modals';

export default class PlayerRatingComponent extends React.Component {

  constructor(props){
    super(props);
  }

  state = {
              dialogVisibility: false,
        rating: 0,
        value: null,
        token: null,
        isCommented: false,
      player_id: 0,
      player_avg_rating: 0,
  }

      setRatingAndShowCommentBox = rating => {
        this.setState({ dialogVisibility: true, rating: rating });
    }
    setRating = rating => {
        this.setState({ rating: rating });

    }

  componentDidMount(){
      this.setState({
          player_id: this.props.player_id,
          player_avg_rating: this.props.player_avg_rating,
      })

  }

      static getDerivedStateFromProps(props, current_state) {
    if (current_state.player_id !== props.player_id && props.player_id !== undefined) {
      return {
        player_id: props.player_id,
          player_avg_rating: props.player_avg_rating,

      };

    }
    return null
  }

      async ratePlayer() {
        let data = {
            rating_stars: this.state.rating,
            review: this.state.value,
        }

        let jsonData = JSON.stringify(data);
        let encodedData = base64.encode(jsonData);
        let formdata = new FormData();
        formdata.append("data", encodedData);
        const response = await ratePlayer(this, this.state.player_id, formdata);
       if(response.status){
          const res = response.response;
          if(res.isRated){
              this.setState({player_avg_rating: res.message, dialogVisibility: false});
              Alert.alert('Player rated.');
          }else{
              Alert.alert(res.message);
          }
      }
    }


render() {

  return (
                  <View>
                <Modal
                    width={0.8}
                    style={{ width: '100%' }}
                    visible={this.state.dialogVisibility}
                    onTouchOutside={() => {
                        this.setState({ dialogVisibility: false });
                    }}
                    modalAnimation={new FadeAnimation({
                        initialValue: 0, // optional
                        animationDuration: 150, // optional
                        useNativeDriver: true, // optional
                    })}
                    modalTitle={<ModalTitle title="Rate and Review" />}
                    swipeDirection={['down', 'up']} // can be string or an array
                    swipeThreshold={200} // default 100
                >
                    <ModalContent>
                        <TextInput multiline={true} style={{ borderColor: 'gray', borderWidth: 0.5, height: 80, marginTop: 8, padding: 8 }} numberOfLines={6}
                            value={this.state.value} onChangeText={(text) => this.setState({ value: text })} />
                        <AirbnbRating
                            count={5}
                            defaultRating={this.state.rating}
                            showRating={false}
                            size={17}
                            onFinishRating={(rating) => { this.setRating(rating); }}
                            starStyle={{ marginTop: 12, marginBottom: 12, marginHorizontal: 6 }}

                        />
                    </ModalContent>
                    <ModalFooter>
                        <ModalButton text="Cancel" onPress={() => { this.setState({ dialogVisibility: false }); }} />
                        <ModalButton text="Rate" onPress={() => { this.ratePlayer(); }} />

                    </ModalFooter>
                </Modal>


                <AirbnbRating
                    count={5}
                    defaultRating={this.state.player_avg_rating}
                    showRating={false}
                    size={15}
                    onFinishRating={(rating) => { this.setRatingAndShowCommentBox(rating); }}
                    starStyle={{ marginHorizontal: 4 }}

                />
            </View>
  )
}
}
