import * as React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Text, View } from 'react-native';
import Colors from '../constants/Colors';
import { get } from '../apis/'
import Icon from 'react-native-vector-icons/FontAwesome'

export default class Countries extends React.Component {
    state = {
        isLoggedIn: false,
        token: null,
        user: [],
        countries: [],
        isLoading: true,
    }

    getCountries() {
        this.setState({ isRefreshing: true, isLoading: true, }, async () => {
            let response = await get(this, 'countries/')
            if (response.status) {
                console.log(response)
                this.setState({ countries: response.response.countries, isLoading: false })
            }
        })
    }

    async componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            this.getCountries()
        })

        this.getCountries();


    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{ justifyContent: 'center', flexDirection: 'column', flex: 1, alignContent: 'center' }}>
                    <ActivityIndicator size="large" color="green" style={{ alignSelf: 'center' }} />
                </View>
            )
        }

        return (
            <View style={{ backgroundColor: 'white' }}>
                <FlatList
                    style={{ height: '100%' }}
                    data={this.state.countries}
                    keyExtractor={(item) => { return item.country_id }}
                    renderItem={({ item }) =>
                        <TouchableOpacity key={item.country_id} style={styles.container} onPress={() => { this.props.navigation.navigate('CountryClubs', { country_id: item.country_id }) }}>

                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, }}>{item.country_name}</Text>

                            <Icon style={{ position: 'absolute', right: 18, top: 22 }} name="arrow-right" color='white' />
                        </TouchableOpacity>

                    }
                />
            </View>
        );
    }


}

function TabBarIcon(props: { name: string; color: string }) {
    return <Icon size={15} style={{ marginLeft: 6, flexDirection: 'column', alignSelf: 'flex-end' }} {...props} />;
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
});
