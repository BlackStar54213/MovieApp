// src/screens/HomeScreen.tsx

import React, { useEffect } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Text,
    Button,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { movieService } from '../services/api';
import { useMovieContext } from '../context/MovieContext';
import MovieCard from '../components/MovieCard';
import { Movie } from '../types/movie.types';

type RootStackParamList = {
    MovieDetail: { movieId: number };
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MovieDetail'>;

interface HomeScreenProps {
    navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const { state, dispatch } = useMovieContext();

    useEffect(() => {
        loadPopularMovies();
    }, []);

    const loadPopularMovies = async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const data = await movieService.getPopularMovies();
            dispatch({ type: 'SET_MOVIES', payload: data.results });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to load movies' });
            console.error('Error loading movies:', error);
        }
    };

    const renderMovieItem = ({ item }: { item: Movie }) => (
        <MovieCard movie={item} onPress={() => navigation.navigate('MovieDetail', { movieId: item.id })} />
    );

    return (
        <View style={styles.container}>
            {state.loading ? (
                <ActivityIndicator size="large" color="#e50914" style={styles.loader} />
            ) : state.error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{state.error}</Text>
                </View>
            ) : (
                <>
                    <FlatList
                        data={state.movies}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderMovieItem}
                        numColumns={2}
                        contentContainerStyle={styles.list}
                    />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#141414',
    },
    loader: {
        marginTop: 50,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: '#e50914',
        fontSize: 16,
        textAlign: 'center',
    },
    list: {
        padding: 10,
    },
});

export default HomeScreen;