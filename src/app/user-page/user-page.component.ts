import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { DirectorDialogComponent } from '../director-dialog/director-dialog.component';
import { GenreDialogComponent } from '../genre-dialog/genre-dialog.component';
import { MovieDetailsDialogComponent } from '../movie-details-dialog/movie-details-dialog.component';

@Component({
  selector: 'app-user-page',
  standalone: false,
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss'
})
export class UserPageComponent implements OnInit{
  @Input() userData = JSON.parse(localStorage.getItem('user') || '');
  favoriteMovies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void { 
    this.fetchData();
  }

  fetchData(): void {
    const userData = JSON.parse(localStorage.getItem('user') || '');
    if (userData === '') {
      this.router.navigate(['/welcome']);
      return;
    }
    const userName = userData.Username;
    this.fetchApiData.getUser(userName);
    this.getFavoriteMovies();
  }

  updateUserData(): void {
    let userData = JSON.parse(localStorage.getItem('user') || '');
    if (userData === '') {
      this.router.navigate(['/welcome']);
      return;
    }
    const userName = userData.Username;
    this.fetchApiData.editUser(userName).subscribe(
      (result) => {
        this.snackBar.open('Update Successful', 'OK', {
          duration: 2000,
        });
        this.fetchApiData.getUser(userName).subscribe((result) => 
        {userData = result;
          localStorage.setItem('user', JSON.stringify(result))
        })
      },
      (result) => {
        this.snackBar.open('Update Failed ' + result, 'OK', {
          duration: 2000,
        });
      }
    )
  }

  getFavoriteMovies(): void {
    const userData = JSON.parse(localStorage.getItem('user') || '');
    if (userData === '') {
      this.router.navigate(['/welcome']);
      return;
    }
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      const allMovies: any[] = resp;
      this.favoriteMovies = allMovies.filter((movie) =>
      userData.Favorites.includes(movie._id)
    );
    return this.favoriteMovies;
    });
  }

  removeFavorite(movieId: string): void {
    const localFavorites: any[] = [...this.favoriteMovies];

    const filteredFavorites: any[] = localFavorites.filter((m) => m._id !== movieId);
    const favoriteIds: string[] = filteredFavorites.map((favorite) => favorite._id);
    
    const favoriteMovies = {
      FavoriteMovies: favoriteIds,
    };

    this.favoriteMovies = filteredFavorites;

    const userData = JSON.parse(localStorage.getItem('user') || '');
    if (userData === '') {
      this.router.navigate(['/welcome']);
      return;
    }
    const userName = userData.Username;
    this.fetchApiData.removeFavoriteMovie(userName, movieId).subscribe(
      (result) => {
        this.snackBar.open('Movie removed from favorites', 'OK', {
          duration: 2000
        });
        
      },
      (result) => {
        this.snackBar.open('Failed to remove ' + result, 'OK', {
          duration: 2000
        });
      }
    );
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
