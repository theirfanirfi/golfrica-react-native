import * as React from 'react';
import { StyleSheet, FlatList, Image, TouchableHighlight, Text, View } from 'react-native';
import Colors from '../constants/Colors';

import { AirbnbRating } from 'react-native-ratings';
import { Icon } from 'react-native-material-ui';
import { getClubs, get } from '../apis/';
import ClubRatingComponent from './ClubProfile/ClubRatingComponent';
import ClubFollowComponentForClubsTab from './ClubProfile/ClubFollowComponentForClubsTab';


export default class Clubs extends React.Component {
    state = {
        clubs: [],
        country_id: 0,
        user: [],
        token: null,
        isLoggedIn: false,
        isRefreshing: true,
        image: 'https://nation.com.pk/print_images/medium/2019-10-13/4-golf-clubs-compete-to-represent-sindh-1570912179-4900.jpg'
    }

    goToClub = id => {
        this.props.navigation.navigate('SingleClub', { club_id: id });
    }
    fetchClubs = async (country_id) => {
        let res = await get(this, `clubs/country_clubs/${country_id}`);
        if (res.status) {
            this.setState({
                country_id: country_id,
                clubs: res.response.clubs,
                isRefreshing: false
            })
        }
    }

    async componentDidMount() {
        let { country_id } = await this.props.route.params
        this.fetchClubs(country_id)
    }

    onRefresh = async () => {
        await this.setState({ isRefreshing: true })
        this.fetchClubs(this.state.country_id);

    }

    render() {
        return (
            <View style={{ backgroundColor: 'white' }}>
                {/* <ImageHeaderScrollView
                    maxHeight={150}
                    minHeight={150}
                    renderForeground={() => (
                        <View style={{ height: 250, alignItems: 'center' }} >
                            <Image style={{ width: '100%', height: '100%' }}
                                source={{ uri: 'https://nation.com.pk/print_images/medium/2019-10-13/4-golf-clubs-compete-to-represent-sindh-1570912179-4900.jpg' }} />
                        </View>
                    )}
                /> */}

                <FlatList
                    style={{ height: '78%', width: '100%' }}
                    data={this.state.clubs}
                    refreshing={this.state.isRefreshing}
                    onRefresh={() => this.onRefresh()}
                    keyExtractor={(item) => { return item.club_id; }}
                    renderItem={({ item }) => (
                        <View style={{
                            flex: 1, shadowColor: 'black', shadowOpacity: 0.3, padding: 10, borderRadius: 20,
                            flexDirection: 'row', alignItems: 'center', elevation: 3, alignContents: 'center',
                            marginHorizontal: 8, marginVertical: 8,
                        }}>

                            <View style={{ flexDirection: 'column' }}>
                                <TouchableHighlight style={{ alignSelf: 'flex-start' }} onPress={() => this.goToClub(item.club_id)}>
                                    <Image style={styles.image} source={{ uri: this.state.image }} />
                                </TouchableHighlight>
                            </View>


                            <View style={{ flexDirection: 'column', marginHorizontal: 10 }}>
                                <TouchableHighlight style={{ alignSelf: 'stretch' }} onPress={() => this.goToClub(item.club_id)}>
                                    <Text style={styles.title}>{item.club_name}</Text>
                                </TouchableHighlight>

                                <ClubRatingComponent avg_rating={item.avg_rating} club_id={item.club_id} />

                                <Text onPress={() => this.goToClub(1)}>{item.total_reviews} Reviews</Text>

                                <View style={{ alignSelf: 'flex-start', flexDirection: 'row', marginTop: 6 }}>
                                    <Icon name="people-outline" />
                                    <Text style={{ marginTop: 2 }}> {item.followers}</Text>

                                </View>

                            </View>

                            <View style={{
                                flexDirection: 'row', alignSelf: 'stretch',
                                justifyContent: 'space-evenly', alignItems: 'center', marginLeft: 40
                            }}>

                                <ClubFollowComponentForClubsTab club_id={item.club_id} is_followed={item.is_followed} />
                            </View>

                        </View>
                    )
                    }
                />


            </View >
        );
    }

}

const styles = StyleSheet.create({

    image: {
        width: 100,
        height: 90,
        margin: 4,

    },
    box: {
        padding: 20,
        marginTop: 5,
        marginLeft: 8,
        marginRight: 8,
        flexDirection: 'row',
        backgroundColor: Colors.green.greencolor,
        borderRadius: 8

    },
    boxContent: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginLeft: 10,
        color: '#fff',
        backgroundColor: Colors.green.greencolor
    },
    title: {
        fontSize: 15,
        color: "#000",
        fontWeight: 'bold',
        marginTop: 8,
    },
    description: {
        fontSize: 15,
        color: "#fff",
        marginBottom: 8
    },
    buttons: {
        flexDirection: 'row',
        backgroundColor: Colors.green.greencolor,
        marginTop: 4
    },
    button: {
        height: 35,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        width: 50,
        marginRight: 5,
        marginTop: 5,
        backgroundColor: Colors.green.greencolor

    },
    icon: {
        width: 20,
        height: 20,
    },
    view: {
        backgroundColor: "#eee",
    },
    profile: {
        backgroundColor: "#1E90FF",
    },
    message: {
        backgroundColor: "#228B22",
    },
});
