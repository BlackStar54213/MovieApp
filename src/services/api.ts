import axios from 'axios';
import { TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL } from '@env';
import { Movie, MovieDetail, Genre } from '../types/movie.types';

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

interface GenreListResponse {
    genres: Genre[];
}

export const movieService = {
    // MODIFIED to accept genreId
    getPopularMovies: async (genreId: number | null = null, page: number = 1): Promise<PopularMoviesResponse> => {
        let endpoint = '/movie/popular';
        const params: Record<string, any> = { page };

        if (genreId !== null) {
            // Use the 'discover' endpoint for filtering
            endpoint = '/discover/movie';
            params.with_genres = genreId;
            params.sort_by = 'popularity.desc'; // To ensure we get popular movies within that genre
        }

        const response = await api.get<PopularMoviesResponse>(endpoint, { params });
        return response.data;
    },

    // NEW function to fetch all genres
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