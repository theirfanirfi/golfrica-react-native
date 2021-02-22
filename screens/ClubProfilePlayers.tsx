import * as React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Image, View, Text } from 'react-native';
import Colors from '../constants/Colors';
import { Card } from 'react-native-paper';

import PropTypes from 'prop-types'
import { getClubPlayers } from '../apis/';
import PlayerButtonFollowComponent from './Players/PlayerButtonFollowComponent';
import PlayerRatingComponent from './Players/PlayerRatingComponent';

export default class ClubProfilePlayers extends React.Component {
    state = {
        image: 'https://nation.com.pk/print_images/medium/2019-10-13/4-golf-clubs-compete-to-represent-sindh-1570912179-4900.jpg',
        club_id: 0,
        token: null,
        players: [],
        isRefreshing: true,
    }

    static = {
        club_id: PropTypes.number
    }

    async componentDidMount() {
        const { club_id } = this.props.route.params;
        await this.setState({ club_id: club_id });
        const response = await getClubPlayers(this, this.state.club_id);
        if (response.status) {
            const res = response.response;
            this.setState({ players: res.players, isRefreshing: false });
        }
    }

    onReresh = async () => {
        this.setState({ isRefreshing: true });

        const response = await getClubPlayers(this, this.state.club_id);
        if (response.status) {
            const res = response.response;
            this.setState({ players: res.players, isRefreshing: false });
        }

    }

    renderTitle(item: any) {
        return (
            <View style={{
                flex: 1, flexDirection: 'column',
            }}>
                < View >
                    <Text style={{ fontSize: 16, fontWeight: 'bold', }}>{item.player_name}</Text>
                    <PlayerRatingComponent player_id={item.player_id} player_avg_rating={item.avg_rating} />
                </View>
                <View style={{ justifyContent: 'center' }}>
                    <Text style={{ alignSelf: 'center' }}>{item.followers} Followers</Text>
                </View>
            </ View>
        )
    }

    renderFollowIcon(player: any) {
        return <PlayerButtonFollowComponent player_id={player.player_id} is_followed={player.is_followed} />
    }

    render() {
        return (
            <View style={{ backgroundColor: 'white' }}>
                <FlatList
                    style={{ height: '100%' }}
                    keyExtractor={(item) => { return item.player_id }}
                    data={this.state.players}
                    refreshing={this.state.isRefreshing}
                    onRefresh={() => this.onReresh()}
                    renderItem={({ item }) =>
                        <TouchableOpacity style={{ margin: 4 }} onPress={() => { this.props.navigation.navigate('PlayerProfile', { player_id: item.player_id }) }}>
                            <Card style={{ padding: 6, justifyContent: 'center' }} >
                                <Card.Title
                                    title={this.renderTitle(item)}
                                    left={(props) => <Image source={{ uri: this.state.image }} style={styles.userImage} />}
                                    right={(props) => this.renderFollowIcon(item)}
                                />

                            </Card>
                        </TouchableOpacity>

                    }
                />
            </View>
        );
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
