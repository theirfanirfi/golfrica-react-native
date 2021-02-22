import React, { Component } from "react";
import { Text, View } from "react-native";
import { Card } from "react-native-elements";
import Autolink from "react-native-autolink";


export default class ClubProfileDetailsComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      club: [],
    };
  }

  async componentDidMount() {
    const { club } = await this.props;
    this.setState({ club: club });
  }

  static getDerivedStateFromProps(props, current_state) {
    if (current_state.club != props.club && props.club != undefined) {
      return {
        club: props.club
      }
    }
  }

  renderSectionTitle(section) {
    return (
      <Card containerStyle={{ backgroundColor: "#E7E9EB", borderRadius: 8 }}>
        <Text style={{ color: "gray", fontWeight: "bold", fontSize: 18 }}>
          {section}
        </Text>
      </Card>
    );
  }

  renderClubProfileAttribute(attribute, value, display) {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: display == 'inline' ? 'row' : 'column',
          justifyContent: display == 'inline' ? 'space-between' : 'flex-start',
          marginLeft: 18,
          marginRight: display == 'inline' ? 12 : 1,
          marginTop: 12,

        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 15 }}>{attribute}</Text>
        { typeof (value) == "number" ?
          <Text>{value}</Text>
          :
          <Autolink style={{ marginTop: 2 }} text={value} hashtag="instagram" mention="twitter" />
        }
      </View>
    );
  }

  render() {
    return (
      <View>
        {this.renderSectionTitle("Golf Union/Federation")}
        {this.renderClubProfileAttribute(
          "Union or Federation",
          this.state.club.club_union_federation,
          'newline'
        )}
        {this.renderClubProfileAttribute("Email", this.state.club.email, 'inline')}
        {this.renderClubProfileAttribute("WhatsApp", this.state.club.whatsapp_number, 'inline')}
        {this.renderClubProfileAttribute("Website", this.state.club.web_link, 'inline')}
        {this.renderClubProfileAttribute("Postal Address", this.state.club.postal_address, 'newline')}
        {this.renderClubProfileAttribute("Facebook", this.state.club.fb_link, 'inline')}
        {this.renderClubProfileAttribute("Twitter", this.state.club.twitter_link, 'inline')}
        {this.renderClubProfileAttribute("Instagram", this.state.club.instagram_link, 'inline')}


        {this.renderSectionTitle("Club")}
        {this.renderClubProfileAttribute("Public/Private", this.state.club.public_or_private, 'inline')}
        {this.renderClubProfileAttribute("Holes", this.state.club.holes_9_or_18, 'inline')}
        {this.renderClubProfileAttribute("Email", this.state.club.email, 'inline')}
        {this.renderClubProfileAttribute("WhatsApp", this.state.club.whatsapp_number, 'inline')}
        {this.renderClubProfileAttribute("Website", this.state.club.web_link, 'inline')}
        {this.renderClubProfileAttribute("Postal Address", this.state.club.postal_address, 'newline')}
        {this.renderClubProfileAttribute("Facebook", this.state.club.fb_link, 'inline')}
        {this.renderClubProfileAttribute("Twitter", this.state.club.twitter_link, 'inline')}
        {this.renderClubProfileAttribute("Instagram", this.state.club.instagram_link, 'inline')}

        {this.renderSectionTitle("Reviews")}




      </View>
    );
  }
}
