import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {

  constructor() { }

  filter(control: FormControl<string | null>, options: string[]) {
    return control.valueChanges.pipe(
        startWith(''),
        map(value => {
            const filterValue = value ? value.toLowerCase() : '';
            return options.filter(option => option.toLowerCase().includes(filterValue));
        }),
    );
}
}
