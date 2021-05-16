import React from 'react'
import { StyleSheet, Alert } from 'react-native'
import Button from 'react-native-button';


import mainColor from './constants'
import { followClub } from '../../apis/';

import Colors from '../../constants/Colors';
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

export default class ClubFollowComponentForClubsTab extends React.Component {

  constructor(props) {
    super(props);
  }

  state = {
    token: null,
    club_id: 0,
    is_followed: false,
  }


  componentDidMount() {
    this.setState({
      club_id: this.props.club_id,
      is_followed: this.props.is_followed,
    })

  }

  static getDerivedStateFromProps(props, current_state) {
    if (current_state.is_followed !== props.is_followed && props.is_followed !== undefined) {
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
      if (res.message.includes('Followed')) {
        console.log('followed')
        this.setState({ is_followed: true })
      } else if (res.message.includes('unfollowed')) {
        console.log('unfollowed')
        this.setState({ is_followed: false })

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

            padding: 10, height: 34,
            backgroundColor: Colors.green.greencolor
          }}
          styleDisabled={{ color: 'red' }}
          onPress={() => this.followClub()}>
          unfollow
        </Button>
      )
    } else {
      return (

        <Button
          style={{ fontSize: 10, color: Colors.green.white }}
          containerStyle={{

            padding: 10, height: 34,
            backgroundColor: Colors.green.greencolor
          }}
          styleDisabled={{ color: 'red' }}
          onPress={() => this.followClub()}>
          Follow
        </Button>

      )
    }
  }

  render() {
    if (this.state.is_followed) {
      return (
        <Button
          style={{ fontSize: 10, color: Colors.green.white }}
          containerStyle={{

            padding: 10, height: 34,
            backgroundColor: Colors.green.greencolor
          }}
          styleDisabled={{ color: 'red' }}
          onPress={() => this.followClub()}>
          unfollow
        </Button>
      )
    } else {
      return (

        <Button
          style={{ fontSize: 10, color: Colors.green.white }}
          containerStyle={{

            padding: 10, height: 34,
            backgroundColor: Colors.green.greencolor
          }}
          styleDisabled={{ color: 'red' }}
          onPress={() => this.followClub()}>
          Follow
        </Button>

      )
    }
  }
}
