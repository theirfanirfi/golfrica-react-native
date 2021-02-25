import * as React from 'react';
import { StyleSheet, FlatList, Text, Image, View } from 'react-native';

import { getClubStatuses } from '../../apis/';
import LikeComponent from '../Feed/LikeComponent';
import CommentComponent from '../Feed/CommentComponent';
import ShareComponent from '../Feed/ShareComponent';
import RatingStarsComponent from '../Feed/RatingStarsComponent';
import SwapBtnComponent from '../Feed/SwapBtnComponent';
import CarouselComponent from '../Feed/CarouselComponent.js';
import DropdownAlert from 'react-native-dropdownalert';
import { getProfileImage } from '../shared/utils.js';

export default class ClubFeed extends React.Component {
    state = {
        dialogVisibility: false,
        isLoggedIn: false,
        user: [],
        statuses: [],
        token: null,
        isRefreshing: true,
        offset: 0,
    };

    async componentDidMount() {
        const { club_id } = await this.props.route.params
        await this.setState({ club_id: club_id });
        const statuses = await getClubStatuses(this, club_id);
        if (statuses.status) {
            const res = statuses.response
            this.setState({ statuses: res.statuses, isRefreshing: false });

        }

    }

    actionCallBack = (action, msg) => {
        this.dropDownAlertRef.alertWithType(action, msg);
    }

    onRefresh = async () => {
        this.setState({ isRefreshing: true }, () => {
            getClubStatuses(this, this.state.club_id);

        })
    }
    getMoreTen = async () => {
        await this.setState({ offset: this.state.offset += 1 })
        const statuses = await getClubStatuses(this, this.state.club_id);
        if (statuses.status) {
            const res = statuses.response
            this.setState({ statuses: this.state.statuses.concat(res.statuses) });
        }
    }

    getProfileImage = (status: any) => {
        if (status.is_club_status == 1) {
            return getProfileImage('clubs', status.club_profile_pic)
        } else if (status.is_app_status == 1) {
            return getProfileImage('user', status.profile_image)
        } else if (status.is_player_status == 1) {
            return getProfileImage('player', status.player_profile_pic)
        }
    }




    render() {
        return (
            <View style={{ backgroundColor: 'white' }}>

                <FlatList style={styles.list}
                    data={this.state.statuses}
                    keyExtractor={(item) => {
                        return item.index;
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

                                            <Image style={{ width: 60, height: 60, borderRadius: 30 }} source={{ uri: getProfileImage('clubs', status.club_profile_pic) }} />
                                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 12 }}>{status.club_name}</Text>
                                        </View>


                                        <Text onPress={() => this.props.navigation.navigate('ClubFeedSingleFeed', { status_id: status.status_id })} style={styles.description}>{status.status_description}</Text>


                                        <CarouselComponent media={status.status_media} />

                                        <RatingStarsComponent status={status} />
                                        <View style={styles.timeContainer}>
                                            <Image style={styles.iconData} source={{ uri: 'https://img.icons8.com/color/96/3498db/calendar.png' }} />
                                            <Text style={styles.time}>{status.created_at}</Text>
                                        </View>


                                    </View>
                                </View>
                                <View style={styles.cardFooter}>
                                    <View style={styles.socialBarContainer}>
                                        <LikeComponent showAlert={this.actionCallBack} token={this.state.token} status={status} />
                                        <CommentComponent showAlert={this.actionCallBack} token={this.state.token} status={status} />
                                        <ShareComponent status={status} />
                                        <SwapBtnComponent status={status} is_club={true} navigation={this.props.navigation} showAlert={this.actionCallBack} />
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
        width: '100%'
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
