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
import { PricesComponent } from './components/prices/prices.component';
import { ContractsComponent } from './components/contracts/contracts.component';
import { CertificatesComponent } from './components/certificates/certificates.component';
import { ExpertsComponent } from './components/experts/experts.component';
import { StatisticsComponent } from './components/statistics/statistics.component';

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
      { path: 'prices', component: PricesComponent, title: 'Árlista' },
      { path: 'contracts', component: ContractsComponent, title: 'Szerződések' },
      { path: 'certificates', component: CertificatesComponent, title: 'Tanúsítványok' },
      { path: 'experts', component: ExpertsComponent, title: 'Szakértők' },
      { path: 'prices', component: PricesComponent, title: 'Árlista' },
      { path: 'statistics', component: StatisticsComponent, title: 'Statisztika' },
    ],
  },
  { path: '**', component: PageNotFoundComponent },
];
