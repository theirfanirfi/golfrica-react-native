import * as React from 'react';
import { AirbnbRating } from 'react-native-ratings';
import { View, Dimensions, Text, TextInput, Alert, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import base64 from 'react-native-base64';
import { rateAndCommentStatus } from '../../apis/';
import { Button } from 'react-native-elements'
export default class RatingCommentComponent extends React.PureComponent {
    state = {
        dialogVisibility: false,
        rating: 0,
        value: null,
        token: null,
        isCommented: false,
        is_commenting: false

    }
    async componentDidMount() {
        if (this.props.status.avg_rating !== undefined) {
            this.setState({ rating: this.props.status.avg_rating });
        }
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
        this.setState({ is_commenting: true });
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
                console.log(response.response.messageOrComment)
                this.setState({ value: '', is_commenting: false }, () => {
                    // Alert.alert('Status rated.');
                    this.props.commentCallBack(this.props.context, response.response.messageOrComment)

                });


            } else {
                this.setState({ is_commenting: false });

                Alert.alert(response.messageOrComment);
            }
        } else {
            this.setState({ is_commenting: false });

            Alert.alert(response.response);

        }
    }

    render() {
        return (
            <View style={{ flexDirection: 'column', }}>

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
                <Button
                    buttonStyle={{ borderColor: 'green' }}
                    titleStyle={{ color: 'green' }}
                    type="outline"
                    title={this.state.is_commenting ? 'Please wait' : ''}
                    icon={this.state.is_commenting ? <ActivityIndicator size="small" color='green' /> : <Text style={{ color: 'green', fontSize: 16 }}>Comment</Text>}
                    onPress={() => this.rateStatus()} />
            </View>
        )
    }
}