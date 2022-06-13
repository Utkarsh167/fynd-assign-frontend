import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { messages } from '../messages'
import { ApiService } from '../_services/api.service';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.css']
})
export class AddMovieComponent implements OnInit {
	public form: FormGroup;
  message: any;
  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings: any = {};
  movie_id;
  constructor(private fb: FormBuilder,private apiService: ApiService,
    private _snackBar: MatSnackBar, public router: Router,
    private route: ActivatedRoute,
    ) {
      this.route.params
      .subscribe(
        (params: Params) => {
          this.movie_id = params['id'];
        }
      );
     }

  ngOnInit(): void {
    this.form = this.fb.group({
			name: [null, Validators.compose([Validators.required,  Validators.pattern("^[a-zA-Z ]*$")])],
			director: [null, Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z ]*$")])],
			'99popularity': [null, Validators.compose([Validators.required])],
			imdb_score: [null, Validators.compose([Validators.required])],
			genre: [[], Validators.compose([])],
			isOther: [false, Validators.compose([])],
			other: [null, Validators.compose([])],
		});
   
    this.message = messages
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


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 10000,
    });
  }

  getMovieGenres() {
    this.apiService.getMovieGenres().subscribe(res => {
      this.dropdownList = res.msg;
      console.log(res);
      if(this.movie_id){
        this.loadMovieData();
      }
      // this.getMovieList();
    }, err => {
      console.log(err);
    })
  }

  loadMovieData(){
    this.apiService.getMovieData(this.movie_id).subscribe(res => {
      console.log(res);
      let details= res.msg;
      const filterGenre = this.dropdownList.filter((el) => {
        return res.msg.genre.some((f) => {
          return f === el.name;
        });
      });
      details.genre = filterGenre;
      this.form.patchValue(details);

      // this.getMovieList();
    }, err => {
      console.log(err);
    })
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').match(/\s/g)
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  firstCapitalize(e) {
    var textBox: HTMLInputElement = <HTMLInputElement>e.target;
    textBox.value = textBox.value.replace(/(^|[.!?]\s+)([a-z])/g, (m, $1, $2) => $1 + $2.toUpperCase());
  }

  showOptions(event){
    console.log(event)
  }

  addMovie(){
    console.log(this.form.value)
    if(this.form.value.isOther && this.form.value.other!=null && this.form.value.other!=''){
      this.form.value.genre.push({name:this.form.value.other})
    }

    if(this.form.value.genre.length==0){
      this.openSnackBar('Please add atleast one genre eiter already present one or custom','Error')
      return;
    }

    let genre = [];
    this.form.value.genre.forEach(element => {
      genre.push(element.name)
    });

    this.form.value.genre = genre;
    if(!this.movie_id){
    this.apiService.addNewMovie(this.form.value).subscribe(res => {
      // this.dropdownList = res.msg;
      console.log(res);
      this.router.navigate(["/admin/home"]);
      this.openSnackBar('New movie added successfully','success');
      // this.getMovieList();
    }, err => {
      console.log(err);
    })
  }else{
    this.apiService.updateMovie(this.movie_id,this.form.value).subscribe(res => {
      // this.dropdownList = res.msg;
      console.log(res);
      this.router.navigate(["/admin/home"]);
      this.openSnackBar('Movie data updated successfully','success');
      // this.getMovieList();
    }, err => {
      console.log(err);
    })
  }
    
  }

  onItemSelect(item: any) {
    // console.log(item);
    // console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
    // console.log(items);
    // console.log(this.selectedItems);
    setTimeout(() => {
      // console.log(this.selectedItems);
    }, 0);
  }

  onItemDeSelect(items: any) {
    // console.log(items);
    // console.log(this.selectedItems);
    // this.getMovieList()


  }

  onItemDeSelectAll(items: any) {
    // console.log(items);
    setTimeout(() => {
      // console.log(this.selectedItems);
      // this.getMovieList()
    }, 0);
  }
}
