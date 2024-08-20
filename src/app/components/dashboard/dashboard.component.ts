import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MenubarComponent } from '../menubar/menubar.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HttpClientModule, RouterLink, MatButtonModule, MenubarComponent, MatSidenavModule, MatListModule, MatIconModule, RouterOutlet, RouterLinkActive],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  constructor(
    private matIconRegistry: MatIconRegistry,
    domSanitizer: DomSanitizer,
  ) {
    this.matIconRegistry.addSvgIcon('word', domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/word.svg')); // TODO: add more icons
  }
}
