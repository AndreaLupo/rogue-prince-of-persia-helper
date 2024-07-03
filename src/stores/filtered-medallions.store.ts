import { derived } from "svelte/store";
import medallionStore from "./medallion.store";
import { filteringCriteria, type ActionFilter, type Filter, type UpgradableFilter, type UpgradeMaskFilter } from "./medallions-filtering-criteria.store";
import type { Medallion, MedallionLevelUpgrade, MedallionUpgradeMask } from "../types";
import sha256 from "crypto-js/sha256";

export const filteredMedallions = derived(
  [medallionStore, filteringCriteria],
  ([$medallionStore, $filteringCriteria]) => {


    // Function to check if a medallion matches a filter
    const matchesFilter = (medallion: Medallion, filter: Filter): boolean => {
      switch (filter.type) {
        case 'action':
          return medallion.triggeringAction === (filter as ActionFilter).triggeringAction;
        case 'upgradable':
          return medallion.attributes.some(attribute => attribute.upgradable === (filter as UpgradableFilter).upgradable);
        case 'upgradeMask':
        const upgradeMasks = filter as UpgradeMaskFilter;
        for(const upgrade of upgradeMasks.upgradeFilter) {
          let mask = upgrade.value as MedallionUpgradeMask;

          return maskUpgradeComparison(medallion.upgradeMask, mask);

        }  
        return false;
        default:
          return true; // If filter type is not recognized, consider it as matching
      }
    };

    const maskUpgradeComparison = (upgradeMask1: MedallionUpgradeMask, upgradeMask2: MedallionUpgradeMask ): boolean => {
      const mask1UsefulUpgrades = upgradeMask1.upgrades.filter(el => el.hop !== 0).sort( (a, b) => a.hop - b.hop);
      const mask2UsefulUpgrades =  upgradeMask2.upgrades.filter(el => el.hop !== 0).sort( (a, b) => a.hop - b.hop);

      const medallionSha = calculateSha256String(mask1UsefulUpgrades);

      const maskSha = calculateSha256String(mask2UsefulUpgrades);

      return medallionSha === maskSha;
    }

    const calculateSha256String = (upgrades: MedallionLevelUpgrade[]): string => {
      const upgradeMaskSha = sha256(JSON.stringify(upgrades));
      return upgradeMaskSha.toString();
    }

    // Function to check if a medallion matches all filters
    const matchesAllFilters = (medallion: Medallion): boolean => {
      return $filteringCriteria.every(filter => matchesFilter(medallion, filter));
    };

    // Filtered medallions based on the filtering criteria
    const filteredMedallions = $medallionStore.filter(matchesAllFilters);

    return filteredMedallions;
  }
);
