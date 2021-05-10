import React from 'react'
import { View, TouchableOpacity, Image, StyleSheet, Text } from 'react-native'
import Colors from '../../constants/Colors'
import { getProfileImage } from '../../screens/shared/utils'

import FollowUnFollowBtnComponent from '../FollowUnFollowBtnComponent'

interface Player {
    first_name: string,
    last_name: string,
    is_followed: number,
    user_followers: number,
    users_followed: number,
    user_id: number,
    profile_image: string
}


export default class UserPlayerRowComponent extends React.Component {
    constructor(props: Player) {
        super(props)
    }

    state = {
        token: null,
        user: [],
        player: [],
        followers: 0,
    }
    componentDidMount() {
        // const { user_followers } = this.props
        this.setState({ player: this.props, followers: this.props.user_followers });
    }

    followUnFollowCallBack = (context, action) => {
        if (action == 'follow') {
            context.setState({ followers: context.state.followers + 1 });

        } else {
            if (context.state.followers > 0) {
                context.setState({ followers: context.state.followers - 1 });

            }
        }

    }

    renderTitle(item: any) {
        return (
            <View style={{
                flexDirection: 'column',
            }}>
                < View >
                    <Text style={{ fontSize: 16, fontWeight: 'bold', }}>{item.first_name + ' ' + item.last_name}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={{ alignSelf: 'center', marginRight: 4 }}>{this.state.followers} Followers</Text>
                    <Text style={{ alignSelf: 'center', marginHorizontal: 4 }}>{item.users_followed} Followed</Text>
                </View>
            </ View>
        )
    }

    render() {
        let item = this.state.player
        return (

            <TouchableOpacity style={{ margin: 4 }} onPress={() => {
                this.props.navigation.navigate('UserProfile', { user_id: item.user_id })
            }}>
                <View style={{ padding: 6, flexDirection: 'row', flex: 1 }} >
                    <View style={{ marginHorizontal: 6, width: '15%' }}>
                        <Image source={{ uri: getProfileImage('user', item.profile_image) }} style={styles.userImage} />
                    </View>

                    <View style={{ width: '60%' }}>
                        {this.renderTitle(item)}

                    </View>

                    <View style={{ alignSelf: 'flex-end' }}>
                        <FollowUnFollowBtnComponent
                            actionCallback={this.followUnFollowCallBack}
                            is_followed={item.is_followed}
                            user_id={item.user_id}
                            context={this}

                        />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.green.greencolor,
        padding: 20,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 4,


    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    userImage: {
        borderColor: '#FFF',
        borderRadius: 25,
        borderWidth: 1,
        height: 50,
        marginBottom: 2,
        width: 50,
    },
});