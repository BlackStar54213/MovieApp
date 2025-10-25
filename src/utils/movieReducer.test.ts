import { MovieState, MovieAction } from '../types/movie.types';

const initialState: MovieState = {
    movies: [],
    searchResults: [],
    favorites: [],
    loading: false,
    error: null,
};

const movieReducer = (state: MovieState, action: MovieAction): MovieState => {
    switch (action.type) {
        case 'SET_MOVIES':
            return { ...state, movies: action.payload, loading: false };
        case 'TOGGLE_FAVORITE':
            const isFavorite = state.favorites.includes(action.payload);
            return {
                ...state,
                favorites: isFavorite
                    ? state.favorites.filter((id) => id !== action.payload)
                    : [...state.favorites, action.payload],
            };
        default:
            return state;
    }
};

describe('movieReducer', () => {
    test('should set movies', () => {
        const movies = [
            {
                id: 1,
                title: 'Movie 1',
                poster_path: '/path1.jpg',
                release_date: '2023-01-01',
                vote_average: 8.5,
                overview: 'Overview 1'
            },
            {
                id: 2,
                title: 'Movie 2',
                poster_path: '/path2.jpg',
                release_date: '2023-02-01',
                vote_average: 7.5,
                overview: 'Overview 2'
            },
        ];
        const action: MovieAction = { type: 'SET_MOVIES', payload: movies };
        const newState = movieReducer(initialState, action);

        expect(newState.movies).toEqual(movies);
        expect(newState.loading).toBe(false);
    });

    test('should toggle favorite', () => {
        const action: MovieAction = { type: 'TOGGLE_FAVORITE', payload: 1 };
        const newState = movieReducer(initialState, action);

        expect(newState.favorites).toContain(1);

        const toggleAgain = movieReducer(newState, action);
        expect(toggleAgain.favorites).not.toContain(1);
    });
});