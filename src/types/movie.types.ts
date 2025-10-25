export interface Movie {
    id: number;
    title: string;
    poster_path: string;
    backdrop_path?: string;
    release_date: string;
    vote_average: number;
    overview: string;
    genre_ids?: number[];
}

export interface MovieDetail extends Movie {
    genres: Genre[];
    runtime: number;
    budget: number;
    revenue: number;
    tagline: string;
}

export interface Genre {
    id: number;
    name: string;
}

export interface MovieState {
    movies: Movie[];
    searchResults: Movie[];
    favorites: number[];
    loading: boolean;
    error: string | null;
    // New properties for filtering
    genres: Genre[];
    selectedGenreId: number | null;
}

export type MovieAction =
    | { type: 'SET_MOVIES'; payload: Movie[] }
    | { type: 'SET_SEARCH_RESULTS'; payload: Movie[] }
    | { type: 'TOGGLE_FAVORITE'; payload: number }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    // New actions for filtering
    | { type: 'SET_GENRES'; payload: Genre[] }
    | { type: 'SET_GENRE_FILTER'; payload: number | null };