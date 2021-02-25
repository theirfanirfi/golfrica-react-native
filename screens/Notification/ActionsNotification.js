import * as React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Image, View, Text, ActivityIndicator, Alert } from 'react-native';
import Colors from '../../constants/Colors';
import { Card } from 'react-native-paper';
import { get } from '../../apis'
import Icon from 'react-native-vector-icons/FontAwesome';
import { getProfileImage } from '../shared/utils'
export default class ActionsNotification extends React.Component {
    state = {
        token: null,
        notifications: [],
        isLoading: true,
        isNotFound: false
    }

    async componentDidMount() {
        const response = await get(this, 'notification/');
        if (response.status) {
            const res = response.response;
            console.log(res);
            if (res.isFound) {
                this.setState({ notifications: res.notifications, isLoading: false, isNotFound: false });
            } else {
                this.setState({ isLoading: false, isNotFound: true })
            }
        }
    }


    async decline(item: any) {

    }

    renderTitle(item) {
        return (
            <>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{item.first_name + ' ' + item.last_name}</Text>
            </>
        )
    }

    renderContent(item) {
        return (
            <Text style={{ fontSize: 15, color: 'gray', }}>
                {item.is_like == 1 && 'Liked your status'}
                {item.is_review == 1 && 'Reviewed your status'}
                {item.is_share == 1 && 'Shared your status'}
            </Text>
        )
    }

    renderNotificationIcon() {
        return (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                <Icon name="check" color={Colors.green.greencolor} size={25} style={{ marginRight: 12 }} />
                <Icon name="trash" color='red' size={25} style={{ marginRight: 12 }} />
            </View>
        )
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{ justifyContent: 'center', flexDirection: 'column', flex: 1, alignContent: 'center' }}>
                    <ActivityIndicator size="large" color="green" style={{ alignSelf: 'center' }} />
                </View>
            )
        }

        if (this.state.isNotFound) {
            return (
                <View style={{ width: '100%', height: '100%', backgroundColor: 'white', justifyContent: 'center', flexDirection: 'column', flex: 1, alignContent: 'center' }}>
                    <Text style={{ alignSelf: 'center', fontSize: 18 }}>No Notification for you at the moment</Text>
                </View>
            )
        }
        return (
            <View style={{ backgroundColor: 'white' }}>
                <FlatList
                    style={{ height: '100%' }}
                    data={this.state.notifications}
                    keyExtractor={(item) => { return item.notification_id }}
                    renderItem={(item) => {
                        const notification = item.item
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

                                    <Card.Actions>
                                        <Text style={{ fontSize: 12, color: 'darkgray' }}>{item.created_at}</Text>

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
