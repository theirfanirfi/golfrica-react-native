import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { Icon, Button } from 'react-native-elements'
import { followUser } from '../apis/index'
import Colors from '../constants/Colors'

interface User {
    actionCallBack: Function,
    context: any,
    is_followed: undefined,
    user_id: number
}


export default class FollowUnFollowBtnComponent extends React.Component {

    constructor(props: User) {
        super(props)
    }

    state = {
        token: null,
        user: [],
        is_followed: 0,
    }
    componentDidMount() {
        this.setState({ is_followed: this.props.is_followed });
    }

    followUnFollowUser = async () => {
        const response = await followUser(this, this.props.user_id)
        if (response.status) {
            const res = response.response
            console.log(res);
            if (res.isFollowed) {
                if (res.message.includes('unfollowed')) {
                    // if (this.props.actionCallBack != null) {
                    this.props.actionCallback(this.props.context, 'unfollow');
                    // }



                    this.setState({ is_followed: 0 });
                } else {

                    // if (this.props.actionCallback != null) {
                    this.props.actionCallback(this.props.context, 'follow');
                    // }


                    this.setState({ is_followed: 1 });
                }
            }
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (state.is_followed != props.is_followed && props.is_followed != undefined && state.is_followed == undefined) {
            return {
                is_followed: props.is_followed
            }
        }
        return null
    }

    render() {

        return (

            <View>
                {this.state.is_followed > 0 ? (
                    <Button buttonStyle={{ backgroundColor: Colors.green.greencolor }} title="Unfollow" type="solid" onPress={() => this.followUnFollowUser()} />
                ) : (
                    <Button buttonStyle={{ borderColor: Colors.green.greencolor }} titleStyle={{ color: Colors.green.greencolor }} title="Follow   " type="outline" onPress={() => this.followUnFollowUser()} />

                )}
            </View>
        )
    }
}
