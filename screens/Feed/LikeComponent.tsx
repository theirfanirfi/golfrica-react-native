import * as React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import TabBarIcon from '../../components/TabBarIcon';
import { likeStatus } from '../../apis/';

export default class LikeComponent extends React.PureComponent {
    state = {
        token: null,
        likes: 0,
        isLiked: true,
    }

    static = {
        status: PropTypes.object,
        showAlert: PropTypes.func,
        isLiked: PropTypes.bool
    }

    async componentDidMount() {
        const { status } = await this.props;
        this.setState({
            likes: this.toInt(status.status_sm_likes) + this.toInt(status.total_likes),
            isLiked: true
        })
    }

    static getDerivedStateFromProps(props, current_state) {
        if (current_state.like != (parseInt(props.status.status_sm_likes) + parseInt(props.status.total_likes))) {
            return {
                likes: (parseInt(props.status.status_sm_likes) + parseInt(props.status.total_likes)),
                isLiked: true
            };

        }
        return null
    }

    showErrorAlert = msg => {
        this.props.showAlert('error', msg);
    }

    getHeartColor() {

        if (this.state.isLiked) {
            return 'red';
        } else {
            return 'gray';
        }
    }

    likeStatus = async () => {
        const like = await likeStatus(this, this.props.token, this.props.status.status_id);
        if (like.response.isLiked) {
            this.setState({
                likes: parseInt(this.state.likes) + 1,
                isLiked: true,
            })
        } else {
            this.showErrorAlert(like.response.message);
        }
    }

    toInt = value => {
        return parseInt(value);
    }

    render() {
        const status = this.props.status;
        return (
            <View style={styles.socialBarSection}>
                <TouchableOpacity style={styles.socialBarButton} onPress={() => this.likeStatus()}>
                    <TabBarIcon size={20} name='heart' color={this.getHeartColor()} />
                    <Text style={styles.socialBarLabel}> {this.state.likes}</Text>
                </TouchableOpacity>
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
