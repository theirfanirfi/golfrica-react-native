import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Icon } from 'react-native-elements'
import PropTypes from 'prop-types'
import { DescriptionImagesFlatList } from './ClubDescriptionComponents'
import mainColor from './constants'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 25,
  },
  iconRow: {
    flex: 2,
    justifyContent: 'center',
  },
  smsIcon: {
    color: 'darkgray',
    fontSize: 20,
  },
  smsRow: {
    flex: 2,
    justifyContent: 'flex-start',
  },
  telIcon: {
    color: mainColor,
    fontSize: 30,
  },
  telNameColumn: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  telNameText: {
    color: 'gray',
    fontSize: 14,
    fontWeight: '200',
  },
  telNumberColumn: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
  telNumberText: {
    fontSize: 16,
  },
  telRow: {
    flex: 6,
    flexDirection: 'column',
    justifyContent: 'center',
  },
})

export default class ClubDescription extends React.PureComponent {

  constructor(props) {
    super(props);
  }
  state = {
    club_descriptions: [],
    club_id: 0,
    token: null,
  }

  static = {
    navigation: PropTypes.object,
    club_descriptions: PropTypes.array,
    club_id: PropTypes.number
  }

  componentDidMount() {
    console.log(this.props.club_descriptions)
    this.setState({ club_descriptions: this.props.club_descriptions, club_id: this.props.club_id })

  }

  static getDerivedStateFromProps(props, current_state) {
    if (current_state.club_descriptions !== props.club_descriptions && props.club_descriptions !== undefined) {
      return {
        club_descriptions: props.club_descriptions,
        club_id: props.club_id

      };

    }
    return null
  }

  render() {

    return (

      <View style={{ flex: 1, flexDirection: 'column', marginTop: 12 }}>

        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12 }}>
          <View>
            <Text>Description</Text>
          </View>

          {this.state.club_id > 0 &&
            <TouchableOpacity>
              <Icon
                name="edit"
                underlayColor="transparent"
                iconStyle={styles.smsIcon}
                onPress={() => this.props.navigation.navigate('Clubdescription', { club_id: this.state.club_id })}
              />

            </TouchableOpacity>

          }

        </View>

        <View style={{ flex: 1, flexDirection: 'column', paddingHorizontal: 12, marginTop: 12 }}>
          {this.state.club_descriptions.length > 0 &&
            <View>
              <Text style={{ color: 'green' }}>@{this.state.club_descriptions[0].first_name + ' ' + this.state.club_descriptions[0].last_name}</Text>
              <Text style={{ textAlign: 'justify' }}>
                {this.props.club_descriptions[0].des_text}
              </Text>

              {this.props.club_descriptions[0].des_media != "" &&
                <DescriptionImagesFlatList media={this.props.club_descriptions[0].des_media} />
              }
            </View>
          }
        </View>


      </View>
    )
  }
}
