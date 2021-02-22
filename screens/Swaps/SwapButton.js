import React from 'react'
import { Alert } from 'react-native'
import { Button } from 'react-native-elements'
import { get } from '../../apis/'

export default class SwapButton extends React.PureComponent {

    state = {
        status_id: 0,
        swap_with_id: 0,
        isRequestSent: false,
        token: null,
    }

    async componentDidMount() {
        let { status_id, swap_with_id } = await this.props
        this.setState({
            status_id: status_id,
            swap_with_id: swap_with_id
        })
    }

    static getStateFromDerivedProps(props, state) {
        if (state.status_id != props.status_id && props.status_id != undefined) {
            return {
                status_id: props.status_id,
                swap_with_id: props.swap_with_id
            }
        }
    }
    async sendSwap() {
        const response = await get(this, `swap/swap_status/${this.state.status_id}/${this.state.swap_with_id}`);
        if (response.status) {
            if (response.response.isSwaped) {
                this.setState({ isRequestSent: true })
            } else {
                Alert.alert(response.response.message)
            }
        }
    }

    async unSwap() {
        const response = await get(this, `swap/unswap_status/${this.state.status_id}/${this.state.swap_with_id}`);
        if (response.status) {
            if (response.response.isUnSwaped) {
                this.setState({ isRequestSent: false })
            } else {
                Alert.alert(response.response.message)
            }
        }
    }

    render() {
        return (
            <>
                {
                    this.state.isRequestSent ? (
                        <Button title="UnSwap" type="solid" onPress={() => this.unSwap()} />
                    ) : (
                            <Button title="Send Swap" type="outline" onPress={() => this.sendSwap()} />
                        )
                }
            </>
        )
    }
}