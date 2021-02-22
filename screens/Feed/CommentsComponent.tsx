import * as React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, FlatList } from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { getProfileImage } from '../shared/utils'
export default class CommentsComponent extends React.PureComponent {
    state = {
        token: null,
        comments: []
    }

    static = {
        comments: PropTypes.array,
        showAlert: PropTypes.func,
        isLiked: PropTypes.bool
    }

    static getDerivedStateFromProps(props, current_state) {
        if (current_state.comments !== props.comments && props.comments !== undefined) {
            return {
                comments: props.comments
            };

        }
        return null
    }



    componentDidMount() {
        let media = this.props.media;
        if (media == undefined) {
            return null;
        } else {
            let jMedia = JSON.parse(media);
            let VImages = [];
            if (jMedia.images.length > 0) {
                jMedia.images.map((element, index) => {
                    VImages.push({
                        "uri": element
                    });
                });
            }


            this.setState({ media: jMedia.images, ImageViewerImages: VImages });
        }

    }


    // componentDidMount() {
    //     let cmts = this.props.comments;
    //     if (cmts !== undefined) {
    //         this.setState({ comments: cmts });
    //     }
    // }

    showErrorAlert = msg => {
        this.props.showAlert('error', msg);
    }



    toInt = value => {
        return parseInt(value);
    }

    render() {

        return (
            <FlatList
                data={this.state.comments}
                keyExtractor={(item) => {
                    return item.comment_id;
                }}
                renderItem={(item) => {
                    const comment = item.item
                    console.log(comment)
                    return (
                        <TouchableOpacity onLongPress={() => console.log('long press')} style={{ flexDirection: 'row', alignContent: 'space-around', width: windowWidth - 100, marginVertical: 12 }}>
                            <View style={{ alignItems: 'flex-start', alignSelf: 'flex-start' }}>
                                <Image style={{ width: 60, height: 60, borderRadius: 30 }} source={{ uri: getProfileImage('user', comment.profile_image) }} />
                            </View>
                            <View style={{ alignSelf: 'flex-start' }}>
                                <Text style={{ marginLeft: 16, marginTop: 10, fontWeight: 'bold' }}>{comment.first_name + ' ' + comment.last_name}</Text>
                                <Text style={{ marginLeft: 16, marginTop: 6, textAlign: 'auto', width: windowWidth - 130, paddingRight: 4 }}>
                                    {comment.comment}
                                </Text>
                                <Text style={{ color: 'orange', marginTop: 4, marginLeft: 16 }}>Stars: {comment.rating}</Text>
                                <View style={{ flexDirection: 'row', marginRight: 16, marginTop: 4, alignSelf: 'flex-end' }}>
                                    <Text style={{ color: 'gray', marginTop: 4 }}>5h ago</Text>
                                </View>
                            </View>
                        </TouchableOpacity >
                    )
                }}
            />

        );
    }
}

const styles = StyleSheet.create({
    cardImage: {
        flex: 1,
        height: 150,
        width: '100%',

    },
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