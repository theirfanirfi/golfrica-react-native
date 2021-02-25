import * as React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import TabBarIcon from '../../components/TabBarIcon';
import { sendSwapRequest } from '../../apis/';
import Colors from '../../constants/Colors'
export default class SwapBtnComponent extends React.PureComponent {
    state = {
        token: null,
        isLoading: false,
        is_club: false,
        status: []
    }

    static = {
        status: PropTypes.object,
        showAlert: PropTypes.func,
        is_club: PropTypes.bool
    }

    async componentDidMount() {
        let { is_club, status } = await this.props
        this.setState({ is_club: is_club, status: status })
    }

    static getStateFromDerivedProps(props, state) {
        if (state.is_club != props.is_club && props.is_club != undefined) {
            return {
                is_club: props.is_club,
                status: props.status,
            }
        }
        return null;
    }

    showErrorAlert = (type: any, msg: any) => {
        this.props.showAlert(type, msg);
    }

    async sendSwapStatusRequest() {
        const status = this.props.status;
        const response = await sendSwapRequest(this, status.status_id);
        this.showErrorAlert(response.response.msg_type, response.response.message);
    }

    getSwapIcon = (swap_satus) => {
        if (swap_satus == 1) {
            return 'check-square';
        } else if (swap_satus == 2) {
            return 'arrow-circle-right';
        } else {
            return 'plus-circle';
        }
    }

    toInt = value => {
        return parseInt(value);
    }

    render() {

        return (
            <View style={styles.socialBarSection}>
                {this.state.isLoading ? (
                    <ActivityIndicator />
                ) : (
                        <>
                            <TouchableOpacity style={styles.socialBarButton} onPress={() => {
                                if (this.state.is_club || this.state.status.isMine == 1) {
                                    this.props.navigation.navigate('SwapWith',
                                        { status_id: this.state.status.status_id })
                                } else {
                                    this.sendSwapStatusRequest();
                                }
                            }}>

                                <TabBarIcon size={24} name={this.getSwapIcon(3)}
                                    color={Colors.green.greencolor} />
                                {/* {this.state.status.isMine == 1 ? (
                                    <>
                                        <TabBarIcon size={24} name='trash' color='red' />
                                    </>
                                ) : (
                                        <>
                                            <TabBarIcon size={24} name={this.getSwapIcon(3)} 
                                            color={Colors.green.greencolor} />

                                        </>
                                    )} */}
                            </TouchableOpacity>
                        </>
                    )}

            </View>
        );
    }
}

const styles = StyleSheet.create({
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