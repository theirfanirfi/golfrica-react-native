import * as React from 'react';
import { StyleSheet, Image, Dimensions, ScrollView, RefreshControl, Text, View, SafeAreaView } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { getSingleStatus } from '../apis/';
import DropdownAlert from 'react-native-dropdownalert';
import RatingStarsComponent from './Feed/RatingStarsComponent';
import LikeComponent from './Feed/LikeComponent';
import CommentComponent from './Feed/CommentComponent';
import ShareComponent from './Feed/ShareComponent';
import SwapBtnComponent from './Feed/SwapBtnComponent';
import CommentsComponent from './Feed/CommentsComponent';
import CarouselComponent from './Feed/CarouselComponent';
const windowWidth = Dimensions.get('screen').width;
import { getProfileImage } from './shared/utils'
export default class SingleFeed extends React.Component {
    state = {
        status_id: 0,
        dialogVisibility: false,
        isLoggedIn: false,
        user: [],
        status: [],
        response: [],
        comments: [],
        token: null,
        carouselView: null,
        isRefreshing: true,
    };

    actionCallBack = (action, msg) => {
        this.dropDownAlertRef.alertWithType(action, msg);
    }

    loadStatus = async (status_id: number) => {
        const status = await getSingleStatus(this, status_id);
        // console.log(status.response.comments.comments)
        console.log(status)
        if (status.status) {
            this.setState({ status: status.response.status[0], comments: status.response.comments.comments, isRefreshing: false });
        } else {
            this.actionCallBack('error', status.response.message);
        }
    }

    async componentDidMount() {
        const { status_id } = await this.props.route.params;
        await this.loadStatus(status_id)
        // const status = await getSingleStatus(this, status_id);
        // // console.log(status.response.comments.comments)
        // if (status.status) {
        //     this.setState({ status: status.response.status[0], comments: status.response.comments.comments, isRefreshing: false });
        // } else {
        //     this.actionCallBack('error', status.response.message);
        // }

    }

    getNameOfPoster() {
        if (this.state.status.is_club_status == 1) {
            return this.state.status.club_name;
        } else if (this.state.status.is_app_status == 1) {
            return this.state.status.first_name + ' ' + this.state.status.last_name;
        } else if (this.state.status.is_player_status == 1) {
            return 'Player user name';
        }
    }
    onRefresh = () => {
        this.setState({ isRefreshing: true }, () => {
            this.loadStatus(this.state.status.status_id)
        })
    }

    getProfileImage = (status: any) => {
        if (status.is_club_status == 1) {
            return getProfileImage('clubs', status.club_profile_pic)
        } else if (status.is_app_status == 1) {
            console.log('user')
            return getProfileImage('user', status.profile_image)
        } else if (status.is_player_status == 1) {
            return getProfileImage('player', status.player_profile_pic)
        }
    }


    render() {
        const status = this.state.status;
        return (
            <View style={styles.container}>
                <SafeAreaView>

                    <View style={styles.card}>

                        <View style={styles.cardHeader}>
                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image style={{ width: 60, height: 60, borderRadius: 30 }} source={{ uri: this.getProfileImage(status) }} />
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 12 }}>{this.getNameOfPoster()}</Text>
                                </View>


                                <Text style={styles.description}>{status.status_description}</Text>


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
                                <SwapBtnComponent status={status} showAlert={this.actionCallBack} />
                            </View>
                        </View>
                    </View>

                    <Text style={{ marginLeft: 12, marginTop: 12 }}>Comments</Text>

                    <View style={styles.cardHeader}>
                        <CommentsComponent comments={this.state.comments} />
                    </View>
                    <DropdownAlert ref={ref => this.dropDownAlertRef = ref} />

                </SafeAreaView>
            </View>
        );
    }

}

function TabBarIcon(props: { name: string; color: string, size: int }) {
    return <Icon style={{ marginLeft: 6, alignSelf: 'flex-end' }} {...props} />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 0
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
