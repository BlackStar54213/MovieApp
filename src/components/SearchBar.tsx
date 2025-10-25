

import React, { useState, useEffect } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Text,
    FlatList,
    Platform,
} from 'react-native';
import { saveSearchTerm, getSearchHistory } from '../utils/storageUtils';

type SearchBarProps = {
    onSearch: (query: string) => void;
    onFocusChange?: (isFocused: boolean) => void;
    onTermSelect?: (term: string) => void;
    initialValue?: string;
};

const SearchBar: React.FC<SearchBarProps> = ({
    onSearch,
    onFocusChange,
    onTermSelect,
    initialValue = '',
}) => {
    const [query, setQuery] = useState(initialValue);
    const [history, setHistory] = useState<string[]>([]);
    const [isFocused, setIsFocused] = useState(false);

    const loadHistory = async () => {
        try {
            const items = await getSearchHistory();
            setHistory(items);
        } catch (err) {
            console.error('Failed to load search history', err);
        }
    };

    useEffect(() => {
        loadHistory();
    }, []);

    useEffect(() => {
        setQuery(initialValue ?? '');
    }, [initialValue]);

    const handleSearch = async () => {
        const trimmed = (query || '').trim();
        if (!trimmed) return;
        try {
            await saveSearchTerm(trimmed);
            await loadHistory();
        } catch (err) {
            console.error('Failed to save search term', err);
        }
        onSearch(trimmed);
        setIsFocused(false);
        onFocusChange?.(false);
    };

    const handleSelectTerm = async (term: string) => {
        setQuery(term);
        onTermSelect?.(term);
        onFocusChange?.(false);
        setIsFocused(false);
        try {
            await saveSearchTerm(term);
            await loadHistory();
        } catch (err) { /**/ }
        onSearch(term);
    };

    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Search movies..."
                    placeholderTextColor="#888"
                    value={query}
                    onChangeText={setQuery}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                    onFocus={() => {
                        setIsFocused(true);
                        onFocusChange?.(true);
                    }}
                    onBlur={() => {
                        setTimeout(() => {
                            setIsFocused(false);
                            onFocusChange?.(false);
                        }, 150);
                    }}
                />
                {query.length > 0 && (
                    <TouchableOpacity
                        onPress={() => {
                            setQuery('');
                            onSearch('');
                        }}
                        style={styles.clearButton}
                    >
                        <Text style={styles.clearText}>✕</Text>
                    </TouchableOpacity>
                )}
            </View>

            {isFocused && history.length > 0 && (
                <View style={styles.dropdownContainer} pointerEvents="box-none">
                    <View style={styles.dropdown}>
                        <Text style={styles.dropdownTitle}>Recent Searches</Text>
                        <FlatList
                            data={history}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => handleSelectTerm(item)}
                                    style={styles.historyItem}
                                >
                                    <Text style={styles.historyText}>{item}</Text>
                                </TouchableOpacity>
                            )}
                            keyboardShouldPersistTaps="handled"
                        />
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        zIndex: 999,
        ...Platform.select({
            ios: { marginTop: 8 },
            android: { marginTop: 8 },
        }),
    },
    container: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#1f1f1f',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: '#2a2a2a',
        color: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        fontSize: 16,
    },
    clearButton: {
        marginLeft: 8,
        padding: 12,
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
    },
    clearText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    dropdownContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 64,
        alignItems: 'center',
        zIndex: 999,
    },
    dropdown: {
        width: '92%',
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        maxHeight: 300,
        overflow: 'hidden',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    dropdownTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    historyItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    historyText: {
        color: '#bbb',
        fontSize: 16,
    },
});

export default SearchBar;