import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { user, menuItems } from '../../../data/data';
import { AuthService } from '../../../auth/auth.service';
import { UserEntityDTO } from '../../../models/auth.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  imageUrl = 'https://res.cloudinary.com/dvw61yp2y/image/upload/v1720356746/Tagad_cr4ngm.png';
  currentUserRole: string | null = null;
  currentUser: UserEntityDTO | null = null;
  roleName: string | null = null;
  user = user;
  link = '';
  isLoading = false;
  menu: { link: string; icon: string; text: string }[] = [];

  @ViewChild('drawer') drawer!: MatSidenav;
  sidenavMode: 'over' | 'side' = 'side';
  isSidenavOpen = true;
  currentRoute: string = '';
  onSidenavToggle(opened: boolean) {
    this.isSidenavOpen = opened;
  }

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute) {
    this.initializeCurrentUserRole();
  }

  onLogout(): void {
    this.authService.logout();
  }
  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      if (result.matches) {
        // Mobile screen detected
        this.sidenavMode = 'over';
        this.isSidenavOpen = false;
      } else {
        // PC screen detected
        this.sidenavMode = 'side';
        this.isSidenavOpen = true;
      }
    });
    this.currentUser = this.authService.getCurrentUser();
    this.roleName = this.getRoleName();
    this.menu = this.getMenuItems();

    this.isSidenavOpen = true;
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }
  getProfile() {
    console.log(this.link)
    this.router.navigate([this.link])
  }
  private getMenuItems(): { link: string; icon: string; text: string }[] {
    if (this.roleName === "ADMIN") {
      this.link = '/admin/EditProfile';
      return menuItems.ROLE_ADMIN;
    } else if (this.roleName == "HOSPITAL_OWNER") {
      this.link = '/hospital-owner/EditProfile'
      return menuItems.ROLE_HOSPITAL_OWNER;
    } else if (this.roleName == "GENERAL_MANAGER") {
      this.link = '/general-manager/EditProfile'
      return menuItems.ROLE_GENERAL_MANAGER;
    } else if (this.roleName == "DEPARTMENT_MANAGER") {
      this.link = '/department-manager/EditProfile'
      return menuItems.ROLE_DEPARTMENT_MANAGER;
    } else if (this.roleName == "DOCTOR") {
      this.link = '/doctor/EditProfile'
      return menuItems.ROLE_DOCTOR;
    } else {
      return [];
    }
  }
  private initializeCurrentUserRole(): void {
    this.currentUserRole = this.authService.getCurrentUserRole();
  }
  private extractRoleName(role: string): string {
    const match = role.match(/^ROLE_(.+)$/);
    return match ? match[1] : '';
  }
  public getRoleName(): string {
    if (this.currentUserRole) {
      return this.extractRoleName(this.currentUserRole);
    } else {
      console.error('Current user role is null or undefined');
      return '';
    }
  }
  isActive(link: string): boolean {
    return this.currentRoute === link;
  }
}
