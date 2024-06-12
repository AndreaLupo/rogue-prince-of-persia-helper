import { derived } from "svelte/store";
import medallionStore from "./medallion.store";
import { filteringCriteria, type ActionFilter, type Filter, type UpgradableFilter } from "./medallions-filtering-criteria.store";
import type { Medallion } from "../types";

export const filteredMedallions = derived(
  [medallionStore, filteringCriteria],
  ([$medallionStore, $filteringCriteria]) => {
    // Function to check if a medallion matches an ActionFilter
    const matchesActionFilter = (medallion: Medallion, filter: ActionFilter): boolean => {
      return medallion.triggeringAction === filter.triggeringAction;
    };

    // Function to check if a medallion matches an UpgradableFilter
    const matchesUpgradableFilter = (medallion: Medallion, filter: UpgradableFilter): boolean => {
      return medallion.attributes.some(attribute => attribute.upgradable === filter.upgradable);
    };

    // Function to check if a medallion matches a filter
    const matchesFilter = (medallion: Medallion, filter: Filter): boolean => {
      switch (filter.type) {
        case 'action':
          return medallion.triggeringAction === (filter as ActionFilter).triggeringAction;
        case 'upgradable':
          return medallion.attributes.some(attribute => attribute.upgradable === (filter as UpgradableFilter).upgradable);
        default:
          return true; // If filter type is not recognized, consider it as matching
      }
    };

    // Function to check if a medallion matches all filters
    const matchesAllFilters = (medallion: Medallion): boolean => {
      return $filteringCriteria.every(filter => matchesFilter(medallion, filter));
    };

    // Filtered medallions based on the filtering criteria
    const filteredMedallions = $medallionStore.filter(matchesAllFilters);

    return filteredMedallions;
  }
);
