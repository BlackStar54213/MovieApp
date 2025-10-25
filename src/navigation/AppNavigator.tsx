import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, ImageStyle } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import MovieDetailScreen from '../screens/MovieDetailScreen';

const heartActive = require('../../assets/icons/heart_active.png');
const heartInactive = require('../../assets/icons/heart_inactive.png');
const homeActive = require('../../assets/icons/home_active.png');
const homeInactive = require('../../assets/icons/home_inactive.png');
const searchActive = require('../../assets/icons/search_active.png');
const searchInactive = require('../../assets/icons/search_inactive.png');

type TabParamList = {
    Home: undefined;
    Search: undefined;
    Favorites: undefined;
};

type RootStackParamList = {
    RootTabs: undefined;
    MovieDetail: { movieId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const ICON_SIZE: ImageStyle = {
    width: 30,
    height: 30,
};

function Tabs() {
    return (
        <Tab.Navigator
            id={undefined}
            screenOptions={({ route }) => ({
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#121212',
                    borderBottomWidth: 0,
                    height: 100,
                },
                headerTitleStyle: {
                    color: '#fff',
                    fontSize: 24,
                    fontWeight: 'bold',
                },

                tabBarIcon: ({ focused }) => {
                    let iconSource;

                    if (route.name === 'Home') {
                        iconSource = focused ? homeActive : homeInactive;
                    } else if (route.name === 'Search') {
                        iconSource = focused ? searchActive : searchInactive;
                    } else if (route.name === 'Favorites') {
                        iconSource = focused ? heartActive : heartInactive;
                    }

                    return (
                        <Image
                            source={iconSource}
                            style={ICON_SIZE}
                            resizeMode="contain"
                        />
                    );
                },

                tabBarActiveTintColor: '#e50914',
                tabBarInactiveTintColor: '#9e9e9e',
                tabBarStyle: {
                    backgroundColor: '#121212',
                    borderTopColor: '#222',
                    height: 60,
                    paddingBottom: 6,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
            <Tab.Screen name="Search" component={SearchScreen} options={{ title: 'Search' }} />
            <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favorites' }} />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
                <Stack.Screen name="RootTabs" component={Tabs} />
                <Stack.Screen
                    name="MovieDetail"
                    component={MovieDetailScreen as React.ComponentType<any>}
                    options={{
                        headerShown: true,
                        title: 'Movie Details',
                        headerStyle: {
                            backgroundColor: '#121212',
                        },
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                            color: '#fff',
                        },
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}