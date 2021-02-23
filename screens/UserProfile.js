import React, { Component } from "react";
import { Card, Icon } from "react-native-elements";

import {
    FlatList,
    Image,
    ImageBackground,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from "react-native";
import Colors from "../constants/Colors";
import { getUserProfile } from "../apis/";
const cover_image = require('./images/golfcover.jpg');
import FeedComponent from './shared/FeedComponent'
const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: "#FFF",
        borderWidth: 0,
        flex: 1,
        margin: 0,
        padding: 0,
    },
    container: {
        flex: 1,
    },
    emailContainer: {
        backgroundColor: "#FFF",
        flex: 1,
        paddingTop: 30,
    },
    headerBackgroundImage: {
        paddingBottom: 20,
        paddingTop: 45,
    },
    headerContainer: {},
    headerColumn: {
        backgroundColor: "transparent",
        ...Platform.select({
            ios: {
                alignItems: "center",
                elevation: 1,
                marginTop: -1,
            },
            android: {
                alignItems: "center",
            },
        }),
    },
    placeIcon: {
        color: "white",
        fontSize: 26,
    },
    scroll: {
        backgroundColor: "#FFF",
    },
    telContainer: {
        backgroundColor: "#FFF",
        flex: 1,
        paddingTop: 30,
    },
    userAddressRow: {
        alignItems: "center",
        flexDirection: "row",
    },
    userCityRow: {
        backgroundColor: "transparent",
    },
    userCityText: {
        color: "#A5A5A5",
        fontSize: 15,
        fontWeight: "600",
        textAlign: "center",
    },
    userImage: {
        borderColor: "#FFF",
        borderRadius: 85,
        borderWidth: 3,
        height: 170,
        marginBottom: 15,
        width: 170,
    },
    userNameText: {
        color: "#FFF",
        fontSize: 22,
        fontWeight: "bold",
        paddingBottom: 8,
        textAlign: "center",
    },
});

import { getProfileImage } from './shared/utils';

export default class UserProfile extends Component {



    state = {
        image:
            "https://nation.com.pk/print_images/medium/2019-10-13/4-golf-clubs-compete-to-represent-sindh-1570912179-4900.jpg",
        user: [],
        user_statuses: [],
        token: null,
        isLoggedIn: false,
    };

    async componentDidMount() {
        const { user_id } = this.props.route.params;
        const response = await getUserProfile(this, user_id);
        if (response.status) {
            const res = response.response;

            this.setState({
                user: res.user_profile[0],
            });
        }
    }


    renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <ImageBackground
                    style={styles.headerBackgroundImage}
                    blurRadius={10}
                    source={{ uri: getProfileImage('user', this.state.user.cover_image) }}
                >
                    <View style={styles.headerColumn}>
                        <Image
                            style={styles.userImage}
                            source={{ uri: this.getUserProfileImage() }}
                            s
                        />
                        <Text style={styles.userNameText}>
                            {this.state.user.first_name + ' ' + this.state.user.last_name}
                        </Text>

                        {/* <Text style={{ marginBottom: 6, color: "white" }}>
                            {" "}
                            {this.state.player.total_reviews} reviews{" "}
                        </Text> */}

                        {/* <PlayerButtonFollowComponent
                            player_id={this.state.player.player_id}
                            is_followed={this.state.player.is_followed}
                        /> */}

                        <View style={styles.userAddressRow}>
                            <View>
                                <Icon
                                    name="place"
                                    underlayColor="transparent"
                                    iconStyle={styles.placeIcon}
                                    onPress={this.onPressPlace}
                                />
                            </View>
                            <View style={styles.userCityRow}>
                                {/* <Text style={styles.userCityText}>
                                    {this.state.player.country_name}
                                </Text> */}
                            </View>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        );
    };

    renderBioText = () => {
        return (
            <ClubDescription
                club_id={this.state.club.club_id}
                club_descriptions={this.state.club_descriptions}
                navigation={this.props.navigation}
            />
        );
    };


    renderTabs() {
        return (
            <View
                style={{
                    height: 50,
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 1,
                }}
            >
                <View
                    style={{
                        justifyContent: "center",
                        flex: 1,
                        flexDirection: "row",
                        backgroundColor: Colors.green.greencolor,
                    }}
                >
                    <TouchableOpacity
                        style={{ justifyContent: "center" }}
                        onPress={() => {
                            this.props.navigation.navigate("PlayerFollowers", {
                                id: this.state.player.player_id,
                                type: 'player'
                            });
                        }}
                    >
                        <Text style={{ fontSize: 18, alignSelf: "center", color: "white" }}>{this.state.user.followers} Swaps</Text>
                    </TouchableOpacity>
                </View>

                <View
                    style={{
                        justifyContent: "center",
                        flex: 1,
                        flexDirection: "row",
                        backgroundColor: Colors.green.greencolor,
                    }}
                >
                    <TouchableOpacity
                        style={{ justifyContent: "center" }}
                        onPress={() => {
                            this.props.navigation.navigate("PlayerFollowers", {
                                id: this.state.player.player_id,
                                type: 'player'
                            });
                        }}
                    >
                        <Text style={{ fontSize: 18, alignSelf: "center", color: "white" }}>{this.state.user.followers} Followers</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    getUserProfileImage = () => {
        return getProfileImage('user', this.state.user.profile_image);
    }

    render() {
        return (
            <ScrollView style={styles.scroll}>
                <View style={styles.container}>
                    <Card containerStyle={styles.cardContainer}>
                        {this.renderHeader()}
                        {this.renderTabs()}
                        <FeedComponent navigation={this.props.navigation} type='user' id={this.state.user.user_id} />
                    </Card>
                </View>
            </ScrollView>
        );
    }
}
