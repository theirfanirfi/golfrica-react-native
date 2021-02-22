import React from 'react'
import { StyleSheet, Alert } from 'react-native'
import { Icon } from 'react-native-elements'
import PropTypes from 'prop-types'
import Button from 'react-native-button';

import {followPlayer} from '../../apis/';

import Colors from '../../constants/Colors';

export default class PlayerButtonFollowComponent extends React.Component {

  constructor(props){
    super(props);
  }

  state = {
        token: null,
      player_id: 0,
      is_followed: 0,
  }


  async componentDidMount(){
      await this.setState({
          player_id: this.props.player_id,
          is_followed: this.props.is_followed,
      })

  }

      static getDerivedStateFromProps(props, current_state) {
    if (current_state.player_id !== props.player_id && props.player_id !== undefined) {
      return {
        player_id: props.player_id,
          is_followed: props.is_followed,
      };

    }
    return null
  }

      async followPlayer() {
        const response = await followPlayer(this, this.state.player_id);
       if(response.status){
          const res = response.response;
              this.setState({is_followed: res.isFollowed})
              Alert.alert(res.message);
      }
    }

    getFollowBtn(){
        if(this.state.is_followed){
            return(
                                                <Button
                                    style={{ fontSize: 10, color: Colors.green.white }}
                                    containerStyle={{

                                        padding: 10, height: 34,
                                        backgroundColor: Colors.green.greencolor
                                    }}
                                    styleDisabled={{ color: 'red' }}
                                    onPress={() => this.followPlayer()}>
                                    unfollow
                                </Button> 
            )
        }else{
return (

                                <Button
                                    style={{ fontSize: 10, color: Colors.green.white }}
                                    containerStyle={{

                                        padding: 10, height: 34,
                                        backgroundColor: Colors.green.greencolor
                                    }}
                                    styleDisabled={{ color: 'red' }}
                                    onPress={() => this.followPlayer()}>
                                    Follow
                                </Button> 
        
        )
        }
    }

render() {

  return (
      <>
      {this.getFollowBtn()}

      </>
  )
}
}
