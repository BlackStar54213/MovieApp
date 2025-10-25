export interface Genre {
    id: number;
    name: string;
}

export interface Movie {
    id: number;
    title: string;
    overview: string;
    release_date: string;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    genre_ids?: number[];
}

export interface MovieDetail extends Movie {
    runtime: number;
    genres: Genre[];
}

export interface PopularMoviesResponse {
    results: Movie[];
    page: number;
    total_pages: number;
    total_results: number;
}


export interface MovieState {
    movies: Movie[];
    searchResults: Movie[];
    favorites: number[];
    loading: boolean;
    error: string | null;
    genres: Genre[];
    selectedGenreId: number | null;
    currentPage: number;
    totalPages: number;
}

export type MovieAction =
    | { type: 'SET_MOVIES_PAGE'; payload: { results: Movie[], page: number, totalPages: number } }
    | { type: 'APPEND_MOVIES'; payload: { results: Movie[], page: number } }
    | { type: 'SET_SEARCH_RESULTS'; payload: Movie[] }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_GENRES'; payload: Genre[] }
    | { type: 'SET_GENRE_FILTER'; payload: number | null }
    | { type: 'SET_FAVORITES'; payload: number[] }
    | { type: 'TOGGLE_FAVORITE'; payload: number };