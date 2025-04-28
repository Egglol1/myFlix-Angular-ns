import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service'
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DirectorDialogComponent } from '../director-dialog/director-dialog.component';
import { GenreDialogComponent } from '../genre-dialog/genre-dialog.component';
import { MovieDetailsDialogComponent } from '../movie-details-dialog/movie-details-dialog.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
  standalone: false
})
export class MovieCardComponent implements OnInit{
  movies: any[] = [];
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) { }

ngOnInit(): void {
  this.getMovies();
}

getMovies(): void {
  this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }


  isFavorite(movieId: string): boolean {
    const localUser: string | null = localStorage.getItem('user');
    const parsedUser: any = localUser && JSON.parse(localUser);
    return parsedUser.FavoriteMovies.includes(movieId);
  }

  handleFavorite(movieId: string): void {
    const localUser: string | null = localStorage.getItem('user');
    const parsedUser: any = localUser && JSON.parse(localUser);

    const localFavorites: string[] =[...parsedUser.Favorites];
    if (!localFavorites.includes(movieId)) {
      localFavorites.push(movieId);
      this.fetchApiData.addFavoriteMovie(parsedUser.Username, movieId).subscribe(
       (result) => {
        this.snackBar.open(
            'Movie added to favorites',
          'OK',
          {
            duration: 2000,
          }
        );
        localStorage.setItem('user', JSON.stringify(parsedUser));
      }, 
      )
    } else {
      const removeFavorite: number = localFavorites.findIndex((m) => m === movieId);
      localFavorites.splice(removeFavorite, 1);
      this.fetchApiData.removeFavoriteMovie(parsedUser.Username, movieId).subscribe(
       (result) => {
        this.snackBar.open(
            'Movie removed from favorites',
          'OK',
          {
            duration: 2000,
          }
        );
        localStorage.setItem('user', JSON.stringify(parsedUser));
      }, 
      )
    }
  }

  openDirectorDialog(director: any): void {
    this.dialog.open(DirectorDialogComponent, {
      width: '400px',
      data: director,
    });
  }

  openGenreDialog(genre: any): void {
    this.dialog.open(GenreDialogComponent, {
      width: '400px',
      data: genre,
    });
  }

  openMovieDetailsDialog(movie: any): void {
    this.dialog.open(MovieDetailsDialogComponent, {
      width: '400px',
      data: movie,
    });
  }

}