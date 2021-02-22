import * as React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import TabBarIcon from '../../components/TabBarIcon';
import { getStatusComments } from '../../apis/';
import Modal from 'react-native-modal';
import CommentsComponent from './CommentsComponent';
const windowHeight = Dimensions.get('window').height;
import RatingCommentComponent from './RatingCommentComponent';
export default class CommentComponent extends React.PureComponent {
    state = {
        token: null,
        comments: [],
        visible: false,
    }

    static = {
        status: PropTypes.object,
        showAlert: PropTypes.func,
        isLiked: PropTypes.bool,
        token: PropTypes.string
    }

    toInt = value => {
        return parseInt(value);
    }

    async retrieveComments() {
        const comments = await getStatusComments(this, this.props.token, this.props.status.status_id)
        this.setState({
            comments: comments.response.comments,
            visible: true,
        }, () => {
        })
    }

    render() {
        const status = this.props.status;

        return (


            <View style={styles.socialBarSection}>
                <Modal isVisible={this.state.visible} deviceHeight={windowHeight - 20} swipeDirection={['down']} onSwipeComplete={() => { this.setState({ visible: false }) }}>
                    <View style={{ flex: 1, backgroundColor: '#fff', marginTop: 30, padding: 12 }}>
                        <RatingCommentComponent status={status} />
                        <CommentsComponent comments={this.state.comments.comments} />
                    </View>
                </Modal>
                <TouchableOpacity onPress={() => this.retrieveComments()} style={styles.socialBarButton}>
                    <TabBarIcon size={20} name='comments' color='gray' />
                    <Text style={styles.socialBarLabel}> {status.total_comments + status.status_sm_comments}</Text>
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