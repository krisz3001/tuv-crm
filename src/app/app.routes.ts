import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ClientsComponent } from './components/clients/clients.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ClientDetailComponent } from './components/clients/client-detail/client-detail.component';
import { authGuard } from './guards/auth.guard';
import { landingGuard } from './guards/landing.guard';
import { OffersComponent } from './components/offers/offers.component';
import { OfferDetailComponent } from './components/offers/offer-detail/offer-detail.component';

export const routes: Routes = [
  { path: '', component: LandingComponent, title: 'Kezdőlap', canActivate: [landingGuard] },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'clients', pathMatch: 'full' },
      { path: 'clients', component: ClientsComponent, title: 'Ügyfelek' },
      { path: 'clients/:id', component: ClientDetailComponent, title: 'Ügyfél részletek' },
      { path: 'offers', component: OffersComponent, title: 'Ajánlatok' },
      { path: 'offers/:id', component: OfferDetailComponent, title: 'Ajánlat részletek' },
    ],
  },
  { path: '**', component: PageNotFoundComponent },
];
