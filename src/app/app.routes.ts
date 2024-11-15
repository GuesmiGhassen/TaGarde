import { Routes } from '@angular/router';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
export const routeConfig: Routes = [
  { path: '/', 
    component: SignInComponent, 
    title: 'Sign In Page' },
    { path: 'dashboard', component: HomepageComponent },
    { path: 'user', component: SidebarComponent },
];
