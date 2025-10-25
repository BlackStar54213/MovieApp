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
    const { state, dispatch, getPopularMovies } = useMovieContext();
    const { loading, error, movies, genres, selectedGenreId, currentPage, totalPages } = state;

    useEffect(() => {
        getPopularMovies(selectedGenreId, 1);
    }, [selectedGenreId]);

    const handleLoadMore = () => {
        if (loading) return;

        if (currentPage < totalPages) {
            getPopularMovies(selectedGenreId, currentPage + 1);
        }
    };

    const handleGenreSelect = (genreId: number | null) => {
        dispatch({ type: 'SET_GENRE_FILTER', payload: genreId });
    };

    const renderMovieItem = ({ item }: { item: Movie }) => (
        <MovieCard movie={item} onPress={() => navigation.navigate('MovieDetail', { movieId: item.id })} />
    );

    const renderFooter = () => {
        if (!loading || currentPage === 0) return null;
        return (
            <ActivityIndicator size="small" color="#e50914" style={styles.footerLoader} />
        );
    };

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

    if (loading && movies.length === 0) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#e50914" style={styles.loader} />
            </View>
        );
    }

    if (error && movies.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity onPress={() => getPopularMovies(selectedGenreId, 1)} style={styles.retryButton}>
                        <Text style={styles.retryButtonText}>Retry Loading</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

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

                    {genres.map(renderGenrePill)}
                </ScrollView>
            </View>

            <FlatList
                data={movies}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderMovieItem}
                numColumns={2}
                contentContainerStyle={styles.list}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
            />
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
    footerLoader: {
        marginVertical: 20,
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