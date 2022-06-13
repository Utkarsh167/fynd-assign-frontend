import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api.service';

@Component({
  selector: 'app-admin-nav-bar',
  templateUrl: './admin-nav-bar.component.html',
  styleUrls: ['./admin-nav-bar.component.css']
})
export class AdminNavBarComponent implements OnInit {
  isShown:boolean=false;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
  }
  logout(){
    this.apiService.userLogout();
  }
}
