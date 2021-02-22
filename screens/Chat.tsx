import React from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { View } from 'react-native'
import { getChatWithUser, sendChatMessage } from '../apis/';
import AsyncStorage from '@react-native-async-storage/async-storage';

import base64 from 'react-native-base64';


export default class Chat extends React.Component {
    state = {
        isLoggedIn: false,
        user: [],
        participant_id: 0,
        isRefreshing: true,
        messages: [],
        participants: [],
        chat_with_id: 0,
        token: null,
    }

    getData = async () => {
        let isLoggedIn = await AsyncStorage.getItem('user').then(item => {
            console.log(item);
            if (item !== null) {
                console.log(item)
                this.setState({ user: JSON.parse(item) })
            } else {
            }
        });
    }

    async componentDidMount() {
        const { chat_with_id } = await this.props.route.params
        this.getData()
        await this.setState({ chat_with_id: chat_with_id });
        const response = await getChatWithUser(this);
    }

    async formatMessages() {
        let msgs = this.state.messages
        await this.state.messages.forEach((value, index) => {
            msgs[index].user = JSON.parse(value.user);
        })
        this.setState({ messages: msgs });
    }

    async onSend(message: any) {
        let formdata = new FormData()
        formdata.append("text", base64.encode(message[0].text))
        formdata.append("receiver_id", this.state.chat_with_id)
        formdata.append("p_id", this.state.participants.length > 0 ? this.state.participants.participant_id : 0)
        const response = await sendChatMessage(this, formdata);
        if (response.status) {
            let res = response.response
            if (res.isMessageSent) {
                let messages = this.state.messages
                messages.unshift({
                    '_id': res.message.msg_id,
                    'text': res.message.message,
                    'createdAt': res.message.created_at,
                    'sent': true,
                    'user': {
                        '_id': res.message.sender_id
                    }
                })

                this.setState({ messages: messages });
            }
        }

    }

    render() {
        return (
            <View style={{ height: '100%', backgroundColor: 'white' }}>
                <GiftedChat
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    scrollToBottom={true}
                    user={{
                        _id: this.state.user.user_id
                    }}
                />
            </View>
        )
    }
}