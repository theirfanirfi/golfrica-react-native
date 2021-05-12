import React, { Component } from "react";
import { Button, Icon } from "react-native-elements";

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
        height: 100,
        marginBottom: 0,
        width: 100,
    },
    userNameText: {
        color: "#000",
        fontSize: 22,
        fontWeight: "bold",
        paddingBottom: 8,
        textAlign: "center",
    },
});

import { getProfileImage } from './shared/utils';
import { CollapsibleHeaderScrollView } from 'react-native-collapsible-header-views'
import FollowUnFollowBtnComponent from '../components/FollowUnFollowBtnComponent'
export default class UserProfile extends Component {



    state = {
        image:
            "https://nation.com.pk/print_images/medium/2019-10-13/4-golf-clubs-compete-to-represent-sindh-1570912179-4900.jpg",
        profile: [],
        user: [],
        user_statuses: [],
        token: null,
        isLoggedIn: false,
        followers: 0
    };

    async componentDidMount() {
        const { user_id } = this.props.route.params;
        const response = await getUserProfile(this, user_id);
        console.log(response)
        if (response.status) {
            const res = response.response;
            let profile = res.user_profile[0]
            this.setState({
                profile: profile,
                followers: profile.followers,

            });
        }
    }

    onFollowUnfollow = (context, action) => {
        if (action == "follow") {
            context.setState({ followers: context.state.followers + 1 })
        } else {
            if (context.state.followers > 0) {
                context.setState({ followers: context.state.followers - 1 })

            }
        }
    }




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
                        <Text style={{ fontSize: 18, alignSelf: "center", color: "white" }}>{this.state.profile.followers} Swaps</Text>
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
                        <Text style={{ fontSize: 18, alignSelf: "center", color: "white" }}>{this.state.profile.followers} Followers</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    getUserProfileImage = () => {
        return getProfileImage('user', this.state.profile.profile_image);
    }

    render() {
        return (
            // <ScrollView style={styles.scroll}>
            //     {/* <View style={styles.container}>
            //         <Card containerStyle={styles.cardContainer}>
            //             {this.renderHeader()}
            //             {this.renderTabs()}
            //             <FeedComponent navigation={this.props.navigation} type='user' id={this.state.user.user_id} />
            //         </Card>
            //     </View> */}
            // </ScrollView>

            <CollapsibleHeaderScrollView
                CollapsibleHeaderComponent={
                    <View>
                        <View style={{
                            flexDirection: 'row'
                        }}>
                            <Image style={{ height: 120, position: 'absolute', left: 0, top: -12, width: '100%' }} source={{ uri: getProfileImage('user', this.state.profile.cover_image) }} />


                            <View style={{
                                flex: 1,
                                flexDirection: 'column',
                                bottom: -52

                            }}>
                                <Image
                                    style={styles.userImage}
                                    source={{ uri: this.getUserProfileImage() }}
                                />
                                <Text style={{ fontSize: 20, marginLeft: 12 }}>
                                    {this.state.profile.first_name + ' ' + this.state.profile.last_name}
                                </Text>
                            </View>





                            <View style={{ margin: 12, bottom: -102 }}>
                                <FollowUnFollowBtnComponent
                                    is_followed={this.state.profile.is_followed}
                                    context={this}
                                    actionCallback={this.onFollowUnfollow}
                                    user_id={this.state.profile.user_id}
                                />
                            </View>
                        </View>

                        <Text style={{ alignSelf: 'flex-start', top: 40, margin: 16, textAlign: 'justify' }}>{this.state.profile.profile_description}</Text>

                        {/* <View style={{ top: 40, flexDirection: 'row', padding: 12 }}>
                            <Icon type="ionicon" name="location-outline" size={18} />
                            <Text style={{}}>Islamabad, Pakistan</Text>
                        </View > */}

                        <View style={{ top: 30, flexDirection: 'row', padding: 12 }}>
                            <Text style={{ fontWeight: 'bold' }}>{this.state.profile.followed} </Text>
                            <Text>Following</Text>

                            <Text style={{ fontWeight: 'bold', marginLeft: 14 }}>{this.state.followers} </Text>
                            <Text>Followers</Text>
                        </View >
                    </ View>
                }
                headerHeight={350}
                statusBarHeight={Platform.OS === 'ios' ? 0 : 0}
            >
                <View style={{ height: 2000, backgroundColor: 'white' }}>
                    <FeedComponent navigation={this.props.navigation} type="user" id={this.state.profile.user_id} />
                </View>
            </CollapsibleHeaderScrollView>
        );
    }
}
