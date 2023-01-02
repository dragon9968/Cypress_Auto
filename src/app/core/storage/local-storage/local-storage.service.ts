import { Injectable } from '@angular/core';
import { LocalStorageData } from './local-storage-data.model';
import { LocalStorageKeys } from './local-storage-keys.enum';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  clear = localStorage.clear;

  getItem<T extends LocalStorageKeys>(key: T): LocalStorageData[T] | null {
    const storedItem = localStorage.getItem(key);

    if (storedItem) {
      const decodedItem = this.decodeItem<T>(storedItem);

      return decodedItem;
    }

    return null;
  }

  setItem<T extends LocalStorageKeys>(key: T, value: LocalStorageData[T]) {
    const storeValue = this.encodeItem<T>(value);

    localStorage.setItem(key, storeValue);
  }

  removeItem(key: LocalStorageKeys) {
    localStorage.removeItem(key);
  }

  private encodeItem<T extends LocalStorageKeys>(
    item: LocalStorageData[T]
  ): string {
    let encodedItem = JSON.stringify(item);

    encodedItem = btoa(encodedItem);

    return encodedItem;
  }

  private decodeItem<T extends LocalStorageKeys>(
    encodedItem: string
  ): LocalStorageData[T] {
    let decodedItem: string = atob(encodedItem);

    decodedItem = JSON.parse(decodedItem);

    return (decodedItem as unknown) as LocalStorageData[T];
  }
}
