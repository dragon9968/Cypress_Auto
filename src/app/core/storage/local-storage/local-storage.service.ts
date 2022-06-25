import { Injectable } from '@angular/core';
import { LocalStorageKeys } from 'src/app/enums/storage/local-storage-keys.enum';
import { LocalStorageData } from 'src/app/models/storage/local-storage-data.model';

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
