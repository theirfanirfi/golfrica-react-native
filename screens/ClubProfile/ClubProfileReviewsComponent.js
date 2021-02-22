import React, { Component } from "react";
import { Text, View, Dimensions } from "react-native";
const windowWidth = Dimensions.get("window").width;
import { AirbnbRating } from 'react-native-ratings';


export default class ClubProfileReviewsComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            club_avg_rating: 0,
            total_reviews: 0
        };
    }

    async componentDidMount() {
        const { club_avg_rating, total_reviews } = await this.props;
        console.log(club_avg_rating)
        console.log(total_reviews)
        this.setState({ club_avg_rating: club_avg_rating, total_reviews: total_reviews });
    }

    static getDerivedStateFromProps(props, current_state) {
        if (current_state.club_avg_rating !== props.club_avg_rating && props.club_avg_rating !== undefined) {
            return {
                club_avg_rating: props.club_avg_rating,
                total_reviews: props.total_reviews,

            };

        }
        return null
    }

    renderAverageRatingWithTotalReviewsCount(ratingType, average_rating, total_reviews) {
        return (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, marginHorizontal: 18 }}>
                <View style={{ alignSelf: 'flex-start' }}>
                    <Text>{ratingType}</Text>
                </View>
                <View style={{ alignSelf: 'flex-end', flexDirection: 'row' }}>
                    <AirbnbRating
                        count={5}
                        defaultRating={average_rating}
                        size={15}
                        showRating={false}
                        onFinishRating={(rating) => console.log(rating)}
                    />

                    <Text style={{ fontSize: 14, marginTop: 2 }}>({total_reviews})</Text>

                </View>

            </View>
        )
    }

    render() {
        return (
            <View>
                {this.renderAverageRatingWithTotalReviewsCount('User Reviews', this.state.club_avg_rating, this.state.total_reviews)}
            </View>
        );
    }
}
