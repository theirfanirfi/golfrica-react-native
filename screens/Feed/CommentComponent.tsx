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

    commentCallBack = (context, comment) => {
        console.log(comment)
        let cmnts = context.state.comments
        cmnts.push(comment);
        context.setState({ comments: cmnts })
    }

    async retrieveComments() {
        const comments = await getStatusComments(this, this.props.token, this.props.status.status_id)
        // console.log(comments.response.comments)
        this.setState({
            comments: comments.response.comments.comments,
            visible: true,
        }, () => {
        })
    }

    render() {
        const status = this.props.status;
        return (


            <View style={styles.socialBarSection}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('singleFeed', { screen: 'SingleFeed', params: { status_id: status.status_id } })} style={styles.socialBarButton}>
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