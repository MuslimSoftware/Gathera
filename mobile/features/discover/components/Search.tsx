import React from 'react';
import { getSearchContextValues } from '../context/SearchContext';
import SearchBar from './SearchBar';

export const Search = () => {
    const { query, setQuery } = getSearchContextValues();
    return <SearchBar searchQuery={query} setSearchQuery={setQuery} autoFocus />;
};
