import React, { Component } from 'react'
import { Card, Icon } from 'react-native-elements'
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
  RefreshControl,
  TouchableOpacity,
  SafeAreaView
} from 'react-native'
import PropTypes from 'prop-types'
import Colors from '../constants/Colors'
import ClubDescription from './ClubProfile/ClubDescription'
import ClubRatingComponent from './ClubProfile/ClubRatingComponent'
import ClubFollowComponent from './ClubProfile/ClubFollowComponent'
import { Card as Crd } from "@paraboly/react-native-card";
import { getClub } from '../apis/'
import { AirbnbRating } from 'react-native-ratings';
import ClubProfileDetailsComponent from './ClubProfile/ClubProfileDetailsComponent'
import ClubProfileReviewsComponent from './ClubProfile/ClubProfileReviewsComponent'


const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFF',
    borderWidth: 0,
    flex: 1,
    margin: 0,
    padding: 0,
  },
  container: {
    flex: 1,
  },
  emailContainer: {
    backgroundColor: '#FFF',
    flex: 1,
    paddingTop: 30,
  },
  headerBackgroundImage: {
    paddingBottom: 20,
    paddingTop: 45,
  },
  headerContainer: {},
  headerColumn: {
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        alignItems: 'center',
        elevation: 1,
        marginTop: -1,
      },
      android: {
        alignItems: 'center',
      },
    }),
  },
  placeIcon: {
    color: 'white',
    fontSize: 26,
  },
  scroll: {
    backgroundColor: '#FFF',
  },
  telContainer: {
    backgroundColor: '#FFF',
    flex: 1,
    paddingTop: 30,
  },
  userAddressRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  userCityRow: {
    backgroundColor: 'transparent',
  },
  userCityText: {
    color: '#A5A5A5',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  userImage: {
    borderColor: '#FFF',
    borderRadius: 85,
    borderWidth: 3,
    height: 170,
    marginBottom: 15,
    width: 170,
  },
  userNameText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    paddingBottom: 8,
    textAlign: 'center',
  },
})



export default class SingleClub extends Component {

  state = {
    image: 'https://nation.com.pk/print_images/medium/2019-10-13/4-golf-clubs-compete-to-represent-sindh-1570912179-4900.jpg',
    club: [],
    club_descriptions: [],
    club_avg_rating: 0,
    total_reviews: 0,
    token: null,
    isRefreshing: true,


  }

  onReresh = async () => {
    await this.setState({ isRefreshing: true })
    await this.loadClubProfile(this.state.club.club_id);

  }

  loadClubProfile = async (club_id) => {
    const response = await getClub(this, club_id);
    if (response.status) {
      const res = response.response;
      if (!res.isError) {
        this.setState({
          club: res.club,
          club_descriptions: res.club_descriptions,
          club_avg_rating: res.club_avg_rating,
          total_reviews: res.total_reviews,
          isRefreshing: false,
        });

      } else {
        Alert.alert(res.message)
      }

    }
  }

  async componentDidMount() {
    const { club_id } = await this.props.route.params;
    this.loadClubProfile(club_id);
  }


  renderHeader = () => {
    // const {
    //   avatar,
    //   avatarBackground,
    //   name,
    //   address: { city, country },
    // } = this.props

    return (
      <View style={styles.headerContainer}>
        <ImageBackground
          style={styles.headerBackgroundImage}
          blurRadius={10}
          source={{ uri: this.state.image }}
        >
          <View style={styles.headerColumn}>
            <Image
              style={styles.userImage}
              source={{ uri: this.state.image }}
            />
            <Text style={styles.userNameText}>{this.state.club.club_name}</Text>
            <ClubRatingComponent club_id={this.state.club.club_id} club_avg_rating={this.state.club_avg_rating} />

            <Text style={{ marginBottom: 6, color: 'white' }}> {this.state.total_reviews} reviews </Text>

            <ClubFollowComponent club_id={this.state.club.club_id} is_followed={this.state.club.is_followed} />


            <View style={styles.userAddressRow} >
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
                  {this.state.club.address}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    )
  }

  renderBioText = () => {

    return (
      <ClubDescription club_id={this.state.club.club_id} club_descriptions={this.state.club_descriptions} navigation={this.props.navigation} />
    )
  }


  renderTabs() {
    return (
      <View style={{ height: 50, flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 1 }}>

        <View style={{ justifyContent: 'center', flex: 1, flexDirection: 'row', backgroundColor: Colors.green.greencolor, borderRightWidth: 1, borderRightColor: 'white' }}>
          <TouchableOpacity style={{ justifyContent: 'center', }} onPress={() => { this.props.navigation.navigate('ClubFeed', { club_id: this.state.club.club_id }) }}>
            <Text style={{ fontSize: 18, alignSelf: 'center', color: 'white' }}>{this.state.club.total_statuses} Statuses</Text>
          </TouchableOpacity>
        </View>

        <View style={{ justifyContent: 'center', flex: 1, flexDirection: 'row', backgroundColor: Colors.green.greencolor, borderRightWidth: 1, borderRightColor: 'white' }}>
          <TouchableOpacity style={{ justifyContent: 'center', }} onPress={() => { this.props.navigation.navigate('ClubPlayers', { club_id: this.state.club.club_id }) }}>
            <Text style={{ fontSize: 18, alignSelf: 'center', color: 'white' }}>{this.state.club.players} Players</Text>
          </TouchableOpacity>
        </View>
        <View style={{ justifyContent: 'center', flex: 1, flexDirection: 'row', backgroundColor: Colors.green.greencolor, }}>
          <TouchableOpacity style={{ justifyContent: 'center', }} onPress={() => { this.props.navigation.navigate('ClubFollowers', { id: this.state.club.club_id, type: 'club' }) }}>
            <Text style={{ fontSize: 18, alignSelf: 'center', color: 'white' }}>{this.state.club.followers} Followers</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    return (
      <ScrollView style={styles.scroll} refreshControl={
        <RefreshControl refreshing={this.state.isRefreshing} onRefresh={this.onRefresh} />
      }>
        <View style={styles.container}>
          <Card containerStyle={styles.cardContainer}>
            {this.renderHeader()}
            {this.renderTabs()}
            {this.renderBioText()}
            <ClubProfileDetailsComponent club={this.state.club} />
            <ClubProfileReviewsComponent club_avg_rating={this.state.club_avg_rating} total_reviews={this.state.total_reviews} />



          </Card>
        </View>
      </ScrollView>
    )
  }
}
