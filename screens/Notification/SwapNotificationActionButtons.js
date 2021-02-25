import React from 'react'
import { Button } from 'react-native-elements'
import { Alert } from 'react-native'
import { get } from '../../apis'

export class ApproveButton extends React.PureComponent {
    state = {
        swap: [],
        isApproved: false,
        buttonTitle: 'Approve',
        token: null,
    }
    async componentDidMount() {
        let { swap } = await this.props
        this.setState({
            swap: swap,
            isApproved: swap.is_accepted == 1 ? true : false,
            buttonTitle: swap.is_accepted == 1 ? 'Approved' : 'Approve',
        })
    }

    static getStateDerivedFromProps(props, state) {
        if (state.swap != props.swap && props.swap != undefined) {
            return {
                swap: props.swap,
                isApproved: props.swap.is_accepted == 1 ? true : false,
                buttonTitle: props.swap.is_accepted == 1 ? 'Approved' : 'Approve',
            }
        }
    }

    async approve() {
        let response = await get(this, `swap/approve/${this.state.swap.swap_id}/`)
        if (response.status) {
            let res = response.response
            if (res.isSwapApproved) {
                this.setState({
                    isApproved: true,
                    buttonTitle: 'Approved'
                })
            } else {
                Alert.alert(res.message);
            }
        }
    }

    render() {
        return (
            <Button onPress={() => this.approve()} title={this.state.buttonTitle} type={this.state.isApproved ? "solid" : "outline"} style={{ marginHorizontal: 4 }} />

        )
    }
}




export class DeclineButton extends React.PureComponent {
    state = {
        swap: [],
        isDeclined: false,
        buttonTitle: 'Decline',
        token: null,
    }
    async componentDidMount() {
        let { swap } = await this.props
        this.setState({
            swap: swap,
            isDeclined: swap.is_rejected == 1 ? true : false,
            buttonTitle: swap.is_rejected == 1 ? 'Declined' : 'Decline',
        })
    }

    static getStateDerivedFromProps(props, state) {
        if (state.swap != props.swap && props.swap != undefined) {
            return {
                swap: props.swap,
                isDeclined: props.swap.is_rejected == 1 ? true : false,
                buttonTitle: props.swap.is_rejected == 1 ? 'Declined' : 'Decline',
            }
        }
    }

    async decline() {
        let response = await get(this, `swap/decline/${this.state.swap.swap_id}`)
        if (response.status) {
            let res = response.response
            if (res.isSwapDeclined) {
                this.setState({
                    buttonTitle: 'Declined',
                    isDeclined: true,
                })
            } else {

                Alert.alert(res.message);
            }
        }
    }

    render() {
        return (
            <Button onPress={() => this.decline()} title={this.state.buttonTitle} type={this.state.isDeclined ? "solid" : "outline"} style={{ marginHorizontal: 4 }} />

        )
    }
}