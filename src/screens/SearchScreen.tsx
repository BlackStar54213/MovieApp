import React, { useState } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Text,
} from 'react-native';
import { useMovieContext } from '../context/MovieContext';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import { movieService } from '../services/api';
import { Movie } from '../types/movie.types';

interface Props {
    navigation: any; // from bottom tab; we navigate to the stack MovieDetail
}

const SearchScreen: React.FC<Props> = ({ navigation }) => {
    const { state, dispatch } = useMovieContext();
    const [activeQuery, setActiveQuery] = useState<string>('');
    const [isSearching, setIsSearching] = useState<boolean>(false);

    const handleSearch = async (query: string) => {
        const trimmedQuery = query.trim();
        setActiveQuery(trimmedQuery);

        if (!trimmedQuery) {
            setIsSearching(false);
            dispatch({ type: 'SET_SEARCH_RESULTS', payload: [] });
            return;
        }

        try {
            setIsSearching(true);
            dispatch({ type: 'SET_LOADING', payload: true });
            const data = await movieService.searchMovies(trimmedQuery);
            dispatch({ type: 'SET_SEARCH_RESULTS', payload: data.results });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Search failed' });
            console.error('Error searching movies:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const displayMovies: Movie[] = state.searchResults;

    const renderMovieItem = ({ item }: { item: Movie }) => (
        <MovieCard movie={item} onPress={() => navigation.navigate('MovieDetail', { movieId: item.id })} />
    );

    return (
        <View style={styles.container}>
            <SearchBar onSearch={handleSearch} initialValue={activeQuery} />

            {state.loading ? (
                <ActivityIndicator size="large" color="#e50914" style={styles.loader} />
            ) : state.error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{state.error}</Text>
                </View>
            ) : (
                <FlatList
                    data={displayMovies}
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

export default SearchScreen;