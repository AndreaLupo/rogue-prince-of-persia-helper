
import type { TriggeringAction, Upgradable } from './../types';
import { writable } from "svelte/store";

export type ActionFilter = {
  type: 'action';
  triggeringAction: TriggeringAction;
}

export type UpgradableFilter = {
  type: 'upgradable';
  upgradable: Upgradable;
}

export type NameFilter = {
  type: 'name';
  name: string;
}


export type Filter = ActionFilter | UpgradableFilter | NameFilter;


export const filteringCriteria = writable<Filter[]>([]);

export const addFilterToMedallions = (newFilter: Filter) => {
  filteringCriteria.update(filters => [...filters, newFilter]);
}

export const resetMedallionsFilters = () => {
  filteringCriteria.set([]);
}