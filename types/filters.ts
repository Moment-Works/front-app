/**
 * Filter and pagination types
 */

export interface CategoryFilter {
  id: string;
  name: string;
  count: number; // Number of articles in category
}

export interface FilterState {
  selectedCategoryId: string | null;
}
