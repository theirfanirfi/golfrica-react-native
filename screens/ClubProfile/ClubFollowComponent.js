import React from 'react'
import { StyleSheet, Alert } from 'react-native'
import { Button } from 'react-native-material-ui';


import mainColor from './constants'
import { followClub } from '../../apis/';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 25,
  },
  iconRow: {
    flex: 2,
    justifyContent: 'center',
  },
  smsIcon: {
    color: 'darkgray',
    fontSize: 20,
  },
  smsRow: {
    flex: 2,
    justifyContent: 'flex-start',
  },
  telIcon: {
    color: mainColor,
    fontSize: 30,
  },
  telNameColumn: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  telNameText: {
    color: 'gray',
    fontSize: 14,
    fontWeight: '200',
  },
  telNumberColumn: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
  telNumberText: {
    fontSize: 16,
  },
  telRow: {
    flex: 6,
    flexDirection: 'column',
    justifyContent: 'center',
  },
})

export default class ClubFollowComponent extends React.Component {

  constructor(props) {
    super(props);
  }

  state = {
    token: null,
    club_id: 0,
    is_followed: 0,
  }


  componentDidMount() {
    this.setState({
      club_id: this.props.club_id,
      is_followed: this.props.is_followed,
    })

  }

  static getDerivedStateFromProps(props, current_state) {
    if (current_state.club_id !== props.club_id && props.club_id !== undefined) {
      return {
        club_id: props.club_id,
        is_followed: props.is_followed,
      };

    }
    return null
  }

  async followClub() {
    const response = await followClub(this, this.state.club_id);
    if (response.status) {
      const res = response.response;
      if (res.isFollowed) {
        this.setState({ is_followed: true })
        Alert.alert('Club Followed.');
      } else {
        Alert.alert(res.message);
      }
    }
  }

  getFollowBtn() {
    if (this.state.is_followed) {
      return (
        <Button
          raised text="unfollow"
          backgroundColor='white'
          onPress={() => this.followClub()}
        />
      )
    } else {
      return (<Button icon='add'
        raised text="Follow"
        backgroundColor='white'
        onPress={() => this.followClub()}
      />)
    }
  }

  render() {
    console.log("is followed: " + this.state.is_followed)
    return (
      <>
        {this.getFollowBtn()}

      </>
    )
  }
}
