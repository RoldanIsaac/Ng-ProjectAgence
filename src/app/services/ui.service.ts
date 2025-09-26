import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  iconsUrl = 'icons';

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {}

  registerSvgIcons(iconNames: string[]): void {
    iconNames.forEach((iconName) => {
      this.iconRegistry.addSvgIcon(
        iconName,
        this.sanitizer.bypassSecurityTrustResourceUrl(
          `${this.iconsUrl}/${iconName}.svg`
        )
      );
    });
  }
}
