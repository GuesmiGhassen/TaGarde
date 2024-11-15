import { Component } from '@angular/core';
import { user, HomePageMenu } from '../../../data/data'
import { AuthService } from '../../../auth/auth.service';
import { UserEntityDTO, UserRole } from '../../../models/auth.model';
interface HomePageMenuItem {
  link: string;
  icon: string;
  text: string;
  description: string;
  customStyle: string;
  iconStyle: string;
  role: string[];
}
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {
  currentUser: UserEntityDTO | null = null;
  currentRole: string = '';
  user = user;
  Menu: HomePageMenuItem[] = [];
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.currentRole = this.authService.getCurrentUserRole() || '';
    
    if (this.currentUser && this.currentRole) {
      this.Menu = HomePageMenu.filter(menuItem => 
        menuItem.role.includes(this.currentRole)
      );
    }
  }

  
}
