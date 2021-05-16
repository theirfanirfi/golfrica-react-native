import React from 'react'
import { StyleSheet, Alert, ActivityIndicator } from 'react-native'
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
    is_requesting: false
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
    this.setState({ is_requesting: true })

    const response = await followClub(this, this.state.club_id);
    if (response.status) {
      const res = response.response;
      if (res.message.includes('Followed')) {
        this.setState({ is_followed: true, is_requesting: false })
      } else if (res.message.includes('unfollowed')) {
        this.setState({ is_followed: false, is_requesting: false })

      } else {
        this.setState({ is_requesting: false })

        Alert.alert(res.message);

      }
    }
  }

  getFollowBtn() {
    if (this.state.is_followed) {
      return (
        <Button
          icon={this.state.is_requesting ? <ActivityIndicator size="small" color="black" /> : 'close'}
          raised text="unfollow"
          backgroundColor='white'
          onPress={() => this.followClub()}
        />
      )
    } else {
      return (<Button
        icon={this.state.is_requesting ? <ActivityIndicator size="small" color="black" /> : 'add'}
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
