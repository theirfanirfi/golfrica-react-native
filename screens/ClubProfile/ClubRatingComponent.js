import React from 'react'
import { View, TextInput, Alert } from 'react-native'
import { rateClub } from '../../apis/';
import base64 from 'react-native-base64';
import { AirbnbRating } from 'react-native-ratings';

import Modal, { ModalContent, FadeAnimation, ModalTitle, ModalFooter, ModalButton } from 'react-native-modals';

export default class ClubRatingComponent extends React.Component {

  constructor(props) {
    super(props);
  }

  state = {
    dialogVisibility: false,
    rating: 0,
    value: null,
    token: null,
    isCommented: false,
    club_id: 0,
    club_avg_rating: 0,
  }

  setRatingAndShowCommentBox = rating => {
    this.setState({ dialogVisibility: true, rating: rating });
  }
  setRating = rating => {
    this.setState({ rating: rating });

  }

  componentDidMount() {
    this.setState({
      club_id: this.props.club_id,
      club_avg_rating: this.props.club_avg_rating,
    })

  }

  static getDerivedStateFromProps(props, current_state) {
    if (current_state.club_id !== props.club_id && props.club_id !== undefined) {
      return {
        club_id: props.club_id,
        club_avg_rating: props.club_avg_rating,

      };

    }
    return null
  }

  async rateStatus() {
    let data = {
      rating_stars: this.state.rating,
      review: this.state.value,
    }

    let jsonData = JSON.stringify(data);
    let encodedData = base64.encode(jsonData);
    let formdata = new FormData();
    formdata.append("data", encodedData);
    const response = await rateClub(this, this.state.club_id, formdata);
    if (response.status) {
      const res = response.response;
      if (res.isRated) {
        this.setState({ club_avg_rating: res.message, dialogVisibility: false });
        Alert.alert('Club rated.');
      } else {
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
          modalTitle={<ModalTitle title="Review" />}
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
            <ModalButton text="Rate" onPress={() => { this.rateStatus(); }} />

          </ModalFooter>
        </Modal>


        <AirbnbRating
          count={5}
          defaultRating={this.state.club_avg_rating}
          showRating={false}
          size={15}
          onFinishRating={(rating) => { this.setRatingAndShowCommentBox(rating); }}
          starStyle={{ marginHorizontal: 4 }}

        />
      </View>
    )
  }
}
