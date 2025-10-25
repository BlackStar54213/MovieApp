// AppNavigator.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// @ts-ignore: Missing type declarations for 'react-native-vector-icons/Ionicons'
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import MovieDetailScreen from '../screens/MovieDetailScreen';

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

function Tabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                // --- MODIFICATION HERE: Set headerShown to true or remove it ---
                headerShown: true, // Now the header will be visible
                headerStyle: {
                    backgroundColor: '#121212', // Match tab bar background
                    borderBottomWidth: 0, // Optional: remove header border
                    height: 90, // Optional: adjust height
                },
                headerTitleStyle: {
                    color: '#fff', // White text color
                    fontSize: 24, // Larger title font
                    fontWeight: 'bold',
                },
                // --- END MODIFICATION ---
                tabBarIcon: ({ color, size }) => {
                    let iconName: React.ComponentProps<typeof Ionicons>['name'] = 'home';

                    if (route.name === 'Home') {
                        iconName = 'home';
                    } else if (route.name === 'Search') {
                        iconName = 'search';
                    } else if (route.name === 'Favorites') {
                        iconName = 'heart';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
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
            {/* The 'title' option here provides the header text */}
            <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
            <Tab.Screen name="Search" component={SearchScreen} options={{ title: 'Search' }} />
            <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favorites' }} />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <NavigationContainer>
            {/* The main Stack Navigator needs to have headerShown: false for the RootTabs screen
                so the tabs don't show an extra stack header above the tab headers. */}
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="RootTabs" component={Tabs} />
                <Stack.Screen
                    name="MovieDetail"
                    component={MovieDetailScreen as React.ComponentType<any>}
                    options={{
                        headerShown: true,
                        title: 'Movie Details',
                        // Customize the detail header to match the theme
                        headerStyle: {
                            backgroundColor: '#121212',
                        },
                        headerTintColor: '#fff', // Back arrow color
                        headerTitleStyle: {
                            color: '#fff',
                        },
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}