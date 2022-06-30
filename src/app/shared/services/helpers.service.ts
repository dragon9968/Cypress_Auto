import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {

  constructor() { }

  hexToRGB(hex_color: string): string {
    const hexPattern = '#d{0,}';
    const hexPatternFound = hex_color.match(hexPattern);
    if (hexPatternFound) {
        const r = parseInt(hex_color.slice(1, 3), 16).toString();
        const g = parseInt(hex_color.slice(3, 5), 16).toString();
        const b = parseInt(hex_color.slice(5, 7), 16).toString();
        return "rgb(" + r + ',' + g + ',' + b + ")";
    }
    return '';
  }
}
