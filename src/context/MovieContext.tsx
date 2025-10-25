import React, { createContext, useContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MovieState, MovieAction, Genre, MovieDetail, PopularMoviesResponse } from '../types/movie.types';
import { movieService } from '../services/api';

const FAVORITES_KEY = '@tmdb_favorites_v1';

const initialState: MovieState = {
    movies: [],
    searchResults: [],
    favorites: [],
    loading: false,
    error: null,
    genres: [],
    selectedGenreId: null,
    currentPage: 0,
    totalPages: 1,
};

const movieReducer = (
    state: MovieState,
    action: MovieAction
): MovieState => {
    switch (action.type) {
        case 'SET_MOVIES_PAGE':
            return {
                ...state,
                movies: action.payload.results,
                currentPage: action.payload.page,
                totalPages: action.payload.totalPages,
                loading: false
            };
        case 'APPEND_MOVIES':
            return {
                ...state,
                movies: [...state.movies, ...action.payload.results],
                currentPage: action.payload.page,
                loading: false
            };
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
        case 'SET_GENRES':
            return { ...state, genres: action.payload as Genre[] };
        case 'SET_GENRE_FILTER':
            return { ...state, selectedGenreId: action.payload as number | null, currentPage: 0, totalPages: 1 };
        default:
            return state;
    }
};

export type MovieContextType = {
    state: MovieState;
    dispatch: React.Dispatch<MovieAction>;
    getPopularMovies: (genreId: number | null, page: number) => Promise<PopularMoviesResponse>;
    searchMovies: (query: string, page?: number) => Promise<PopularMoviesResponse>;
    getMovieDetails: (movieId: number) => Promise<MovieDetail>;
    getImageUrl: (path: string | null, size?: string) => string | null;
};

const MovieContext = createContext<MovieContextType>({
    state: initialState,
    dispatch: () => null,
    getPopularMovies: () => Promise.resolve({ page: 1, results: [], total_pages: 0, total_results: 0 }),
    searchMovies: () => Promise.resolve({ page: 1, results: [], total_pages: 0, total_results: 0 }),
    getMovieDetails: () => Promise.resolve({} as MovieDetail),
    getImageUrl: () => null,
});

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(movieReducer, initialState);

    const fetchPopularMovies = async (genreId: number | null, page: number = 1) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const data = await movieService.getPopularMovies(genreId, page);

            if (page === 1) {
                dispatch({ type: 'SET_MOVIES_PAGE', payload: { results: data.results, page: data.page, totalPages: data.total_pages } });
            } else {
                dispatch({ type: 'APPEND_MOVIES', payload: { results: data.results, page: data.page } });
            }
            return data;
        } catch (err) {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch popular movies.' });
            return { page: 1, results: [], total_pages: 0, total_results: 0 };
        }
    };


    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const json = await AsyncStorage.getItem(FAVORITES_KEY);
                if (json) {
                    const parsed: number[] = JSON.parse(json);
                    dispatch({ type: 'SET_FAVORITES', payload: parsed });
                }
            } catch (err) {
                console.error('Failed to load favorites from storage', err);
            }
        };
        loadFavorites();
    }, []);

    useEffect(() => {
        const saveFavorites = async () => {
            try {
                await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(state.favorites));
            } catch (err) {
                console.error('Failed to save favorites to storage', err);
            }
        };
        saveFavorites();
    }, [state.favorites]);

    useEffect(() => {
        const fetchInitialGenres = async () => {
            try {
                const { genres } = await movieService.getGenres();
                dispatch({ type: 'SET_GENRES', payload: genres });
            } catch (err) {
                console.error('Failed to fetch genres:', err);
            }
        };
        fetchInitialGenres();
    }, []);


    const contextValue: MovieContextType = {
        state,
        dispatch,
        getPopularMovies: fetchPopularMovies,
        searchMovies: movieService.searchMovies,
        getMovieDetails: movieService.getMovieDetails,
        getImageUrl: movieService.getImageUrl,
    };

    return (
        <MovieContext.Provider value={contextValue}>
            {children}
        </MovieContext.Provider>
    );
};

export const useMovieContext = () => useContext(MovieContext);