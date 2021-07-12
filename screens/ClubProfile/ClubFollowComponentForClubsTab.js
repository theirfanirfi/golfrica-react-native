import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import Button from 'react-native-button';
import { followClub } from '../../apis/';
import Colors from '../../constants/Colors';


export default class ClubFollowComponentForClubsTab extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    token: null,
    club_id: 0,
    is_followed: false,
  };

  componentDidMount() {
    this.setState({
      club_id: this.props.club_id,
      is_followed: this.props.is_followed,
    });
  }

  static getDerivedStateFromProps(props, current_state) {
    if (
      current_state.club_id !== props.club_id &&
      props.club_id !== undefined
    ) {
      return {
        club_id: props.club_id,
        is_followed: props.is_followed,
      };
    }
    return null;
  }

  async followClub() {
    const response = await followClub(this, this.state.club_id);
    if (response.status) {
      const res = response.response;
      if (res.message.includes('Followed')) {
        console.log('followed');
        this.setState({ is_followed: true });
      } else if (res.message.includes('unfollowed')) {
        console.log('unfollowed');
        this.setState({ is_followed: false });
      } else {
        Alert.alert(res.message);
      }
      // Alert.alert(res.message);
    }
  }

  getFollowBtn() {
    if (this.state.is_followed) {
      return (
        <Button
          style={{ fontSize: 10, color: Colors.green.white }}
          containerStyle={{
            padding: 10,
            height: 34,
            backgroundColor: Colors.green.greencolor,
          }}
          styleDisabled={{ color: 'red' }}
          onPress={() => this.followClub()}>
          unfollow
        </Button>
      );
    } else {
      return (
        <Button
          style={{ fontSize: 10, color: Colors.green.white }}
          containerStyle={{
            padding: 10,
            height: 34,
            backgroundColor: Colors.green.greencolor,
          }}
          styleDisabled={{ color: 'red' }}
          onPress={() => this.followClub()}>
          Follow
        </Button>
      );
    }
  }

  render() {
    if (this.state.is_followed) {
      return (
        <Button
          style={{ fontSize: 10, color: Colors.green.white }}
          containerStyle={{
            padding: 10,
            height: 34,
            backgroundColor: Colors.green.greencolor,
          }}
          styleDisabled={{ color: 'red' }}
          onPress={() => this.followClub()}>
          unfollow
        </Button>
      );
    } else {
      return (
        <Button
          style={{ fontSize: 10, color: Colors.green.white }}
          containerStyle={{
            padding: 10,
            height: 34,
            backgroundColor: Colors.green.greencolor,
            alignSelf: 'flex-end'
          }}
          styleDisabled={{ color: 'red' }}
          onPress={() => this.followClub()}>
          Follow
        </Button>
      );
    }
  }
}
