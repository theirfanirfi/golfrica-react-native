import React, { Component } from "react";
import { Card, Icon } from "react-native-elements";

import {
  FlatList,
  Image,
  ImageBackground,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import PropTypes from "prop-types";
import Colors from "../../constants/Colors";
import { Card as Crd } from "@paraboly/react-native-card";
import { getPlayerProfile } from "../../apis/";
import PlayerRatingComponent from "./PlayerRatingComponent";
import PlayerButtonFollowComponent from "./PlayerButtonFollowComponent";
import { AirbnbRating } from "react-native-ratings";
const cover_image = require('../images/golfcover.jpg');
import FeedComponent from '../shared/FeedComponent'
const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#FFF",
    borderWidth: 0,
    flex: 1,
    margin: 0,
    padding: 0,
  },
  container: {
    flex: 1,
  },
  emailContainer: {
    backgroundColor: "#FFF",
    flex: 1,
    paddingTop: 30,
  },
  headerBackgroundImage: {
    paddingBottom: 20,
    paddingTop: 45,
  },
  headerContainer: {},
  headerColumn: {
    backgroundColor: "transparent",
    ...Platform.select({
      ios: {
        alignItems: "center",
        elevation: 1,
        marginTop: -1,
      },
      android: {
        alignItems: "center",
      },
    }),
  },
  placeIcon: {
    color: "white",
    fontSize: 26,
  },
  scroll: {
    backgroundColor: "#FFF",
  },
  telContainer: {
    backgroundColor: "#FFF",
    flex: 1,
    paddingTop: 30,
  },
  userAddressRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  userCityRow: {
    backgroundColor: "transparent",
  },
  userCityText: {
    color: "#A5A5A5",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  userImage: {
    borderColor: "#FFF",
    borderRadius: 85,
    borderWidth: 3,
    height: 170,
    marginBottom: 15,
    width: 170,
  },
  userNameText: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    paddingBottom: 8,
    textAlign: "center",
  },
});

export default class PlayerProfile extends Component {
  state = {
    image:
      "https://nation.com.pk/print_images/medium/2019-10-13/4-golf-clubs-compete-to-represent-sindh-1570912179-4900.jpg",
    player: [],
    player_statuses: [],
    player_avg_rating: 0,
    total_reviews: 0,
    token: null,
    isLoggedIn: false,
  };

  async componentDidMount() {
    const { player_id } = this.props.route.params;
    const response = await getPlayerProfile(this, player_id);
    if (response.status) {
      const res = response.response;

      this.setState({
        player: res.player[0],
      });
    }
  }


  renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <ImageBackground
          style={styles.headerBackgroundImage}
          blurRadius={10}
          source={cover_image}
        >
          <View style={styles.headerColumn}>
            <Image
              style={styles.userImage}
              source={cover_image}
              s
            />
            <Text style={styles.userNameText}>
              {this.state.player.player_name}
            </Text>
            <PlayerRatingComponent
              player_id={this.state.player.player_id}
              player_avg_rating={this.state.player.player_avg_rating}
            />

            <Text style={{ marginBottom: 6, color: "white" }}>
              {" "}
              {this.state.player.total_reviews} reviews{" "}
            </Text>

            <PlayerButtonFollowComponent
              player_id={this.state.player.player_id}
              is_followed={this.state.player.is_followed}
            />

            <View style={styles.userAddressRow}>
              <View>
                <Icon
                  name="place"
                  underlayColor="transparent"
                  iconStyle={styles.placeIcon}
                  onPress={this.onPressPlace}
                />
              </View>
              <View style={styles.userCityRow}>
                <Text style={styles.userCityText}>
                  {this.state.player.country_name}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  };

  renderBioText = () => {
    return (
      <ClubDescription
        club_id={this.state.club.club_id}
        club_descriptions={this.state.club_descriptions}
        navigation={this.props.navigation}
      />
    );
  };

  renderReviews = () => {
    return (
      <View>
        <Card style={{ flex: 1, flexDirection: "row" }}>
          <View>
            <Text>Google Reviews</Text>
          </View>

          <View>
            <AirbnbRating
              count={5}
              defaultRating={1}
              reviews={[
                "Fair",
                "Good",
                "Very Good",
                "Excellent",
                "Outstanding",
              ]}
              showRating
              size={15}
              isDisabled={true}
              onFinishRating={(rating) => console.log(rating)}
            />

            <Text style={{ alignSelf: "center" }}>135</Text>
          </View>
        </Card>
        <Card style={{ flex: 1, flexDirection: "row" }}>
          <View>
            <Text>App Reviews</Text>
          </View>

          <View>
            <AirbnbRating
              count={5}
              defaultRating={4}
              showRating
              reviews={[
                "Fair",
                "Good",
                "Very Good",
                "Excellent",
                "Outstanding",
              ]}
              size={15}
              isDisabled={true}
              onFinishRating={(rating) => console.log(rating)}
            />

            <Text style={{ alignSelf: "center" }}>135</Text>
          </View>
        </Card>
      </View>
    );
  };

  renderTabs() {
    return (
      <View
        style={{
          height: 50,
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 1,
        }}
      >
        <View
          style={{
            justifyContent: "center",
            flex: 1,
            flexDirection: "row",
            backgroundColor: Colors.green.greencolor,
          }}
        >
          <TouchableOpacity
            style={{ justifyContent: "center" }}
            onPress={() => {
              this.props.navigation.navigate("PlayerFollowers", {
                id: this.state.player.player_id,
                type: 'player'
              });
            }}
          >
            <Text style={{ fontSize: 18, alignSelf: "center", color: "white" }}>
              {this.state.player.followers} Followers
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    return (
      <ScrollView style={styles.scroll}>
        <View style={styles.container}>
          <Card containerStyle={styles.cardContainer}>
            {this.renderHeader()}
            {this.renderTabs()}
            <FeedComponent type='player' id={this.state.player.player_id} />
            {/*{this.renderBioText()}
            {this.renderReviews()} */}
          </Card>
        </View>
      </ScrollView>
    );
  }
}
