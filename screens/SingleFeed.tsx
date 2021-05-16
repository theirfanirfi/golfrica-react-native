import * as React from 'react';
import { StyleSheet, Image, Dimensions, ScrollView, Text, View, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { getSingleStatus } from '../apis/';
import RatingStarsComponent from './Feed/RatingStarsComponent';
import LikeComponent from './Feed/LikeComponent';
import CommentComponent from './Feed/CommentComponent';
import CarouselComponent from './Feed/CarouselComponent';
import RatingCommentComponent from './Feed/RatingCommentComponent'
const windowWidth = Dimensions.get('screen').width;
import { getProfileImage, getTimeDifference, getTimeInLocalTimeZone, getTimeeInLocalTimeZone } from './shared/utils'
export default class SingleFeed extends React.Component {
    state = {
        status_id: 0,
        dialogVisibility: false,
        isLoggedIn: false,
        user: [],
        status: undefined,
        response: [],
        comments: [],
        token: null,
        carouselView: null,
        isRefreshing: true,
    };

    getStatusTimeInLocalTimeZone(datetime) {
        datetime = datetime.replace(" ", "T");
        let date = new Date(datetime);
        let newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

        let offset = date.getTimezoneOffset() / 60;
        let hours = date.getHours();

        newDate.setHours(hours - offset);
        let strDate = "";
        let amPm = "pm";

        let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()

        if (hours > 12) {
            strDate = "0" + (hours - 12) + ":" + minutes + " pm"
        } else {
            hours < 10 ? strDate = "0" + hours : strDate = hours
            strDate += ":" + minutes + " am"
        }

        return strDate
    }

    actionCallBack = (action, msg) => {
        // this.dropDownAlertRef.alertWithType(action, msg);
    }

    commentCallBack = (context, comment) => {
        console.log('comment received')
        console.log(comment)
        let cmnts = context.state.comments
        console.log('size before: ' + cmnts.length);

        cmnts.unshift(comment);
        console.log('size after: ' + cmnts.length);

        context.setState({ comments: cmnts })
        console.log('state size: ' + this.state.comments.length);

    }

    loadStatus = async (status_id: number) => {
        const status = await getSingleStatus(this, status_id);
        if (status.status) {
            this.setState({ status: status.response.status[0], comments: status.response.comments.comments, isRefreshing: false }, () => {

            });
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

    goToProfile = (status) => {
        console.log(status);
        if (status.is_club_status == 1) {
            this.props.navigation.navigate('CountryClubs', { screen: 'SingleClub', params: { club_id: status.club_id } });

        } else if (status.is_app_status == 1) {
            // this.props.navigation.navigate('UserProfile', { user_id: status.user_id });
            this.props.navigation.navigate('profile', { screen: 'PlayerProfile', params: { user_id: status.user_id } })


        } else if (status.is_player_status == 1) {
            this.props.navigation.navigate('PlayerProfile', { player_id: status.player_id })
        }
    }


    render() {
        let status = this.state.status;

        if (this.state.status == undefined) {
            return (<View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size="large" color='green' style={{ alignSelf: 'center' }} />
            </View>)
        } else {
            let status_time = ''
            if (status.status_time) {
                // status_time = status_time.replace(" ", "T");
                status_time = getTimeInLocalTimeZone(status.status_time)
            }


            return (
                <View style={styles.container}>
                    <SafeAreaView>
                        <ScrollView>
                            <View style={styles.card}>

                                <View style={styles.cardHeader}>
                                    <View>
                                        <TouchableOpacity onPress={() => this.goToProfile(status)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Image style={{ width: 60, height: 60, borderRadius: 30 }} source={{ uri: this.getProfileImage(status) }} />
                                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 12 }}>{this.getNameOfPoster()}</Text>
                                        </TouchableOpacity>


                                        <Text style={styles.description}>{status.status_description}</Text>


                                        <CarouselComponent media={status.status_media} />

                                        <RatingStarsComponent navigation={this.props.navigation} status={status} />
                                        <View style={styles.timeContainer}>
                                            <Image style={styles.iconData} source={{ uri: 'https://img.icons8.com/color/96/3498db/calendar.png' }} />
                                            {/* <Text style={styles.time}>{this.getStatusTimeInLocalTimeZone(status_time)}</Text> */}
                                            <Text style={styles.time}>{status_time}</Text>
                                        </View>


                                    </View>
                                </View>


                                <View style={styles.cardFooter}>
                                    <View style={styles.socialBarContainer}>
                                        <LikeComponent showAlert={this.actionCallBack} token={this.state.token} status={status} />
                                        <CommentComponent navigation={this.props.navigation} showAlert={this.actionCallBack} token={this.state.token} status={status} />
                                        {/* <ShareComponent status={status} />
                                <SwapBtnComponent status={status} showAlert={this.actionCallBack} /> */}
                                    </View>
                                </View>
                            </View>


                            <View style={{ padding: 12, backgroundColor: 'white' }}>
                                <Text style={{ marginLeft: 12, marginTop: 12 }}>Comments</Text>

                                <RatingCommentComponent status={status} context={this} commentCallBack={this.commentCallBack} />
                                {/* <CommentsComponent comments={this.state.comments} /> */}


                                <View style={{ marginTop: 20 }}>

                                    {this.state.comments.map((element, index) => {
                                        const comment = element
                                        console.log('index: ' + index)
                                        console.log(comment)

                                        return (
                                            <TouchableOpacity
                                                onPress={() => this.props.navigation.navigate('profile', { screen: 'PlayerProfile', params: { user_id: comment.user_id } })
                                                } style={{ flexDirection: 'row', alignContent: 'space-around', width: windowWidth - 100, marginVertical: 12 }}>
                                                <View style={{ alignItems: 'flex-start', alignSelf: 'flex-start' }}>
                                                    <Image style={{ width: 60, height: 60, borderRadius: 30 }} source={{ uri: getProfileImage('user', comment.profile_image) }} />
                                                </View>
                                                <View style={{ alignSelf: 'flex-start' }}>
                                                    <Text style={{ marginLeft: 16, marginTop: 10, fontWeight: 'bold' }}>{comment.first_name + ' ' + comment.last_name}</Text>
                                                    <Text style={{ marginLeft: 16, marginTop: 6, textAlign: 'auto', width: windowWidth - 130, paddingRight: 4 }}>
                                                        {comment.comment}
                                                    </Text>
                                                    <Text style={{ color: 'orange', marginTop: 4, marginLeft: 16 }}>Stars: {comment.rating}</Text>
                                                    <View style={{ flexDirection: 'row', marginRight: 16, marginTop: 4, alignSelf: 'flex-end' }}>
                                                        <View>
                                                            <Text style={{ color: 'gray', marginTop: 4 }}>{getTimeDifference(comment.created_at)}</Text>
                                                            {/* <Text style={{ color: 'gray', marginTop: 1, fontSize: 10, alignSelf: 'flex-end' }}>{comment.created_at.substr(0, 19)}</Text> */}
                                                            <Text style={{ color: 'gray', marginTop: 1, fontSize: 10, alignSelf: 'flex-end' }}>{getTimeInLocalTimeZone(comment.created_at)}</Text>
                                                        </View>

                                                    </View>
                                                </View>
                                            </TouchableOpacity >
                                        )
                                    })}

                                </View>

                            </View>
                        </ScrollView>
                    </SafeAreaView>
                </View>
            );
        }
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
