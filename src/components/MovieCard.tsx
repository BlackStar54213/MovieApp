import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { movieService } from '../services/api';
import { Movie } from '../types/movie.types';

interface MovieCardProps {
    movie: Movie;
    onPress: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onPress }) => {
    const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
    const imageUrl = movieService.getImageUrl(movie.poster_path);

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            {imageUrl ? (
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.poster}
                    resizeMode="cover"
                />
            ) : (
                <View style={[styles.poster, styles.placeholderPoster]}>
                    <Text style={styles.placeholderText}>No Image</Text>
                </View>
            )}
            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={2}>
                    {movie.title}
                </Text>
                <Text style={styles.year}>{year}</Text>
                <View style={styles.ratingContainer}>
                    <Text style={styles.rating}>⭐ {movie.vote_average.toFixed(1)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        margin: 8,
        backgroundColor: '#1f1f1f',
        borderRadius: 8,
        overflow: 'hidden',
    },
    poster: {
        width: '100%',
        height: 250,
    },
    placeholderPoster: {
        backgroundColor: '#2a2a2a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#666',
        fontSize: 14,
    },
    info: {
        padding: 10,
    },
    title: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    year: {
        color: '#aaa',
        fontSize: 12,
        marginBottom: 4,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        color: '#ffd700',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default MovieCard;