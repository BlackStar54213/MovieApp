// storageUtils.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = 'userSearchHistory';
const MAX_HISTORY_ITEMS = 10;

/**
 * 📝 Saves a new search term to persistent storage.
 * @param {string} term The search term entered by the user.
 */
export async function saveSearchTerm(term: string) {
    // Only save non-empty, trimmed terms
    const trimmedTerm = term.trim();
    if (!trimmedTerm) return;

    try {
        const historyString = await AsyncStorage.getItem(HISTORY_KEY);
        let history: string[] = historyString ? JSON.parse(historyString) : [];

        // 1. Remove the term if it already exists (to prevent duplicates and move to top)
        history = history.filter(item => item !== trimmedTerm);

        // 2. Add the new term to the beginning of the array
        history.unshift(trimmedTerm);

        // 3. Trim the list to the maximum size
        history = history.slice(0, MAX_HISTORY_ITEMS);

        // 4. Save the updated list
        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));

    } catch (error) {
        console.error("Error saving search history:", error);
    }
}

/**
 * 💾 Retrieves the search history from persistent storage.
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

// You can also export clearSearchHistory if needed