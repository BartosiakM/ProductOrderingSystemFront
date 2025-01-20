import React from 'react';

interface Category {
  id: number;
  name: string;
}

interface FilterBarProps {
  search: string;
  category: string;
  categories: Category[];
  onSearchChange: (search: string) => void;
  onCategoryChange: (category: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  search,
  category,
  categories,
  onSearchChange,
  onCategoryChange,
}) => {
  return (
    <div className="row mb-3">
      <div className="col-md-6">
        <input
          type="text"
          className="form-control"
          placeholder="Szukaj po nazwie..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="col-md-6">
        <select
          className="form-select"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)} // Teraz oczekuje string
        >
          <option value="">Wszystkie kategorie</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id.toString()}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
