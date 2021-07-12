import * as React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Image, Text, View, ActivityIndicator } from 'react-native';
import { get } from '../apis/';
import LikeComponent from './Feed/LikeComponent';
import CommentComponent from './Feed/CommentComponent';
import ShareComponent from './Feed/ShareComponent';
import RatingStarsComponent from './Feed/RatingStarsComponent';
// import SwapBtnComponent from './Feed/SwapBtnComponent';
import CarouselComponent from './Feed/CarouselComponent.js';
import DropdownAlert from 'react-native-dropdownalert';
import { getProfileImage, getTimeDifference } from './shared/utils.js'
export default class Feed extends React.Component {

    state = {
        dialogVisibility: false,
        isLoggedIn: false,
        user: [],
        statuses: [],
        isRefreshing: true,
        isLoading: true,
        offset: 0,
        token: null,
        extraData: true,
    };

    async fetchStatuses() {
        const ms = Date.now();
        console.log("before: " + this.state.statuses.length);
        const statuses = await get(this, 'statuses/?offset=0&ms=' + ms);
        if (statuses.status) {
            const res = statuses.response;
            this.setState({ statuses: res.statuses, isRefreshing: false, isLoading: false, extraData: !this.state.extraData }, () => {
                // console.log("after: " + this.state.statuses.length)

            });

        } else {
            this.setState({ isRefreshing: false, isLoading: false })
        }
    }

    async componentDidMount() {
        this.props.navigation.addListener('focus', async () => {
            this.setState({ isRefreshing: true }, () => this.fetchStatuses())
        })



        this.fetchStatuses()
    }

    actionCallBack = (action, msg) => {
        this.dropDownAlertRef.alertWithType(action, msg);
    }

    onRefresh = async () => {
        this.setState({ isRefreshing: true }, () => this.fetchStatuses());
        // const ms = Date.now();
        // const statuses = await get(this, 'statuses/?offest=0&ms=' + ms);
        // if (statuses.status) {
        //     const res = statuses.response
        //     // this.setState({ statuses: null });
        //     this.setState({ statuses: res.statuses, isRefreshing: false, isLoading: false });

        // } else {
        //     this.setState({ isRefreshing: false, isLoading: false })

        // }
    }
    getMoreTen = async () => {
        await this.setState({ offset: this.state.offset += 1 });
        const statuses = await get(this, 'statuses/?offset=' + this.state.offset);
        if (statuses.status) {
            const res = statuses.response
            this.setState({ statuses: this.state.statuses.concat(res.statuses) });
        } else {
            this.setState({ isRefreshing: false, isLoading: false })
        }
    }

    getProfilePic = (status) => {
        if (status.is_club_status) {
            return status.club_profile_pic
        } else if (status.is_app_status) {
            // return getEndPointUrl()+'/static/'
            return ''
        }
    }

    goToProfile = (status) => {
        if (status.is_club_status == 1) {
            this.props.navigation.navigate('clubProfile', { screen: 'SingleClub', params: { club_id: status.club_id } });

        } else if (status.is_app_status == 1) {
            // this.props.navigation.navigate('UserProfile', { user_id: status.user_id });
            this.props.navigation.navigate('profile', { screen: 'PlayerProfile', params: { user_id: status.user_id } })


        } else if (status.is_player_status == 1) {
            this.props.navigation.navigate('PlayerProfile', { player_id: status.player_id })
        }
    }

    getProfileImage = (status) => {
        if (status.is_club_status == 1) {
            return getProfileImage('clubs', status.club_profile_pic)
        } else if (status.is_app_status == 1) {
            return getProfileImage('user', status.club_profile_pic)
        } else if (status.is_player_status == 1) {
            return getProfileImage('player', status.player_profile_pic)
        }
    }

    componentWillUnmount() {
        // this.props.navigation.removeEventListener('focus')
    }




    render() {
        if (this.state.isLoading) {
            return (
                <View style={{ justifyContent: 'center', flexDirection: 'column', flex: 1, alignContent: 'center' }}>
                    <ActivityIndicator size="large" color="green" style={{ alignSelf: 'center' }} />
                </View>
            )
        }
        return (
            <View style={{ height: '100%' }}>

                <FlatList style={styles.list}
                    data={this.state.statuses}
                    keyExtractor={(item) => {
                        // console.log(item)
                        return item.status_id != null ? item.status_id : "0";
                    }}
                    refreshing={this.state.isRefreshing}
                    onRefresh={() => this.onRefresh()}
                    ItemSeparatorComponent={() => {
                        return (
                            <View style={styles.separator} />
                        )
                    }}
                    onEndReachedThreshold={0}
                    onEndReached={this.getMoreTen}
                    renderItem={(item) => {
                        const status = item.item;

                        return (
                            <View style={styles.card} >
                                <View style={styles.cardHeader}>
                                    <View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <TouchableOpacity onPress={() => this.goToProfile(status)}>

                                                <Image style={{ width: 60, height: 60, borderRadius: 30 }}
                                                    source={{ uri: this.getProfileImage(status) }} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => this.goToProfile(status)}>
                                                <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 12 }}>{status.club_name}</Text>
                                            </TouchableOpacity>
                                        </View>


                                        <Text onPress={() => this.props.navigation.navigate('SingleFeed', { status_id: status.status_id })} style={styles.description}>{status.status_description}</Text>


                                        <CarouselComponent media={status.status_media} />

                                        <RatingStarsComponent navigation={this.props.navigation} status={status} />
                                        <View style={styles.timeContainer}>
                                            <Image style={styles.iconData} source={{ uri: 'https://img.icons8.com/color/96/3498db/calendar.png' }} />
                                            <Text style={styles.time}>{getTimeDifference(status.created_at)}</Text>
                                        </View>


                                    </View>
                                </View>
                                <View style={styles.cardFooter}>
                                    <View style={styles.socialBarContainer}>
                                        <LikeComponent showAlert={this.actionCallBack} token={this.state.token} status={status} />
                                        <CommentComponent navigation={this.props.navigation} showAlert={this.actionCallBack} token={this.state.token} status={status} />
                                        {/* <ShareComponent status={status} /> */}

                                        {/* <SwapBtnComponent
                                            navigation={this.props.navigation}
                                            status={status}
                                            is_club={status.is_club_status == 1 ? true : false}
                                            showAlert={this.actionCallBack}
                                        /> */}
                                    </View>
                                </View>
                            </View>
                        )
                    }} />
                <DropdownAlert ref={ref => this.dropDownAlertRef = ref} />

            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
    },
    list: {
        paddingHorizontal: 17,
        backgroundColor: "#E6E6E6",
    },
    separator: {
        marginTop: 10,
    },
    /******** card **************/
    card: {
        shadowColor: '#00000021',
        shadowOffset: {
            width: 2
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        marginVertical: 8,
        backgroundColor: "white",
        width: '100%'
    },
    cardHeader: {
        paddingVertical: 17,
        paddingHorizontal: 16,
        borderTopLeftRadius: 1,
        borderTopRightRadius: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    cardContent: {
        paddingVertical: 12.5,
        paddingHorizontal: 16,
        width: '100%',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingBottom: 2,
        paddingHorizontal: 2,
        borderBottomLeftRadius: 1,
        borderBottomRightRadius: 1,
        backgroundColor: "#EEEEEE",
    },
    cardImage: {
        flex: 1,
        height: 150,
        width: '100%',

    },
    /******** card components **************/
    title: {
        fontSize: 18,
        flex: 1,
    },
    description: {
        fontSize: 15,
        color: "#888",
        marginTop: 15,
        marginBottom: 8,
    },
    time: {
        fontSize: 13,
        color: "#808080",
        marginTop: 5,

    },
    icon: {
        width: 25,
        height: 25,
    },
    iconData: {
        width: 15,
        height: 15,
        marginTop: 5,
        marginRight: 5
    },
    timeContainer: {
        flexDirection: 'row',

    },
    /******** social bar ******************/
    socialBarContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1,
        padding: 8
    },
    socialBarSection: {
        justifyContent: 'center',
        flexDirection: 'row',
        flex: 1,
    },
    socialBarlabel: {
        marginLeft: 8,
        alignSelf: 'flex-end',
        justifyContent: 'center',
    },
    socialBarButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
