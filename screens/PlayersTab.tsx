import * as React from 'react';
import { FlatList, View } from 'react-native';
import { get } from '../apis';
import UserPlayerRowComponent from '../components/PlayersTab/UserPlayerRowComponent';

export default class FollowersList extends React.PureComponent {
    state = {
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
                    renderItem={({ item }) => <UserPlayerRowComponent navigation={this.props.navigation} {...item} />}
                />
            </View>
        );
    }


}

