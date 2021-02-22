import * as React from 'react';
import { FlatList, Image, View, Text, ActivityIndicator } from 'react-native';
import { get } from '../../apis';
import { getProfileImage } from '../shared/utils';
import SwapButton from './SwapButton'

export default class SwapWithFollowedComponent extends React.PureComponent {
    state = {
        token: null,
        followed: [],
        isLoading: true,
        isRefreshing: true,
        status_id: 0,
    }

    async componentDidMount() {
        const { status_id } = await this.props.route.params;
        this.setState({ status_id: status_id })
        const response = await get(this, 'follow/get_followed')
        if (response.status) {
            const res = response.response;
            this.setState({ isLoading: false, followed: res, isRefreshing: false });
        }
    }


    onRefresh = async () => {
        // this.setState({ isRefreshing: true });
        // const response = await getFollowersForFollowersScreens(this, this.state.type, this.state.id)
        // if (response.status) {
        //     const res = response.response;
        //     this.setState({ loading: false, followers: res.followers, isRefreshing: false });
        // }
        // }

    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{ width: '100%', justifyContent: 'center', flexDirection: 'column', flex: 1, alignContent: 'center' }}>
                    <ActivityIndicator size="large" color="green" style={{ alignSelf: 'center' }} />
                </View>
            )
        }
        return (
            <View style={{ backgroundColor: 'white', height: '100%' }}>
                <FlatList
                    data={this.state.followed}
                    refreshing={this.state.isRefreshing}
                    onRefresh={() => this.onRefresh()}
                    keyExtractor={(item) => { return item.f_id; }}
                    renderItem={({ item }) => {
                        return (

                            <View style={{ padding: 6, flex: 1, flexDirection: 'row', justifyContent: 'space-between' }} >
                                <Image
                                    style={{ width: 60, height: 60, borderRadius: 60 }}
                                    source={{ uri: getProfileImage('user', item.profile_image) }}
                                />
                                <Text style={{ fontSize: 18, alignSelf: 'center', position: 'absolute', left: 80 }}>{item.username}</Text>
                                <SwapButton status_id={this.state.status_id} swap_with_id={item.user_id} />
                            </View>
                        )

                    }
                    }
                />
            </View>
        );
    }


}
