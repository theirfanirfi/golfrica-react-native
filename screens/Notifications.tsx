import * as React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import SwapRequests from './Notification/SwapRequests'
import ActionsNotification from './Notification/ActionsNotification'

export default class Notifications extends React.Component {
    state = {
        token: null,
        tabView: <SwapRequests navigation={this.props.navigation} />,

    }

    async componentDidMount() {
        // const response = await getSwapNotifications(this);
        // if (response.status) {
        //     const res = response.response;
        //     if (res.isSwapNotificationsFound) {
        //         this.setState({ notifications: res.swaps, isLoading: false, isNotFound: false });
        //     } else {
        //         this.setState({ isLoading: false, isNotFound: true })
        //     }
        // }
    }


    render() {
        return (
            <View style={{ backgroundColor: 'white' }}>
                <View style={{ justifyContent: 'center', flexDirection: 'row', backgroundColor: '#066E31' }}>

                    <TouchableOpacity style={{ padding: 12, paddingHorizontal: 18 }} onPress={() => this.setState({ tabView: <SwapRequests navigation={this.props.navigation} /> })}>
                        <Text style={{ fontSize: 20, color: 'white', alignSelf: 'center' }}>Swap Requests</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.setState({ tabView: <ActionsNotification navigation={this.props.navigation} /> })} style={{ padding: 12, paddingHorizontal: 18 }}>
                        <Text style={{ fontSize: 20, color: 'white', alignSelf: 'center' }}>Notifications </Text>
                    </TouchableOpacity>
                </View>
                {this.state.tabView}
            </View>
        );
    }


}

