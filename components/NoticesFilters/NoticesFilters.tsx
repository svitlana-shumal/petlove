'use client';

import { useEffect, useState } from 'react';
import css from './NoticesFilters.module.css';
import SearchField from '@/components/SearchField/SearchField';
import { getCategories, getSpecies, getSex, searchCities } from '@/lib/clientApi';
import { Category, City, FiltersState, Sex, Species } from '@/types/notices';
import AsyncSelect from 'react-select/async';

import { components, DropdownIndicatorProps, GroupBase } from 'react-select';

interface NoticesFiltersProps {
  onFilterChange: (filters: FiltersState) => void;
}
interface LocationOption {
  value: string;
  label: string;
  data: City;
}
export default function NoticesFilters({ onFilterChange }: NoticesFiltersProps) {
  const [openCategory, setOpenCategory] = useState(false);
  const [openSex, setOpenSex] = useState(false);
  const [openSpecies, setOpenSpecies] = useState(false);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [sex, setSex] = useState<Sex | null>(null);
  const [species, setSpecies] = useState<Species | null>(null);
  const [locationId, setLocationId] = useState<string | null>(null);
  const [sort, setSort] = useState<'popular' | 'unpopular' | 'cheap' | 'expensive' | null>(null);
  const [categoriesOptions, setCategoriesOptions] = useState<{ value: string; label: string }[]>(
    []
  );
  const [sexOptions, setSexOptions] = useState<{ value: string; label: string }[]>([]);
  const [speciesOptions, setSpeciesOptions] = useState<{ value: string; label: string }[]>([]);

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

  // const handleReset = () => {
  //   const defaults = {
  //     search: '',
  //     category: null,
  //     sex: null,
  //     species: null,
  //     locationId: null,
  //     sort: 'popular',
  //   };
  //   setSearch(defaults.search);
  //   setCategory(defaults.category);
  //   setSex(defaults.sex);
  //   setSpecies(defaults.species);
  //   setLocationId(defaults.locationId);
  //   setSort(defaults.sort);
  //   onFilterChange(defaults);
  // };

  const DropdownIndicator = (
    props: DropdownIndicatorProps<LocationOption, false, GroupBase<LocationOption>>
  ) => {
    const isOpen = props.selectProps.menuIsOpen;
    return (
      <components.DropdownIndicator {...props}>
        <svg width={18} height={18}>
          <use href={isOpen ? '/symbol-defs.svg#icon-x' : '/symbol-defs.svg#icon-search'} />
        </svg>
      </components.DropdownIndicator>
    );
  };

  return (
    <div className={css.filters}>
      <div className={css.contType}>
        <SearchField onSearch={setSearch} placeholder="Search" className={css.search} />

        <div className={css.contCategor}>
          <div className={css.selectWrapper}>
            <select
              value={category ?? ''}
              onChange={(e) => setCategory((e.target.value || null) as Category | null)}
              className={css.select}
              onFocus={() => setOpenCategory(true)}
              onBlur={() => setOpenCategory(false)}
            >
              <option value="">Category</option>
              {categoriesOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className={css.iconToggle}>
              <svg width={18} height={18}>
                <use
                  href={
                    openCategory
                      ? '/symbol-defs.svg#icon-chevron-up'
                      : '/symbol-defs.svg#icon-chevron-down'
                  }
                />
              </svg>
            </span>
          </div>

          <div className={css.selectWrapper}>
            <select
              value={sex ?? ''}
              onChange={(e) => setSex((e.target.value || null) as Sex | null)}
              className={css.select}
              onFocus={() => setOpenSex(true)}
              onBlur={() => setOpenSex(false)}
            >
              <option value="">By gender</option>
              {sexOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className={css.iconToggle}>
              <svg width={18} height={18}>
                <use
                  href={
                    openSex
                      ? '/symbol-defs.svg#icon-chevron-up'
                      : '/symbol-defs.svg#icon-chevron-down'
                  }
                />
              </svg>
            </span>
          </div>
        </div>
        <div className={css.selectWrapper}>
          <select
            value={species ?? ''}
            onChange={(e) => setSpecies((e.target.value || null) as Species | null)}
            className={css.selectType}
            onFocus={() => setOpenSpecies(true)}
            onBlur={() => setOpenSpecies(false)}
          >
            <option value="">By type</option>
            {speciesOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className={css.iconToggle}>
            <svg width={18} height={18}>
              <use
                href={
                  openSpecies
                    ? '/symbol-defs.svg#icon-chevron-up'
                    : '/symbol-defs.svg#icon-chevron-down'
                }
              />
            </svg>
          </span>
        </div>

        <AsyncSelect<LocationOption, false>
          cacheOptions
          loadOptions={loadLocations}
          defaultOptions
          onChange={(opt) => setLocationId(opt?.value ?? null)}
          placeholder="Location"
          classNamePrefix="location"
          components={{ DropdownIndicator }}
          styles={{
            control: (base) => ({
              ...base,
              width: 295,
              minHeight: 42,
              borderRadius: 30,
              border: 'none',
              boxShadow: 'none',
              '&:hover': {
                borderColor: 'var(--primary-orange)',
              },
            }),
            placeholder: (base) => ({
              ...base,
              width: 270,
              fontWeight: 500,
              fontSize: 14,
              lineHeight: 1.3,
              color: 'var(--secondary)',
            }),
            valueContainer: (base) => ({
              ...base,
              paddingLeft: 12,
            }),

            dropdownIndicator: (base) => ({
              ...base,
              stroke: 'var(--secondary)',
              fill: 'var(--text)',
            }),
            indicatorsContainer: (base) => ({ ...base, paddingRight: 4 }),

            indicatorSeparator: () => ({
              display: 'none',
            }),
          }}
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
      {/* <button type="button" onClick={handleReset} className={css.resetBtn}>
        Reset
      </button> */}
    </div>
  );
}
