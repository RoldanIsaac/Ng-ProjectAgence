import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { sideNavItems } from '../../../core/constants/sidebar';
import { UiService } from '../../../services/ui.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, CommonModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  iconsUrl = 'icons';
  isIcon: boolean = false;
  actionIconNames = [];

  sideNavItems = sideNavItems;

  constructor(private uiService: UiService) {}

  // ------------------------------------------------------------------------------------------
  // @ Lifecycle Hooks
  // ------------------------------------------------------------------------------------------

  ngOnInit(): void {
    // Registering Icons
    this.uiService.registerSvgIcons(this.actionIconNames);
    this.isIcon = true;
  }
}
