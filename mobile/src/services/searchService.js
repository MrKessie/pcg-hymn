// src/services/searchService.js
import { searchHymns as dbSearch } from '../database/localDb';

export const performSearch = async (query) => {
  if (!query || query.trim().length === 0) {
    return [];
  }
  return await dbSearch(query.trim());
};