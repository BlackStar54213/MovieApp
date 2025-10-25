import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { movieService } from '../services/api';
import { useMovieContext } from '../context/MovieContext';
import { MovieDetail } from '../types/movie.types';

type RootStackParamList = {
    Home: undefined;
    MovieDetail: { movieId: number };
};

type Props = NativeStackScreenProps<RootStackParamList, 'MovieDetail'>;

const MovieDetailScreen: React.FC<Props> = ({ route }) => {
    const { movieId } = route.params;
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { state, dispatch } = useMovieContext();

    useEffect(() => {
        loadMovieDetails();
    }, [movieId]);

    const loadMovieDetails = async () => {
        try {
            setLoading(true);
            const data = await movieService.getMovieDetails(movieId);
            setMovie(data);
        } catch (error) {
            console.error('Failed to load movie details', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = () => {
        dispatch({ type: 'TOGGLE_FAVORITE', payload: movieId });
    };

    const isFavorite = state.favorites.includes(movieId);

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#e50914" />
            </View>
        );
    }

    if (!movie) {
        return (
            <View style={styles.loader}>
                <Text style={styles.errorText}>Movie not found</Text>
            </View>
        );
    }

    const imageUrl = movieService.getImageUrl(movie.poster_path, 'w780');

    return (
        <ScrollView style={styles.container}>
            {imageUrl ? (
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.poster}
                    resizeMode="cover"
                />
            ) : (
                <View style={[styles.poster, styles.placeholderPoster]}>
                    <Text style={styles.placeholderText}>No Image Available</Text>
                </View>
            )}

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>{movie.title}</Text>
                    <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
                        <Text style={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.metaContainer}>
                    <View style={styles.metaItem}>
                        <Text style={styles.metaLabel}>Release Date</Text>
                        <Text style={styles.metaValue}>{movie.release_date}</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Text style={styles.metaLabel}>Rating</Text>
                        <Text style={styles.metaValue}>⭐ {movie.vote_average.toFixed(1)}</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Text style={styles.metaLabel}>Runtime</Text>
                        <Text style={styles.metaValue}>{movie.runtime} min</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Genres</Text>
                    <View style={styles.genresContainer}>
                        {movie.genres.map((genre) => (
                            <View key={genre.id} style={styles.genreChip}>
                                <Text style={styles.genreText}>{genre.name}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Overview</Text>
                    <Text style={styles.overview}>{movie.overview}</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#141414',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#141414',
    },
    errorText: {
        color: '#fff',
        fontSize: 16,
    },
    poster: {
        width: '100%',
        height: 500,
    },
    placeholderPoster: {
        backgroundColor: '#2a2a2a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#666',
        fontSize: 16,
    },
    content: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    title: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        flex: 1,
    },
    favoriteButton: {
        padding: 8,
    },
    favoriteIcon: {
        fontSize: 32,
    },
    metaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        backgroundColor: '#1f1f1f',
        padding: 16,
        borderRadius: 8,
    },
    metaItem: {
        alignItems: 'center',
    },
    metaLabel: {
        color: '#888',
        fontSize: 12,
        marginBottom: 4,
    },
    metaValue: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    genresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    genreChip: {
        backgroundColor: '#e50914',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
    genreText: {
        color: '#fff',
        fontSize: 14,
    },
    overview: {
        color: '#ccc',
        fontSize: 16,
        lineHeight: 24,
    },
});

export default MovieDetailScreen;