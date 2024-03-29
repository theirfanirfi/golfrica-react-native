import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
import Feed from '../screens/Feed'
import SwapsFeed from '../screens/SwapsFeed'
import SwapWithFollowedComponent from '../screens/Swaps/SwapWithFollowedComponent'
import Notifications from '../screens/Notifications'
import SingleFeed from '../screens/SingleFeed'
import ClubFeed from '../screens/ClubProfile/ClubFeed'
import UserProfile from '../screens/UserProfile'
import Bell from '../screens/TopBar/Bell'
import CreateStatus from '../screens/CreateStatus'
import Countries from '../screens/Countries'
import Clubs from '../screens/Clubs'
import Chat from '../screens/Chat'
import Chats from '../screens/Chats'
import Icon from 'react-native-vector-icons/FontAwesome'
import { TouchableOpacity, View } from 'react-native'
import SingleClub from '../screens/SingleClub'

import ClubProfilePlayers from '../screens/ClubProfilePlayers';
import EditDescription from '../screens/ClubProfile/EditDescription';
import FollowersList from '../screens/shared/FollowersList';
import PlayerProfile from '../screens/Players/PlayerProfile';
import SplashScreen from '../screens/Auth/SplashScreen'
import PlayersTab from '../screens/PlayersTab'

import Login from '../screens/Auth/Login'
import Register from '../screens/Auth/Register'
import EditProfile from '../screens/MyProfile/EditProfile'
import Colors from '../constants/Colors'

import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

import AsyncStorage from '@react-native-async-storage/async-storage';

goToMyProfile = async (navigation) => {
  await AsyncStorage.getItem('user').then(item => {
    if (item !== null) {
      let user = JSON.parse(item)
      navigation.navigate('profile', { screen: 'PlayerProfile', params: { user_id: user.user_id } });
    } else {
      alert('You are not logged in.')
    }
  });
}

function TabBarIcon(name, color) {
  let size = 30;
  if (name == 'plus') {
    size = 50
  }
  return <Icon size={size} color='green' style={{ marginBottom: -3 }} />;
}


const Stack = createStackNavigator();



function BottomNavigation() {
  return (
    <Tab.Navigator lazy={true} initialRouteName="Feed"
      screenOptions={{
        gestureEnabled: true,
        headerTintColor: 'white',
        headerStyle: { backgroundColor: Colors.green.greencolor },
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,

      }}
      tabBarOptions={{
        activeTintColor: 'green', allowFontScaling: true, labelStyle: {
          fontSize: 13
        }
      }}

    >
      <Tab.Screen name="Clubs" component={ClubsNavigator}
        options={{
          tabBarIcon: ({ color }) => <Icon name="globe" color='green' size={28} />
        }} />

      <Tab.Screen name="Players" component={playersNavigator}
        options={{
          tabBarIcon: ({ color }) => <Icon name="globe" color='green' size={28} />
        }} />

      <Tab.Screen name="Create" component={CreateStatusNavigator}
        options={{
          tabBarIcon: ({ color }) => <Icon name="plus" color='green' size={28} />,
        }} />

      {/* <Tab.Screen name="Swaps" component={SwapNavigator}
        options={{
          tabBarIcon: ({ color }) => <Icon name="globe" color='green' size={28} />,
        }} /> */}


      <Tab.Screen name="Chat" component={ChatNavigator} options={{
        tabBarIcon: ({ color }) => <Icon name="comment" color='green' size={28} />
      }} />

      <Tab.Screen name="News" component={FeedNavigator}
        options={{
          tabBarIcon: ({ color }) => <Icon name="home" color='green' size={28} />,
        }}
      />
    </Tab.Navigator>
  );
}

function FeedNavigator(navigator) {

  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerTitleStyle: { color: 'white' },
        headerStyle: { backgroundColor: Colors.green.greencolor },
        headerBackTitleStyle: { color: 'white' },
        headerTintColor: 'white',
        headerRight: () => (
          <View style={{ flexDirection: 'row' }}>
            <Bell navigation={navigator.navigation} />
            <Icon
              onPress={() => {
                // navigator.navigation.navigate('News', { screen: 'EditProfile' })
                goToMyProfile(navigator.navigation);
              }}
              name="user-circle-o"
              color="white"
              size={30}
              style={{ marginRight: 14 }}
            />
          </View>
        )
      }}
    >
      <Stack.Screen
        name="News"
        component={Feed}
        options={{
          headerTitle: 'News',
        }}
      />

      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          headerTitle: 'Edit My Profile',
        }}
      />

      <Stack.Screen
        name="SwapWith"
        component={SwapWithFollowedComponent}
        options={{
          headerTitle: 'Swap with',
        }}
      />

      <Stack.Screen
        name="notifications"
        component={Notifications}
        options={{
          headerTitle: 'Notifications',
          headerBackTitle: 'Back'
        }}
      />

      <Stack.Screen
        name="SingleFeed"
        component={SingleFeed}
        options={{ headerTitle: 'Feed' }}
      />

      <Stack.Screen
        name="Player Profile"
        component={UserProfile}
        options={({ navigation, route }) => ({
          headerRight: (props) => {
            const { user_id } = route.params
            return (
              <TouchableOpacity style={{ marginRight: 24, }} onPress={() => navigation.navigate('Chat', { chat_with_id: user_id })}>
                <Icon name='comments' size={30} color='white' />
              </TouchableOpacity>
            )
          }
        })}
      />
    </Stack.Navigator>
  );
}

function playersNavigator(navigator) {

  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerTitleStyle: { color: 'white' },
        headerStyle: { backgroundColor: Colors.green.greencolor },
        headerBackTitleStyle: { color: 'white' },
        headerTintColor: 'white',
        headerRight: () => (
          <View style={{ flexDirection: 'row' }}>
            <Bell navigation={navigator.navigation} />
            <Icon
              onPress={() => {
                // navigator.navigation.navigate('News', { screen: 'EditProfile' })
                goToMyProfile(navigator.navigation);
              }}
              name="user-circle-o"
              color="white"
              size={30}
              style={{ marginRight: 14 }}
            />
          </View>
        )
      }}
    >
      <Stack.Screen
        name="players"
        component={PlayersTab}
        options={{
          headerTitle: 'Players',
        }}
      />

      <Stack.Screen
        name="Player Profile"
        component={UserProfile}
        options={({ navigation, route }) => ({
          headerRight: (props) => {
            const { user_id } = route.params
            return (
              <TouchableOpacity style={{ marginRight: 24, }} onPress={() => navigation.navigate('Chat', { chat_with_id: user_id })}>
                <Icon name='comments' size={30} color='white' />
              </TouchableOpacity>
            )
          }
        })}
      />
    </Stack.Navigator>
  );
}


function profileNavigator(navigator) {
  return (
    <Stack.Navigator initialRouteName="PlayerProfile"
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerTitleStyle: { color: 'white' },
        headerStyle: { backgroundColor: Colors.green.greencolor },
        headerBackTitleStyle: { color: 'white' },
        headerTintColor: 'white',
        headerBackTitle: 'Back',
        headerRight: () => (
          <View style={{ flexDirection: 'row' }}>
            <Bell navigation={navigator.navigation} />
            <Icon
              onPress={() => {
                // navigator.navigation.navigate('editProfile', { screen: 'EditProfile' })
                goToMyProfile(navigator.navigation);
              }}
              name="user-circle-o"
              color="white"
              size={30}
              style={{ marginRight: 14 }}
            />
          </View>
        )
      }}
    >
      <Stack.Screen
        name="PlayerProfile"
        component={UserProfile}
        options={({ navigation, route }) => ({
          headerRight: (props) => {
            const { user_id } = route.params
            return (
              <TouchableOpacity style={{ marginRight: 24, }} onPress={() => navigation.navigate('Chat', { chat_with_id: user_id })}>
                <Icon name='comments' size={30} color='white' />
              </TouchableOpacity>
            )
          }
        })}
      />
    </Stack.Navigator>
  )
}


function singleFeedNavigator(navigator) {
  return (
    <Stack.Navigator initialRouteName="SingleFeed"
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerTitleStyle: { color: 'white' },
        headerStyle: { backgroundColor: Colors.green.greencolor },
        headerBackTitleStyle: { color: 'white' },
        headerTintColor: 'white',
        headerBackTitle: 'Back',
        headerRight: () => (
          <View style={{ flexDirection: 'row' }}>
            <Bell navigation={navigator.navigation} />
            <Icon
              onPress={() => {
                // navigator.navigation.navigate('editProfile', { screen: 'EditProfile' })
                goToMyProfile(navigator.navigation);
              }}
              name="user-circle-o"
              color="white"
              size={30}
              style={{ marginRight: 14 }}
            />
          </View>
        )
      }}
    >
      <Stack.Screen
        name="SingleFeed"
        component={SingleFeed}
        options={{ headerTitle: 'News' }}
      />
    </Stack.Navigator>
  )
}

function editProfileNavigator(navigator) {
  return (
    <Stack.Navigator initialRouteName="EditProfile"
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerTitleStyle: { color: 'white' },
        headerStyle: { backgroundColor: Colors.green.greencolor },
        headerBackTitleStyle: { color: 'white' },
        headerTintColor: 'white',
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ headerTitle: 'Edit Profile' }}
      />
    </Stack.Navigator>
  )
}

function SwapNavigator(navigator) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleStyle: { color: 'white' },
        headerTintColor: 'white',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerTitleStyle: { color: 'white' },
        headerStyle: { backgroundColor: Colors.green.greencolor },
        headerRight: () => (
          <Bell navigation={navigator.navigation} />
        )
      }}
    >
      <Stack.Screen
        name="SwapsFeed"
        component={SwapsFeed}
        options={{
          headerTitle: 'Swaps',
        }}
      />
      <Stack.Screen
        name="SwapWith"
        component={SwapWithFollowedComponent}
        options={{
          headerTitle: 'Swap with',
        }}
      />

      <Stack.Screen
        name="notifications"
        component={Notifications}
        options={{
          headerTitle: 'Notifications',
          headerBackTitle: 'Back'
        }}
      />

      <Stack.Screen
        name="SingleFeed"
        component={SingleFeed}
        options={{ headerTitle: 'Feed' }}
      />

      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        options={({ navigation, route }) => ({
          headerRight: (props) => {
            const { user_id } = route.params
            return (
              <TouchableOpacity style={{ marginRight: 24, }} onPress={() => navigation.navigate('Chat', { chat_with_id: user_id })}>
                <Icon name='comments' size={30} color='white' />
              </TouchableOpacity>
            )
          }
        })}
      />
    </Stack.Navigator>
  );
}


function CreateStatusNavigator(navigator) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleStyle: { color: 'white' },
        headerTintColor: 'white',
        headerStyle: { backgroundColor: Colors.green.greencolor },
        headerTitleStyle: { color: 'white' },

        headerRight: () => (
          <Bell navigation={navigator.navigation} />
        )
      }}
    >
      <Stack.Screen
        name="Create"
        component={CreateStatus}
        options={{
          headerTitle: 'Create Status',
        }}
      />

    </Stack.Navigator>
  );
}

function CountriesNavigator(navigator) {
  return (
    <Stack.Navigator
      initialRouteName="Countries"
      screenOptions={{
        headerRight: () => (
          <Bell navigation={navigator.navigation} />
        )
      }}>

      <Stack.Screen
        name="Countries"
        component={Countries}
        options={{ headerTitle: 'Countries' }}
      />

      <Stack.Screen
        name="Clubs"
        component={Clubs}
        options={{ headerTitle: 'Golf Clubs', headerBackTitle: 'Back' }}
      />

    </Stack.Navigator>
  );
}


function ChatNavigator() {
  return (
    <Stack.Navigator

      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerTitleStyle: { color: 'white' },
        headerStyle: { backgroundColor: Colors.green.greencolor },
        headerBackTitleStyle: { color: 'white' },
        headerTintColor: 'white',
        headerBackTitle: 'Back',
        headerRight: () => (
          <View style={{ flexDirection: 'row' }}>
            <Bell navigation={navigator.navigation} />
            <Icon
              onPress={() => {
                // navigator.navigation.navigate('editProfile', { screen: 'EditProfile' })
                goToMyProfile(navigator.navigation)

              }}
              name="user-circle-o"
              color="white"
              size={30}
              style={{ marginRight: 14 }}
            />
          </View>
        )
      }}
    >

      <Stack.Screen
        name="Chats"
        component={Chats}
        options={{ headerTitle: 'Chats' }}
      />

      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{ headerTitle: 'Chat', headerRight: () => (null) }}
      />
    </Stack.Navigator>
  )
}


function ClubsNavigator(navigator) {
  return (
    <Stack.Navigator initialRouteName="Countries"

      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerTitleStyle: { color: 'white' },
        headerStyle: { backgroundColor: Colors.green.greencolor },
        headerBackTitleStyle: { color: 'white' },
        headerTintColor: 'white',
        headerBackTitle: 'Back',
        headerRight: () => (
          <View style={{ flexDirection: 'row' }}>
            <Bell navigation={navigator.navigation} />
            <Icon
              onPress={() => {
                // navigator.navigation.navigate('editProfile', { screen: 'EditProfile' })
                goToMyProfile(navigator.navigation)

              }}
              name="user-circle-o"
              color="white"
              size={30}
              style={{ marginRight: 14 }}
            />
          </View>
        )
      }}

    >

      <Stack.Screen
        name="Countries"
        component={Countries}
        options={{ headerTitle: 'Countries' }}
      />

      <Stack.Screen
        name="CountryClubs"
        // name="Clubs"
        component={Clubs}
        options={{ headerTitle: 'Clubs' }}
      />

      <Stack.Screen
        name="SingleClub"
        component={SingleClub}
        options={{ headerTitle: 'Golf Club', headerBackTitle: 'Back' }}
      />

      <Stack.Screen
        name="Clubdescription"
        component={EditDescription}
        options={{ headerTitle: 'Golf Club', headerBackTitle: 'Back' }}
      />

      <Stack.Screen
        name="ClubFollowers"
        component={FollowersList}
        options={{ headerTitle: 'Club Followers', headerBackTitle: 'Back' }}
      />

      <Stack.Screen
        name="PlayerFollowers"
        component={FollowersList}
        options={{ headerTitle: 'Player Followers', headerBackTitle: 'Back' }}
      />

      <Stack.Screen
        name="PlayerProfile"
        component={PlayerProfile}
        options={{ headerTitle: 'Player', headerBackTitle: 'Back' }}
      />
      <Stack.Screen
        name="ClubPlayers"
        component={ClubProfilePlayers}
        options={{ headerTitle: 'Club Players', headerBackTitle: 'Back' }}
      />

      <Stack.Screen
        name="ClubFeed"
        component={ClubFeed}
        options={{ headerTitle: 'Club Feed', headerBackTitle: 'Back' }}
      />

      <Stack.Screen
        name="ClubFeedSingleFeed"
        component={SingleFeed}
        options={{ headerTitle: 'Club Feed', headerBackTitle: 'Back' }}
      />

      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        options={({ navigation, route }) => ({
          headerRight: (props) => {
            const { user_id } = route.params
            return (
              <TouchableOpacity style={{ marginRight: 24, }} onPress={() => navigation.navigate('Chat', { chat_with_id: user_id })}>
                <Icon name='comments' size={30} color='white' />
              </TouchableOpacity>
            )
          }
        })}
      />

      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{ headerTitle: 'Chat', headerRight: () => (null) }}
      />
    </Stack.Navigator>
  )
}




function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="login" screenOptions={{
      headerShown: false, gestureEnabled: true,
      gestureDirection: 'horizontal',
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
    }}>
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  )
}

function SplashNavigator() {
  return (
    <Stack.Navigator initialRouteName="SplashScreen">
      <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

function clubProfile(navigator) {
  return (
    <Stack.Navigator initialRouteName="SingleClub"
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerTitleStyle: { color: 'white' },
        headerStyle: { backgroundColor: Colors.green.greencolor },
        headerBackTitleStyle: { color: 'white' },
        headerTintColor: 'white',
        headerBackTitle: 'Back',
        headerRight: () => (
          <View style={{ flexDirection: 'row' }}>
            <Bell navigation={navigator.navigation} />
            <Icon
              onPress={() => {
                // navigator.navigation.navigate('profile', { screen: 'PlayerProfile' })
                goToMyProfile(navigator.navigation)
              }}
              name="user-circle-o"
              color="white"
              size={30}
              style={{ marginRight: 14 }}
            />
          </View>
        )
      }}>
      <Stack.Screen
        name="SingleClub"
        component={SingleClub}
        options={{ headerTitle: 'Golf Club', headerBackTitle: 'Back' }}
      />
    </Stack.Navigator>
  )
}

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashNavigator} />
      <Stack.Screen name="Root" component={BottomNavigation} />
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="profile" component={profileNavigator} />
      <Stack.Screen name="singleFeed" component={singleFeedNavigator} />
      <Stack.Screen name="editProfile" component={editProfileNavigator} />
      <Stack.Screen name="clubProfile" component={clubProfile} />
    </Stack.Navigator>
  )
}
