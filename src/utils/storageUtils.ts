import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = 'userSearchHistory';
const MAX_HISTORY_ITEMS = 10;

/**
 * Saves a new search term to persistent storage.
 * @param {string} term The search term entered by the user.
 */
export async function saveSearchTerm(term: string) {
    const trimmedTerm = term.trim();
    if (!trimmedTerm) return;

    try {
        const historyString = await AsyncStorage.getItem(HISTORY_KEY);
        let history: string[] = historyString ? JSON.parse(historyString) : [];

        history = history.filter(item => item !== trimmedTerm);

        history.unshift(trimmedTerm);

        history = history.slice(0, MAX_HISTORY_ITEMS);

        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));

    } catch (error) {
        console.error("Error saving search history:", error);
    }
}

/**
 * Retrieves the search history from persistent storage.
 * @returns {Promise<string[]>} A promise that resolves to an array of search terms.
 */
export async function getSearchHistory(): Promise<string[]> {
    try {
        const historyString = await AsyncStorage.getItem(HISTORY_KEY);
        return historyString ? JSON.parse(historyString) : [];
    } catch (error) {
        console.error("Error retrieving search history:", error);
        return [];
    }
}

/**
 * Clears the entire search history from persistent storage.
 */
export async function clearSearchHistory() {
    try {
        await AsyncStorage.removeItem(HISTORY_KEY);
    } catch (error) {
        console.error("Error clearing search history:", error);
    }
}