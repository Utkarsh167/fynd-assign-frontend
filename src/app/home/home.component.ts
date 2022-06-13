import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  movieList: any=[];
  sortOnBasis = [
    {value: {sortBy:'99popularity', sortOrder:-1}, viewValue: 'Popularity High to Low'},
    {value: {sortBy:'99popularity', sortOrder:1}, viewValue: 'Popularity Low to High'},
    {value: {sortBy:'director', sortOrder:1}, viewValue: 'Director name Ascending'},
    {value: {sortBy:'director', sortOrder:-1}, viewValue: 'Director name Descending'},
    {value: {sortBy:'name', sortOrder:1}, viewValue: 'Movie name Ascending'},
    {value: {sortBy:'name', sortOrder:-1}, viewValue: 'Movie name Descending'},
  ];
  selectedValue;
  constructor(private apiService: ApiService) { }
  total = 0;
  pageNo = 1;
  limit = 9;
  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings: any = {};
  searchModel = '';
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

  sortMovie(e){
    console.log(e);
    this.getMovieList();
  }
  getMovieList() {
    let genres: any = [];
    this.selectedItems.forEach((element: any) => {
      genres.push(element.name)
    });
    let req_var = { limit: this.limit, page: this.pageNo, genre: genres, search: this.searchModel, sort:this.selectedValue };
    console.log(req_var);
    this.apiService.getMovieListWithFilter(req_var).subscribe(res => {
      console.log(res);
      if (res.msg[0].totalCount.length > 0) {
        this.total = res.msg[0].totalCount[0].count;
      }else{
        this.total = 0;
      }
      if (res.msg[0].totalData.length > 0) {
        this.movieList = res.msg[0].totalData;
      }else{
        this.movieList = []
      }
    }, err => {
      console.log(err);
    })
  }

  searchMovies() {
    this.pageNo = 1;
    this.getMovieList();
  }

  resetFilter() {
    this.pageNo = 1;
    this.searchModel = '';
    this.selectedItems = [];
    this.selectedValue=null;
    this.getMovieList();
  }

  pageChanged(e: number) {
    this.pageNo = e;
    // this.getMovieGenres();
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
