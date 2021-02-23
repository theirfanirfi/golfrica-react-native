import * as React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import TabBarIcon from '../../components/TabBarIcon';
import { likeStatus } from '../../apis/';

export default class ShareComponent extends React.PureComponent {
    state = {
        token: null
    }

    static = {
        status: PropTypes.object
    }

    async componentDidMount() {
    }

    async likeStatus() {
        const like = await likeStatus(this, this.props.status.status_id);
        console.log(like)
    }

    toInt = value => {
        return parseInt(value);
    }

    render() {
        const status = this.props.status;
        return (
            <View style={styles.socialBarSection}>
                <TouchableOpacity style={styles.socialBarButton}>
                    <TabBarIcon size={20} name='share' color='gray' />
                    <Text style={styles.socialBarLabel}> {this.props.status.total_swaps}</Text>
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