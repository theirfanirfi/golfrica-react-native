import * as React from 'react';
import { StyleSheet, ScrollView, Image, View, Text } from 'react-native';
import Colors from '../../constants/Colors';
import { AirbnbRating } from 'react-native-ratings';
import { Icon, Button } from 'react-native-material-ui';
import { Card, CardTitle, CardContent, CardAction, CardButton } from 'react-native-cards';
export default class ClubProfile extends React.Component {



    state = {
        image: 'https://nation.com.pk/print_images/medium/2019-10-13/4-golf-clubs-compete-to-represent-sindh-1570912179-4900.jpg'
    }



    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white', width: '100%' }}>
                <Image style={{ width: '98%', height: '35%', marginHorizontal: 4, opacity: 0.7, position: 'absolute' }} source={{ uri: this.state.image }} />

                <View style={{ flex: 1, flexDirection: 'column', marginTop: 20, alignContent: 'center' }} >

                    <Image source={{ uri: 'https://golfadvisor.brightspotcdn.com/dims4/default/b7a3b91/2147483647/strip/true/crop/732x472+165+0/resize/1860x1200!/quality/90/?url=https%3A%2F%2Fgolfadvisor.brightspotcdn.com%2Fdd%2F04%2Ffc9ae67152036a3d8e0d648b841d%2F72538.jpg' }}
                        style={{
                            alignSelf: 'center', width: 100, height: 80, marginTop: 2, borderRadius: 60, borderColor: 'white',
                            borderWidth: 1, shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                        }} />
                    <Text style={{ color: 'white', alignSelf: 'center', marginVertical: 2, fontSize: 24, }}>Africa Club</Text>
                    <AirbnbRating
                        count={5}
                        defaultRating={1}
                        showRating={false}
                        size={15}
                        starStyle={{ marginTop: 2, marginRight: 2 }}
                        onFinishRating={(rating) => console.log(rating)}
                    />

                    <Text style={{ color: 'white', fontSize: 14, alignSelf: 'center', }}>175 Reviews</Text>




                    <View style={{ flex: 1, flexDirection: 'row', marginTop: 12, paddingHorizontal: 12, justifyContent: 'space-between' }} >
                        <Button raised text="125 Followers"
                            backgroundColor='white' style={{ marginLeft: 12 }} />

                        <Button raised text="Follow"
                            backgroundColor='white' />
                    </View>
                </View>


                {/* Editable bio */}

                <ScrollView style={{}}>


                    <Card>
                        <CardAction
                            separator={true}
                            inColumn={true}>
                            <CardButton
                                onPress={() => { }}
                                title="Share"
                                color="#FEB557"
                            />
                            <CardButton
                                onPress={() => { }}
                                title="Explore"
                                color="#FEB557"
                            />
                        </CardAction>
                        <CardTitle
                            subtitle="Artican Club"
                        />
                        <CardContent text="Clifton, Western Cape" />

                    </Card>

                    <Card>
                        <CardAction
                            separator={true}
                            inColumn={true}>
                            <CardButton
                                onPress={() => { }}
                                title="Share"
                                color="#FEB557"
                            />
                            <CardButton
                                onPress={() => { }}
                                title="Explore"
                                color="#FEB557"
                            />
                        </CardAction>
                        <CardTitle
                            subtitle="Artican Club"
                        />
                        <CardContent text="Clifton, Western Cape" />

                    </Card>
                </ScrollView>

            </View>

        );
    }

}


const styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
    image: {
        width: 100,
        height: 90,
        margin: 4,

    },
    box: {
        padding: 20,
        marginTop: 5,
        marginLeft: 8,
        marginRight: 8,
        backgroundColor: 'white',
        flexDirection: 'row',
        backgroundColor: Colors.green.greencolor,
        borderRadius: 8

    },
    boxContent: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginLeft: 10,
        color: '#fff',
        backgroundColor: Colors.green.greencolor
    },
    title: {
        fontSize: 15,
        color: "#000",
        fontWeight: 'bold',
        marginTop: 8,
    },
    description: {
        fontSize: 15,
        color: "#fff",
        marginBottom: 8
    },
    buttons: {
        flexDirection: 'row',
        backgroundColor: Colors.green.greencolor,
        marginTop: 4
    },
    button: {
        height: 35,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        width: 50,
        marginRight: 5,
        marginTop: 5,
        backgroundColor: Colors.green.greencolor

    },
    icon: {
        width: 20,
        height: 20,
    },
    view: {
        backgroundColor: "#eee",
    },
    profile: {
        backgroundColor: "#1E90FF",
    },
    message: {
        backgroundColor: "#228B22",
    },
    container: {
        flex: 1,
    },
});
