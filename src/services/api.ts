import axios from 'axios';
import { TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL } from '@env';
import { Movie, MovieDetail, Genre, PopularMoviesResponse } from '../types/movie.types';

const api = axios.create({
    baseURL: TMDB_BASE_URL,
    params: {
        api_key: TMDB_API_KEY,
    },
});

interface GenreListResponse {
    genres: Genre[];
}

export const movieService = {
    getPopularMovies: async (genreId: number | null = null, page: number = 1): Promise<PopularMoviesResponse> => {
        let endpoint = '/movie/popular';
        const params: Record<string, any> = { page };

        if (genreId !== null) {
            endpoint = '/discover/movie';
            params.with_genres = genreId;
            params.sort_by = 'popularity.desc';
        }

        const response = await api.get<PopularMoviesResponse>(endpoint, { params });
        return response.data;
    },

    getGenres: async (): Promise<GenreListResponse> => {
        const response = await api.get<GenreListResponse>('/genre/movie/list');
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