'use client';

import { useEffect, useState } from 'react';
import css from './NoticesFilters.module.css';
import SearchField from '@/components/SearchField/SearchField';
import { getCategories, getSpecies, getSex, searchCities } from '@/lib/clientApi';
import { Category, City, FiltersState, Sex, Species } from '@/types/notices';
import Select, { DropdownIndicatorProps, GroupBase, SingleValue, StylesConfig } from 'react-select';
import AsyncSelect from 'react-select/async';
import { components } from 'react-select';
interface NoticesFiltersProps {
  onFilterChange: (filters: FiltersState) => void;
}
type Option = { value: string; label: string };
interface LocationOption {
  value: string;
  label: string;
  data: City;
}
export default function NoticesFilters({ onFilterChange }: NoticesFiltersProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [sex, setSex] = useState<Sex | null>(null);
  const [species, setSpecies] = useState<Species | null>(null);
  const [locationId, setLocationId] = useState<string | null>(null);
  const [sort, setSort] = useState<'popular' | 'unpopular' | 'cheap' | 'expensive' | null>(null);
  const [categoriesOptions, setCategoriesOptions] = useState<Option[]>([]);
  const [sexOptions, setSexOptions] = useState<Option[]>([]);
  const [speciesOptions, setSpeciesOptions] = useState<Option[]>([]);
  const [locationValue, setLocationValue] = useState<LocationOption | null>(null);

  useEffect(() => {
    (async () => {
      const categories = await getCategories();
      setCategoriesOptions(categories.map((c: string) => ({ value: c, label: c })));
      const sexes = await getSex();
      setSexOptions(sexes.map((s: string) => ({ value: s, label: s })));
      const species = await getSpecies();
      setSpeciesOptions(species.map((sp: string) => ({ value: sp, label: sp })));
    })();
  }, []);

  const loadLocations = async (inputValue: string): Promise<LocationOption[]> => {
    if (!inputValue) return [];
    const locations: City[] = await searchCities(inputValue);
    return locations.map((loc) => ({
      value: loc._id,
      label: `${loc.cityEn}, ${loc.stateEn}`,
      data: loc,
    }));
  };

  useEffect(() => {
    onFilterChange({ search, category, sex, species, locationId, sort });
  }, [search, category, sex, species, locationId, sort, onFilterChange]);

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setLocationValue(null);
    setLocationId(null);
  };

  const LocationDropdownIndicator: React.FC<
    DropdownIndicatorProps<LocationOption, false, GroupBase<LocationOption>>
  > = (props) => (
    <components.DropdownIndicator {...props}>
      {locationValue && (
        <button
          className={css.clearBtn}
          onClick={handleClear}
          type="button"
          aria-label="Clear location"
        >
          <svg width={18} height={18} className={css.iconX}>
            <use href="/symbol-defs.svg#icon-x" />
          </svg>
        </button>
      )}
      <svg width={18} height={18} className={css.iconSearch}>
        <use href="/symbol-defs.svg#icon-search" />
      </svg>
    </components.DropdownIndicator>
  );

  const optionStyles: StylesConfig<Option, false> = {
    control: (base, state) => ({
      ...base,
      width: '100%',
      minHeight: 42,
      borderRadius: 30,
      border: state.isFocused ? '1px solid var(--primary-orange)' : '1px solid var(--text)',
      boxShadow: 'none',
      backgroundColor: 'var(--text)',
      '&:hover': { borderColor: 'var(--primary-orange)' },
    }),
    menu: (base) => ({
      ...base,
      borderRadius: 15,
      marginTop: 4,
      color: 'rgba(38, 38, 38, 0.6)',
      backgroundColor: 'var(--text)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    }),
    option: (base, state) => ({
      ...base,
      padding: '10px 16px',
      fontSize: 14,
      fontWeight: 500,
      backgroundColor: state.isFocused
        ? 'var(--text)'
        : state.isSelected
          ? 'var(--text)'
          : 'transparent',
      color: state.isSelected ? 'var(--primary-orange)' : 'var(--grey-text)',
      cursor: 'pointer',
    }),
    placeholder: (base) => ({
      ...base,
      fontWeight: 500,
      fontSize: 14,
      color: 'var(--secondary)',
    }),
    valueContainer: (base) => ({ ...base, padding: '0 16px' }),
    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),
    indicatorsContainer: (base) => ({ ...base, paddingRight: 4 }),
    indicatorSeparator: () => ({ display: 'none' }),
  };

  const locationStyles: StylesConfig<LocationOption, false> = {
    control: (base, state) => ({
      ...base,
      minHeight: 42,

      borderRadius: 30,
      border: state.isFocused ? '2px solid var(--primary-orange)' : '1px solid var(--text)',
      boxShadow: 'none',
      backgroundColor: 'var(--text)',
      '&:hover': { borderColor: 'var(--primary-orange)' },
    }),
    menu: (base) => ({
      ...base,
      borderRadius: 12,
      marginTop: 4,
      backgroundColor: 'var(--text)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    }),
    option: (base, state) => ({
      ...base,
      padding: '10px 16px',
      fontSize: 14,
      fontWeight: 500,
      backgroundColor: state.isFocused
        ? 'var(--primary-orange-light)'
        : state.isSelected
          ? 'var(--primary-orange)'
          : 'transparent',
      color: state.isSelected ? '#fff' : 'var(--secondary)',
      cursor: 'pointer',
    }),
    placeholder: (base) => ({
      ...base,
      fontWeight: 500,
      fontSize: 14,
      color: 'var(--secondary)',
    }),
    valueContainer: (base) => ({ ...base, paddingLeft: 12 }),
    indicatorsContainer: (base) => ({ ...base, paddingRight: 4 }),
    indicatorSeparator: () => ({ display: 'none' }),
  };

  return (
    <div className={css.filters}>
      <div className={css.contType}>
        <SearchField onSearch={setSearch} placeholder="Search" className={css.search} />

        <div className={css.contCategor}>
          <Select<Option, false>
            instanceId="category-select"
            options={[{ value: '', label: 'Show all' }, ...categoriesOptions]}
            value={category ? { value: category, label: category } : null}
            onChange={(opt: SingleValue<Option>) =>
              setCategory(opt?.value ? (opt.value as Category) : null)
            }
            placeholder="Category"
            classNamePrefix="custom-select"
            styles={optionStyles}
          />
          <Select<Option, false>
            instanceId="sex-select"
            options={[{ value: '', label: 'Show all' }, ...sexOptions]}
            value={sex ? { value: sex, label: sex } : null}
            onChange={(opt: SingleValue<Option>) => setSex((opt?.value as Sex) ?? null)}
            placeholder="By gender"
            classNamePrefix="custom-select"
            styles={optionStyles}
          />
        </div>

        <Select<Option, false>
          instanceId="species-select"
          options={[{ value: '', label: 'Show all' }, ...speciesOptions]}
          value={species ? { value: species, label: species } : null}
          onChange={(opt: SingleValue<Option>) => setSpecies((opt?.value as Species) ?? null)}
          placeholder="By type"
          classNamePrefix="custom-select"
          styles={optionStyles}
        />
        <AsyncSelect<LocationOption, false>
          instanceId="location-select"
          cacheOptions
          loadOptions={loadLocations}
          defaultOptions
          value={locationValue}
          onChange={(opt) => {
            setLocationValue(opt);
            setLocationId(opt?.value ?? null);
          }}
          placeholder="Location"
          classNamePrefix="location"
          components={{ DropdownIndicator: LocationDropdownIndicator }}
          styles={locationStyles}
        />
      </div>
      <div className={css.sort}>
        {(['popular', 'unpopular', 'cheap', 'expensive'] as const).map((option) => (
          <label key={option} className={`${css.radio} ${sort === option ? css.active : ''}`}>
            <input
              type="radio"
              name="sort"
              value={option}
              checked={sort === option}
              onChange={() => setSort(option)}
              className={css.sortName}
            />
            {option.charAt(0).toUpperCase() + option.slice(1)}
            {sort === option && (
              <button
                type="button"
                className={css.btnDefault}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSort(null);
                }}
              >
                <svg width={18} height={18}>
                  <use href="/symbol-defs.svg#icon-x" />
                </svg>
              </button>
            )}
          </label>
        ))}
      </div>
    </div>
  );
}
