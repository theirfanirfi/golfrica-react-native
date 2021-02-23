import * as React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Image, View, Text, Alert } from 'react-native';
import Colors from '../../constants/Colors';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getFollowersForFollowersScreens, followUser } from '../../apis';
import { getProfileImage } from '../shared/utils'
export default class FollowersList extends React.PureComponent {
    state = {
        image: 'https://nation.com.pk/print_images/medium/2019-10-13/4-golf-clubs-compete-to-represent-sindh-1570912179-4900.jpg',
        token: null,
        followers: [],
        loading: true,
        isRefreshing: true,
        id: 0,
        type: null
    }

    async componentDidMount() {
        const { id, type } = await this.props.route.params;
        this.setState({ id: id, type: type });
        const response = await getFollowersForFollowersScreens(this, this.state.type, id)
        if (response.status) {
            const res = response.response;
            this.setState({ loading: false, followers: res.followers, isRefreshing: false });
        }
    }

    async followUnFollowUser(item: any) {
        const response = await followUser(this, item.user_id)
        if (response.status) {
            const res = response.response
            console.log(res);
            if (res.isFollowed) {
                Alert.alert(res.message);
            }
        }
    }

    onRefresh = async () => {
        this.setState({ isRefreshing: true });
        const response = await getFollowersForFollowersScreens(this, this.state.type, this.state.id)
        if (response.status) {
            const res = response.response;
            this.setState({ loading: false, followers: res.followers, isRefreshing: false });
        }
    }

    renderTitle(item: any) {
        return (
            <View style={{
                flex: 1, flexDirection: 'column',
            }}>
                < View >
                    <Text style={{ fontSize: 16, fontWeight: 'bold', }}>{item.first_name + ' ' + item.last_name}</Text>
                </View>
                <View style={{ justifyContent: 'center', flex: 1, flexDirection: 'row' }}>
                    <Text style={{ alignSelf: 'center', marginRight: 4 }}>{item.user_followers} Followers</Text>
                    <Text style={{ alignSelf: 'center', marginHorizontal: 4 }}>{item.users_followed} Followed</Text>
                </View>
            </ View>
        )
    }

    renderFollowIcon(item: any) {
        console.log(item.is_followed)
        if (item.is_followed == 1) {
            return <Icon onPress={() => this.followUnFollowUser(item)} name="minus" color={Colors.green.greencolor} size={20} style={{ marginRight: 12 }} />

        } else {
            return <Icon onPress={() => this.followUnFollowUser(item)} name="plus" color={Colors.green.greencolor} size={20} style={{ marginRight: 12 }} />

        }
    }

    render() {
        return (
            <View style={{ backgroundColor: 'white', height: '100%' }}>
                <FlatList
                    data={this.state.followers}
                    refreshing={this.state.isRefreshing}
                    onRefresh={() => this.onRefresh()}
                    keyExtractor={(item) => { return item.f_id; }}
                    renderItem={({ item }) => {
                        console.log(item)
                        return (
                            <TouchableOpacity style={{ margin: 4 }} onPress={() => {
                                this.props.navigation.navigate('UserProfile', { user_id: item.user_id })
                            }}>
                                <Card style={{ padding: 6, justifyContent: 'center' }} >
                                    <Card.Title
                                        title={this.renderTitle(item)}
                                        left={(props) => <Image source={{ uri: getProfileImage('user', item.profile_image) }} style={styles.userImage} />}
                                        right={(props) => this.renderFollowIcon(item)}
                                    />
                                </Card>
                            </TouchableOpacity>
                        )

                    }
                    }
                />
            </View>
        );
    }


}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.green.greencolor,
        padding: 20,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 4,


    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    userImage: {
        borderColor: '#FFF',
        borderRadius: 25,
        borderWidth: 1,
        height: 50,
        marginBottom: 2,
        width: 50,
    },
});
