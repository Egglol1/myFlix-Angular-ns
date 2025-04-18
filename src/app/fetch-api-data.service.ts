import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

const apiUrl = 'https://movie-api-x3ci.onrender.com/'
@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService {
  // Inject the HttpClient module to contructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {
  }
    //making the api call for the user registration endpoint
    public userRegistration(userDetails: any): Observable<any> {
      console.log(userDetails);
      return this.http.post(apiUrl + 'user', userDetails).pipe(
        catchError(this.handleError)
      );
    }

    //making the api call for the login endpoint
    public userLogin(userDetails: any): Observable<any> {
      return this.http.post(apiUrl + 'login', userDetails).pipe(
        map((response: any) => {
          if (response.token) {
            localStorage.setItem('token', response.token); // Store token after login
          }
          return response;
        }),
        catchError(this.handleError)
    );
    }
  
    //get auth headers
    private getAuthHeaders(): HttpHeaders {
      const token = localStorage.getItem('token') || '';
      return new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
    }

    //api call for all movies
    public getAllMovies(): Observable<any> {
      return this.http.get(apiUrl + 'movies', { headers: this.getAuthHeaders() }).pipe(
        map(this.extractResponseData), catchError(this.handleError)
      );
    }

    //get one movie
    public getMovie(movieId: string): Observable<any> {
      return this.http.get(apiUrl + `movies/${movieId}`, { headers: this.getAuthHeaders() }).pipe(
        map(this.extractResponseData), catchError(this.handleError)
      );
    }

    //get one director
    public getDirector(directorName: string): Observable<any> {
      return this.http.get(apiUrl + `directors/${directorName}`, { headers: this.getAuthHeaders() }).pipe(
        map(this.extractResponseData), catchError(this.handleError)
      );
    }

    //get one genre
    public getGenre(genreName: string): Observable<any> {
      return this.http.get(apiUrl + `genres/${genreName}`, { headers: this.getAuthHeaders() }).pipe(
        map(this.extractResponseData), catchError(this.handleError)
      );
    }

    //get user data
    public getUser(userName: string): Observable<any> {
      return this.http.get(apiUrl + `user/${userName}`, { headers: this.getAuthHeaders() }).pipe(
        map(this.extractResponseData), catchError(this.handleError)
      );
    }

    //get a user's list of favorite movies
    public getFavoriteMovies(userName: string): Observable<any> {
      return this.http.get(apiUrl+ `user/${userName}/movies`, { headers: this.getAuthHeaders() }).pipe(
        map(this.extractResponseData), catchError(this.handleError)
      );
    }

    //add a movie to a user's list of favorite movies
    public addFavoriteMovie(userName: string, movieId: string): Observable<any> {
      return this.http.post(apiUrl + `user/${userName}/movies/${movieId}`, {}, { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
    }

    //edit a user's information
    public editUser(updatedDetails: any): Observable<any> {
      return this.http.put(apiUrl + 'user', updatedDetails, { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
    }

    //deletes a user
    public deleteUser(): Observable<any> {
      return this.http.delete(apiUrl + 'user', { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
    }

    //remove a movie from a user's favorite list
    public removeFavoriteMovie(userName: string, movieId: string): Observable<any> {
      return this.http.delete(apiUrl + `user/${userName}/movies/${movieId}`, { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
    }

    //Extract response data
    private extractResponseData(res: any): any {
    return res || {};
  }

    private handleError(error: HttpErrorResponse): any {
      if (error.error instanceof ErrorEvent) {
        console.error('Some error has occured', error.error.message);
      } else {
        console.error(
          `Error Status code ${error.status}, ` +
          `Error Body is: ${error.error}`
        );
      }
      return throwError(
        'Something bad happened; please try again later.'
      );
    }
}
