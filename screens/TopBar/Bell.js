import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { Badge } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import { get } from '../../apis/';

export default class Bell extends React.Component {

    state = {
        user: [],
        token: null,
        count: 0,
        isLoggedIn: false,
        navigation: []
    }

    static = {

    }

    async getNotificationsCount() {
        const response = await get(this, 'notification/notification_count/')
        if (response.status) {
            console.log('notification called')
            this.setState({ count: response.response.notifications_count })
        }
    }
    async componentDidMount() {
        this.getNotificationsCount()
    }

    static getDerivedStateFromProps(props, state) {
        if (state.navigation != props.navigation && props.navigation != undefined) {
            return {
                navigation: props.navigation
            }
        }
        return null
    }

    render() {

        return (
            <TouchableOpacity style={{ marginRight: 14, }} onPress={() => this.props.navigation.navigate('notifications')}>
                <Icon name='bell' size={30} color='white' />

                <Badge
                    value={this.state.count > 0 ? this.state.count : ''}
                    status={this.state.count > 0 ? 'warning' : null}
                    containerStyle={{ position: 'absolute', top: 4, right: 8 }} />
            </TouchableOpacity>
        )
    }
}