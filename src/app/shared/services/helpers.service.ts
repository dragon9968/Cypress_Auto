import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs';
import { Option } from 'src/app/shared/models/option.model';

@Injectable({
    providedIn: 'root'
})
export class HelpersService {

    constructor() { }

    filter(control: FormControl<any>, options: Option[]) {
        return control.valueChanges.pipe(
            startWith(''),
            map(value => {
                const name = typeof value === 'string' ? value : value?.name;
                const filterValue = name.toLowerCase();
                return options.filter(option => option.name.toLowerCase().includes(filterValue));
            }),
        );
    }
}
