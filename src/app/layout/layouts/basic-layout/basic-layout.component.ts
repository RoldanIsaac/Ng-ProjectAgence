import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { Subject } from 'rxjs';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-basic-layout',
  imports: [
    MatIconModule,
    RouterOutlet,
    SidebarComponent,
    MatIconModule,
    MatSidenavModule,
    NavbarComponent,
  ],
  templateUrl: './basic-layout.component.html',
  styleUrl: './basic-layout.component.css',
})
export class BasicLayoutComponent {
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  // ------------------------------------------------------------------------------------------
  // @ Lifecycle Hooks
  // ------------------------------------------------------------------------------------------

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
