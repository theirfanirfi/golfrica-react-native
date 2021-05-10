import * as React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Image, View, Text, Alert } from 'react-native';
import Colors from '../constants/Colors';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { get, followUser } from '../apis';
import { getProfileImage } from './shared/utils'
import FollowUnFollowBtnComponent from '../components/FollowUnFollowBtnComponent'
import UserPlayerRowComponent from '../components/PlayersTab/UserPlayerRowComponent';

export default class FollowersList extends React.PureComponent {
    state = {
        image: 'https://nation.com.pk/print_images/medium/2019-10-13/4-golf-clubs-compete-to-represent-sindh-1570912179-4900.jpg',
        token: null,
        players: [],
        loading: true,
        isRefreshing: true,
        user: []
    }

    async componentDidMount() {
        this.getPlayers();
    }

    async getPlayers() {
        const response = await get(this, `player/`)
        if (response.status) {
            const res = response.response;
            this.setState({ loading: false, players: res.players, isRefreshing: false });
        }
    }

    onRefresh = async () => {
        this.setState({ isRefreshing: true }, () => this.getPlayers());
    }

    render() {
        return (
            <View style={{ backgroundColor: 'white', height: '100%' }}>
                <FlatList
                    data={this.state.players}
                    refreshing={this.state.isRefreshing}
                    onRefresh={() => this.onRefresh()}
                    keyExtractor={(item) => { return item.f_id; }}
                    renderItem={({ item }) => <UserPlayerRowComponent {...item} />}
                />
            </View>
        );
    }


}

