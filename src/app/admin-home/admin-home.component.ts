import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiService } from '../_services/api.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

  movieList: any = [];
  total = 0;
  pageNo = 1;
  limit = 10;
  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings: any = {};
  searchModel = '';
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['name', 'director', '99popularity', 'genre', 'imdb_score', 'actions'];

  constructor(private apiService: ApiService, private _snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    this.dropdownList = [];
    this.selectedItems = []
    this.dropdownSettings = {
      singleSelection: false,
      idField: '_id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.getMovieGenres();
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
  }
  getMovieList() {
    let genres: any = [];
    this.selectedItems.forEach((element: any) => {
      genres.push(element.name)
    });
    let req_var = { limit: this.limit, page: this.pageNo, genre: genres, search: this.searchModel };
    this.apiService.getMovieListAdmin(req_var).subscribe(res => {
      console.log(res);
      if (res.msg[0].totalCount.length > 0) {
        this.total = res.msg[0].totalCount[0].count;
      } else {
        this.total = 0;
      }
      if (res.msg[0].totalData.length > 0) {
        this.movieList = res.msg[0].totalData;
        this.dataSource = new MatTableDataSource(res.msg[0].totalData);

      } else {
        this.movieList = []
      }
    }, err => {
      console.log(err);
    })
  }

  openEditDialog(id){
    // this.router.navigate
    this.router.navigate(["/admin/add-movie/"+id]);
  }

  openDeleteDialog(id){
    this.apiService.deleteMovie(id).subscribe(res => {
      console.log(res);
      this.openSnackBar('Movie removed Successfully','Success')
      this.getMovieList();
    }, err => {
      console.log(err);
    })
  }

  searchMovies() {
    this.pageNo = 1;
    this.getMovieList();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 10000,
    });
  }

  resetFilter() {
    this.pageNo = 1;
    this.searchModel = '';
    this.selectedItems = [];
    this.getMovieList();
  }

  pageChanged(e: number) {
    this.pageNo = e;
    // this.getMovieGenres();
    this.getMovieList();
  }
  changePage(event: MatPaginator) {
    this.pageNo = event.pageIndex + 1;
    this.limit = event.pageSize
    this.getMovieList();

  }

  getMovieGenres() {
    this.apiService.getMovieGenres().subscribe(res => {
      this.dropdownList = res.msg;
      console.log(res);
      this.getMovieList();
    }, err => {
      console.log(err);
    })
  }

  onItemSelect(item: any) {
    // console.log(item);
    console.log(this.selectedItems);
    this.getMovieList()
  }
  onSelectAll(items: any) {
    // console.log(items);
    // console.log(this.selectedItems);
    setTimeout(() => {
      console.log(this.selectedItems);
      this.getMovieList()
    }, 0);
  }

  onItemDeSelect(items: any) {
    // console.log(items);
    console.log(this.selectedItems);
    this.getMovieList()


  }

  onItemDeSelectAll(items: any) {
    // console.log(items);
    setTimeout(() => {
      console.log(this.selectedItems);
      this.getMovieList()
    }, 0);
  }
}
