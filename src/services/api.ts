import axios from 'axios';
import { TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL } from '@env';
import { Movie, MovieDetail } from '../types/movie.types';

const api = axios.create({
    baseURL: TMDB_BASE_URL,
    params: {
        api_key: TMDB_API_KEY,
    },
});

interface PopularMoviesResponse {
    results: Movie[];
    page: number;
    total_pages: number;
    total_results: number;
}

export const movieService = {
    getPopularMovies: async (page: number = 1): Promise<PopularMoviesResponse> => {
        const response = await api.get<PopularMoviesResponse>('/movie/popular', {
            params: { page }
        });
        return response.data;
    },

    searchMovies: async (query: string, page: number = 1): Promise<PopularMoviesResponse> => {
        const response = await api.get<PopularMoviesResponse>('/search/movie', {
            params: { query, page },
        });
        return response.data;
    },

    getMovieDetails: async (movieId: number): Promise<MovieDetail> => {
        const response = await api.get<MovieDetail>(`/movie/${movieId}`);
        return response.data;
    },

    getImageUrl: (path: string | null, size: string = 'w500'): string | null => {
        if (!path) return null;
        return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
    },
};