import React, { useEffect, useState } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Text,
    ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMovieContext } from '../context/MovieContext';
import MovieCard from '../components/MovieCard';
import { Movie, MovieDetail } from '../types/movie.types';
import { movieService } from '../services/api';

type RootStackParamList = {
    Home: undefined;
    MovieDetail: { movieId: number };
    Favorites: undefined;
};

type FavoritesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Favorites'>;

interface FavoritesScreenProps {
    navigation: FavoritesScreenNavigationProp;
}

const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ navigation }) => {
    const { state } = useMovieContext();
    const [loadingMissing, setLoadingMissing] = useState(false);
    const [missingMovies, setMissingMovies] = useState<Movie[]>([]);

    const combinedLocal: Movie[] = [...state.movies, ...state.searchResults];
    const localMap = new Map<number, Movie>(combinedLocal.map(m => [m.id, m]));

    const favoriteLocalMovies: Movie[] = state.favorites
        .map(id => localMap.get(id))
        .filter(Boolean) as Movie[];

    useEffect(() => {
        let mounted = true;
        const missingIds = state.favorites.filter(id => !localMap.has(id));
        if (missingIds.length === 0) {
            setMissingMovies([]);
            return;
        }

        (async () => {
            setLoadingMissing(true);
            try {
                const promises = missingIds.map(id => movieService.getMovieDetails(id));
                const results = (await Promise.all(promises)) as MovieDetail[];
                if (!mounted) return;

                const normalized: Movie[] = results.map(r => ({
                    id: r.id,
                    title: r.title,
                    poster_path: r.poster_path,
                    release_date: r.release_date,
                    vote_average: r.vote_average,
                    overview: r.overview,
                }));
                setMissingMovies(normalized);
            } catch (err) {
                console.error('Failed to fetch missing favorite movies', err);
            } finally {
                if (mounted) setLoadingMissing(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [state.favorites, state.movies, state.searchResults]);

    const favoritesMovies = [...favoriteLocalMovies, ...missingMovies];

    const renderItem = ({ item }: { item: Movie }) => (
        <MovieCard
            movie={item}
            onPress={() => navigation.navigate('MovieDetail', { movieId: item.id })}
        />
    );

    if (state.favorites.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.emptyText}>No favorite movies found.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {loadingMissing && (
                <ActivityIndicator size="small" color="#e50914" style={{ marginVertical: 8 }} />
            )}
            <FlatList
                data={favoritesMovies}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                numColumns={2}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#141414',
        padding: 10,
    },
    emptyText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    list: {
        padding: 10,
    },
});

export default FavoritesScreen;