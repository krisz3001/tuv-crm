import { HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer } from '@angular/material/sidenav';
import { filter, map } from 'rxjs';
import { User } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menubar',
  standalone: true,
  imports: [HttpClientModule, RouterLink, MatButtonModule, MatToolbarModule, MatIconModule],
  templateUrl: './menubar.component.html',
  styleUrl: './menubar.component.css',
})
export class MenubarComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  @Input() drawer!: MatDrawer;
  path = '';
  user!: User;

  ngOnInit(): void {
    this.path = this.activatedRoute.firstChild?.snapshot.title || '';
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
      )
      .subscribe((route) => (this.path = route.snapshot.title || ''));

    this.authService.user.subscribe((user) => {
      if (user) {
        this.user = {
          email: user.email!,
          fullname: user.displayName!,
        };
      } else {
        this.authService.currentUserSignal.set(null);
      }
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
    });
  }
}
