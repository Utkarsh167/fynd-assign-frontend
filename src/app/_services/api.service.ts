import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';
import { serverUrl } from './config'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private router: Router,
    // private toastr: ToastrService,
    private http: HttpClient) { }

  public getMovieListWithFilter(filter: any): Observable<any> {
    return this.http.post(serverUrl + 'movie/list', filter);
  }

  public getMovieListAdmin(filter: any): Observable<any> {
    return this.http.post(serverUrl + 'user/list', filter,  { headers: { Authorization: `Bearer ${this.getToken()}` } });
  }
  public signInUser(data: any): Observable<any> {
    return this.http.post(serverUrl + 'user/signin', data);
  }

  getToken() {
    let token = JSON.parse(localStorage.getItem('endUser')).accessToken;
    return token;
  }

  public getMovieGenres(): Observable<any> {
    return this.http.get(serverUrl + 'movie/genres');
  }

  public getMovieData(id): Observable<any> {
    return this.http.get(serverUrl + 'movie/'+id);
  }
  public addNewMovie(data): Observable<any> {
    return this.http.post(serverUrl + 'movie/create', data,  { headers: { Authorization: `Bearer ${this.getToken()}` } });
  }

  public updateMovie(id,data): Observable<any> {
    return this.http.put(serverUrl + 'movie/'+id, data,  { headers: { Authorization: `Bearer ${this.getToken()}` } });
  }

  public deleteMovie(id): Observable<any> {
    return this.http.delete(serverUrl + 'movie/'+id,  { headers: { Authorization: `Bearer ${this.getToken()}` } });
  }

  isUserLoggedIn() {
    let usertype = JSON.parse(localStorage.getItem("endUser")) ? JSON.parse(localStorage.getItem("endUser")).userType : null;
    let userid = JSON.parse(localStorage.getItem("endUser")) ? JSON.parse(localStorage.getItem("endUser")).userId : null;
    if (!usertype || !userid) {
      return false
    } else
      return usertype
  }

  private removeKeyFromStorage(key): any {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key)
    }
    if (sessionStorage.getItem(key)) {
      sessionStorage.removeItem(key)
    }
  }


  public userLogout(urlData = ""): void {
    let userType = JSON.parse(localStorage.getItem("endUser")) ? JSON.parse(localStorage.getItem("endUser")).userType : null;
    let userId = JSON.parse(localStorage.getItem("endUser")) ? JSON.parse(localStorage.getItem("endUser")).userId : null;
    let token = JSON.parse(localStorage.getItem('endUser')) ? JSON.parse(localStorage.getItem('endUser')).accessToken : null;

    this.removeKeyFromStorage('endUser')
    // this.router.navigate(['login'])


    this.http.post(serverUrl + 'user/logout', null, { headers: { Authorization: `Bearer ${token}` } }).subscribe((res) => {
     console.log(res);
      if (res) {
        this.router.navigate(['admin-login'])
      }
      else {
        this.router.navigate(['admin-login'])
      }
    }, err => {
      this.router.navigate(['admin-login'])

    });
  }
}
