import React, { useEffect } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Text,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { movieService } from '../services/api';
import { useMovieContext } from '../context/MovieContext';
import MovieCard from '../components/MovieCard';
import { Movie, Genre } from '../types/movie.types';


type RootStackParamList = {
    MovieDetail: { movieId: number };
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MovieDetail'>;

interface HomeScreenProps {
    navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const { state, dispatch } = useMovieContext();
    const { loading, error, movies, genres, selectedGenreId } = state;

    useEffect(() => {
        loadGenres();
    }, []);

    useEffect(() => {
        loadPopularMovies(selectedGenreId);
    }, [selectedGenreId]);


    const loadGenres = async () => {
        try {
            const data = await movieService.getGenres();
            dispatch({ type: 'SET_GENRES', payload: data.genres });
        } catch (e) {
            console.error('Error loading genres:', e);
        }
    }

    const loadPopularMovies = async (genreId: number | null) => {
        try {
            if (!loading) {
                dispatch({ type: 'SET_LOADING', payload: true });
            }
            const data = await movieService.getPopularMovies(genreId);
            dispatch({ type: 'SET_MOVIES', payload: data.results });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to load movies' });
            console.error('Error loading movies:', error);
        }
    };

    const handleGenreSelect = (genreId: number | null) => {
        dispatch({ type: 'SET_GENRE_FILTER', payload: genreId });
    };

    const renderMovieItem = ({ item }: { item: Movie }) => (
        <MovieCard movie={item} onPress={() => navigation.navigate('MovieDetail', { movieId: item.id })} />
    );

    const renderGenrePill = (genre: Genre) => {
        const isSelected = genre.id === selectedGenreId;
        return (
            <TouchableOpacity
                key={genre.id}
                style={[
                    styles.genrePill,
                    isSelected ? styles.genrePillSelected : styles.genrePillUnselected,
                ]}
                onPress={() => handleGenreSelect(genre.id)}
            >
                <Text style={isSelected ? styles.genreTextSelected : styles.genreTextUnselected}>
                    {genre.name}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.genreBar}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity
                        style={[
                            styles.genrePill,
                            !selectedGenreId ? styles.genrePillSelected : styles.genrePillUnselected,
                            styles.allMoviesPill
                        ]}
                        onPress={() => handleGenreSelect(null)}
                    >
                        <Text style={!selectedGenreId ? styles.genreTextSelected : styles.genreTextUnselected}>
                            All
                        </Text>
                    </TouchableOpacity>

                    {genres.map((genre) => (
                        <TouchableOpacity
                            key={genre.id}
                            style={[
                                styles.genrePill,
                                genre.id === selectedGenreId ? styles.genrePillSelected : styles.genrePillUnselected,
                            ]}
                            onPress={() => handleGenreSelect(genre.id)}
                        >
                            <Text style={genre.id === selectedGenreId ? styles.genreTextSelected : styles.genreTextUnselected}>
                                {genre.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {loading && movies.length === 0 ? (
                <ActivityIndicator size="large" color="#e50914" style={styles.loader} />
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity onPress={() => loadPopularMovies(selectedGenreId)} style={styles.retryButton}>
                        <Text style={styles.retryButtonText}>Retry Loading</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={movies}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderMovieItem}
                    numColumns={2}
                    contentContainerStyle={styles.list}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#141414',
    },
    genreBar: {
        paddingVertical: 10,
        backgroundColor: '#141414',
        borderBottomWidth: 1,
        marginBottom: 15,
        borderBottomColor: '#222',
    },
    genrePill: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        marginHorizontal: 5,
        justifyContent: 'center',
    },
    allMoviesPill: {
        marginLeft: 10,
    },
    genrePillSelected: {
        backgroundColor: '#e50914',
    },
    genrePillUnselected: {
        backgroundColor: '#333333',
        borderWidth: 1,
        borderColor: '#555555',
    },
    genreTextSelected: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    genreTextUnselected: {
        color: '#aaaaaa',
    },
    retryButton: {
        backgroundColor: '#e50914',
        padding: 10,
        borderRadius: 5,
        marginTop: 15,
    },
    retryButtonText: {
        color: 'white',
        fontWeight: 'bold',
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