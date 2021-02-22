import * as React from 'react';
import { StyleSheet, FlatList, Image, Text, View } from 'react-native';
import { getFeedComponentStatuses } from '../../apis/';
import LikeComponent from '../Feed/LikeComponent';
import CommentComponent from '../Feed/CommentComponent';
import ShareComponent from '../Feed/ShareComponent';
import RatingStarsComponent from '../Feed/RatingStarsComponent';
import SwapBtnComponent from '../Feed/SwapBtnComponent';
import CarouselComponent from '../Feed/CarouselComponent.js';
import DropdownAlert from 'react-native-dropdownalert';
import { getProfileImage } from './utils.js'
export default class FeedComponent extends React.Component {
    state = {
        dialogVisibility: false,
        isLoggedIn: false,
        user: [],
        statuses: [],
        isRefreshing: true,
        offset: 0,
        type: null,
        token: null,
        id: 0
    };

    async componentDidMount() {
        const { id, type } = await this.props
        this.setState({ type: type, id: id });

        const statuses = await getFeedComponentStatuses(this, this.state.type, this.state.id);
        if (statuses.status) {
            const res = statuses.response
            this.setState({ statuses: res.statuses, isRefreshing: false });
        }


    }

    static getDerivedStateFromProps(props, current_state) {
        if (current_state.id != props.id && props.id != undefined) {
            return {
                id: props.id,
                type: props.type
            }
        }
    }

    actionCallBack = (action, msg) => {
        this.dropDownAlertRef.alertWithType(action, msg);
    }

    onRefresh = async () => {
        this.setState({ isRefreshing: true }, () => {
            getFeedComponentStatuses(this, this.state.type, this.state.id);

        })
    }
    getMoreTen = async () => {
        await this.setState({ offset: this.state.offset += 1 })
        const statuses = await getFeedComponentStatuses(this, this.state.type, this.state.id);
        if (statuses.status) {
            const res = statuses.response
            this.setState({ statuses: this.state.statuses.concat(res.statuses) });
        }
    }

    getProfileName(status: any) {
        if (this.state.type == "player") {
            return status.player_name
        } else if (this.state.type == "user") {
            return status.first_name + ' ' + status.last_name
        }
    }

    getProfileImage = (status: any) => {
        if (this.state.type == "player") {
            return getProfileImage('player', status.player_profile_pic)
        } else if (this.state.type == "user") {
            return getProfileImage('user', status.profile_image)
        }
    }




    render() {
        return (
            <View >

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
                                            <Image style={{ width: 60, height: 60, borderRadius: 30 }} source={{ uri: this.getProfileImage(status) }} />
                                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 12 }}>{this.getProfileName(status)}</Text>
                                        </View>


                                        <Text onPress={() => this.props.navigation.navigate('Feed', { screen: 'SingleFeed', params: { status_id: status.status_id } })} style={styles.description}>{status.status_description}</Text>


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
