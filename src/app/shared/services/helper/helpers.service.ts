import { Injectable } from '@angular/core';
import { Option } from 'src/app/shared/models/option.model'

@Injectable({
    providedIn: 'root'
})
export class HelpersService {

    constructor() { }

    optionDisplay(option: Option) {
        return option && option.name ? option.name : '';
    }
}
