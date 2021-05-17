import * as React from 'react';
import { AirbnbRating } from 'react-native-ratings';
import { View, Dimensions, Text, TextInput, Alert } from 'react-native';
import PropTypes from 'prop-types';
import base64 from 'react-native-base64';
import { rateAndCommentStatus } from '../../apis/';
import { Button } from 'react-native-elements'

import Modal, { ModalContent, FadeAnimation, ModalTitle, ModalFooter, ModalButton } from 'react-native-modals';
export default class RatingStarsComponent extends React.PureComponent {
    state = {
        dialogVisibility: false,
        rating: 0,
        value: null,
        token: null,
        isCommented: false,

    }
    async componentDidMount() {
        const { status } = await this.props
        console.log(status.avg_rating)
        this.setState({ rating: status.avg_rating });
    }

    static = {
        status: PropTypes.object
    }

    setRatingAndShowCommentBox = rating => {
        this.setState({ dialogVisibility: true, rating: rating });
    }
    setRating = rating => {
        this.setState({ rating: rating });

    }

    async rateStatus() {
        let data = {
            status_id: this.props.status.status_id,
            comment: this.state.value,
            rating: this.state.rating
        }

        let jsonData = JSON.stringify(data);
        let encodedData = base64.encode(jsonData);
        let formdata = new FormData();
        formdata.append("data", encodedData);
        const response = await rateAndCommentStatus(this, formdata);
        if (response.status) {
            if (response.response.isCommented) {
                console.log(response.response)
                this.setState({ dialogVisibility: false }, () => {
                    this.props.navigation.navigate('singleFeed', { screen: 'SingleFeed', params: { status_id: response.response.messageOrComment.status_id } });
                });
            } else {
                Alert.alert(response.messageOrComment);
            }
        } else {
            Alert.alert(response.response);

        }
    }

    render() {
        return (
            <View>
                <Modal
                    width={0.8}
                    style={{ width: '100%' }}
                    visible={this.state.dialogVisibility}
                    onTouchOutside={() => {
                        this.setState({ dialogVisibility: false });
                    }}
                    // modalAnimation={new FadeAnimation({
                    //     initialValue: 0, // optional
                    //     animationDuration: 150, // optional
                    //     useNativeDriver: true, // optional
                    // })}
                    modalTitle={<ModalTitle title="Comment" />}
                    swipeDirection={['down', 'up']} // can be string or an array
                    swipeThreshold={200} // default 100
                >
                    <ModalContent>
                        <TextInput multiline={true} style={{ borderColor: 'gray', borderWidth: 0.5, height: 80, marginTop: 8, padding: 8 }} numberOfLines={6}
                            value={this.state.value} onChangeText={(text) => this.setState({ value: text })} />
                        <AirbnbRating
                            count={5}
                            defaultRating={this.state.rating}
                            showRating={false}
                            size={17}
                            onFinishRating={(rating) => { this.setRating(rating); }}
                            starStyle={{ marginTop: 12, marginBottom: 12, marginHorizontal: 6 }}

                        />
                    </ModalContent>
                    <ModalFooter style={{ justifyContent: 'space-around', padding: 4 }}>
                        <Button title="Cancel" buttonStyle={{ borderWidth: 0 }} type="outline" onPress={() => { this.setState({ dialogVisibility: false }); }} />
                        <Button title="  Rate  " buttonStyle={{ borderWidth: 0 }} type="outline" onPress={() => { this.rateStatus(); }} />
                        {/* // <ModalButton text="Cancel" onPress={() => { this.setState({ dialogVisibility: false }); }} />
                        // <ModalButton text="Rate" onPress={() => { this.rateStatus(); }} /> */}

                    </ModalFooter>
                </Modal>


                <AirbnbRating
                    count={5}
                    defaultRating={this.state.rating}
                    showRating={false}
                    size={17}
                    onFinishRating={(rating) => { this.setRatingAndShowCommentBox(rating); }}
                    starStyle={{ marginTop: 12, marginBottom: 12, marginHorizontal: 6 }}

                />
            </View>
        )
    }
}
