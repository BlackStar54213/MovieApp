import React, { createContext, useContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Movie, MovieState, MovieAction, Genre } from '../types/movie.types';

const FAVORITES_KEY = '@tmdb_favorites_v1';

const initialState: MovieState = {
    movies: [],
    searchResults: [],
    favorites: [],
    loading: false,
    error: null,
    // New state initialization
    genres: [],
    selectedGenreId: null, // null means 'All Movies'
};

const movieReducer = (
    state: MovieState,
    action: MovieAction | { type: 'SET_FAVORITES'; payload: number[] }
): MovieState => {
    switch (action.type) {
        case 'SET_MOVIES':
            return { ...state, movies: action.payload, loading: false };
        case 'SET_SEARCH_RESULTS':
            return { ...state, searchResults: action.payload, loading: false };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false };
        case 'SET_FAVORITES':
            return { ...state, favorites: action.payload };
        case 'TOGGLE_FAVORITE':
            const id = action.payload as number;
            const isFavorite = state.favorites.includes(id);
            return {
                ...state,
                favorites: isFavorite
                    ? state.favorites.filter((f) => f !== id)
                    : [...state.favorites, id],
            };
        // New Reducer Cases for Genre Filtering
        case 'SET_GENRES':
            return { ...state, genres: action.payload as Genre[] };
        case 'SET_GENRE_FILTER':
            return { ...state, selectedGenreId: action.payload as number | null };
        default:
            return state;
    }
};

type MovieContextType = {
    state: MovieState;
    dispatch: React.Dispatch<MovieAction>;
};

const MovieContext = createContext<MovieContextType>({
    state: initialState,
    dispatch: () => null,
});

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(movieReducer, initialState);

    // Load persisted favorites on mount
    useEffect(() => {
        (async () => {
            try {
                const json = await AsyncStorage.getItem(FAVORITES_KEY);
                if (json) {
                    const parsed: number[] = JSON.parse(json);
                    dispatch({ type: 'SET_FAVORITES', payload: parsed });
                }
            } catch (err) {
                console.error('Failed to load favorites from storage', err);
            }
        })();
    }, []);

    // Persist favorites whenever they change
    useEffect(() => {
        (async () => {
            try {
                await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(state.favorites));
            } catch (err) {
                console.error('Failed to save favorites to storage', err);
            }
        })();
    }, [state.favorites]);

    return (
        <MovieContext.Provider value={{ state, dispatch }}>
            {children}
        </MovieContext.Provider>
    );
};

export const useMovieContext = () => useContext(MovieContext);