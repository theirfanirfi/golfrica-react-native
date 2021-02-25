import * as React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Image, View, Text, ActivityIndicator, Alert, Platform } from 'react-native';
import Colors from '../../constants/Colors';
import { Card } from 'react-native-paper';
import { getSwapNotifications, get } from '../../apis'
import Icon from 'react-native-vector-icons/FontAwesome';
import { getProfileImage, getMoment } from '../shared/utils'
import { ApproveButton, DeclineButton } from './SwapNotificationActionButtons'
export default class SwapRequests extends React.Component {
    state = {
        token: null,
        notifications: [],
        isLoading: true,
        isNotFound: false
    }

    async componentDidMount() {
        const response = await getSwapNotifications(this);
        if (response.status) {
            const res = response.response;
            if (res.isSwapNotificationsFound) {
                this.setState({ notifications: res.swaps, isLoading: false, isNotFound: false });
            } else {
                this.setState({ isLoading: false, isNotFound: true })
            }
        }
    }


    async decline(item: any) {

    }

    renderTitle(item) {
        return (

            <Text
                style={{ fontSize: 14, marginBottom: 20, fontWeight: 'bold' }}
            >
                {item.first_name + ' ' + item.last_name}
            </Text>
        )
    }

    getPlatformMargin() {
        if (Platform.OS == "android") {
            return -12
        } else if (Platform.OS == "ios") {
            return 8
        }
    }

    renderContent(item) {
        return (
            <Text style={{ fontSize: 14, color: 'gray', marginVertical: 12 }}>wants to swap a status with you.</Text>
        )
    }

    renderNotificationIcon() {
        return (
            <View style={{
                flex: 1, flexDirection: 'row', justifyContent: 'center',
                alignContent: 'center', alignItems: 'center'
            }}>
                <Icon name="check" color={Colors.green.greencolor} size={25} style={{ marginRight: 12 }} />
                <Icon name="trash" color='red' size={25} style={{ marginRight: 12 }} />
            </View>
        )
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{
                    padding: 24,
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignContent: 'center'
                }}>
                    <ActivityIndicator size="large" color="green" style={{ alignSelf: 'center', marginTop: 30 }} />
                </View>
            )
        }

        if (this.state.isNotFound) {
            return (
                <View style={{
                    width: '100%', height: '100%', backgroundColor: 'white',
                    justifyContent: 'center', flexDirection: 'column', flex: 1,
                    alignContent: 'center'
                }}>
                    <Text
                        style={{ alignSelf: 'center', fontSize: 18 }}
                    >
                        No Notification for you at the moment
                        </Text>
                </View>
            )
        }
        return (
            <View style={{ backgroundColor: 'white' }}>
                <FlatList
                    style={{ height: '100%' }}
                    data={this.state.notifications}
                    keyExtractor={(item) => { return item.swap_id }}
                    renderItem={(item) => {
                        const notification = item.item
                        console.log(notification)
                        return (
                            <TouchableOpacity style={{ margin: 4 }}
                                onPress={() => { this.props.navigation.navigate('SingleFeed', { status_id: notification.status_id }) }}>
                                <Card >
                                    <Card.Title
                                        title={this.renderTitle(notification)}
                                        subtitle={this.renderContent(notification)}
                                        left={(props) => <Image source={{ uri: getProfileImage('user', notification.profile_image) }} style={styles.userImage} />}
                                    // right={(props) => this.renderNotificationIcon()}
                                    />
                                    <Card.Actions style={{ justifyContent: 'space-between' }}>
                                        <View>
                                            <Text style={{ fontSize: 12, color: 'darkgray', marginTop: 8 }}>{getMoment(notification.created_at)}</Text>

                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <ApproveButton swap={notification} />
                                            <DeclineButton swap={notification} />
                                        </View>

                                    </Card.Actions>
                                </Card>
                            </TouchableOpacity>
                        )

                    }
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
