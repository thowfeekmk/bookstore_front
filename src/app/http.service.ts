import {Injectable, Input} from '@angular/core';
import {Http, Headers, Response, Request, RequestOptions, RequestOptionsArgs, BaseRequestOptions, RequestMethod, ResponseContentType} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class HttpClient {
  constructor(private http: Http) {}
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  post(url: string, body: any = {}) {
    return this.request(url, RequestMethod.Post, body);
  }

  get(url: string, body: any) {
    return this.request(url, RequestMethod.Get);
  }

  put(url: string, body: any) {
    return this.request(url, RequestMethod.Put, body);
  }

  postAndGetBlob(url: string, body: any = {}) {
    return this.request(url, RequestMethod.Post, body, true);
  }

  private request(url: string, method: RequestMethod, body?: any, isBlob = false): Observable<Response> {

    // const headers = new HttpHeaders()
    //     .set('content-type', 'application/json')
    //     .set('Access-Control-Allow-Origin', '*');
        const headers = new Headers({ 
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods':'*',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Headers': 'X-Requested-With, content-type, X-Token, x-token'
          });
    const options = new RequestOptions();
    options.url = url;
    options.method = method;
    options.body = body;
    //options.headers = headers;
   
    if(isBlob) {
      options.responseType = ResponseContentType.Blob;
    }
    const request = new Request(options);
    return this.http.request(request)
      .catch((error: any) => this.onErrorHandler(error));
  }

  private onErrorHandler(error: any) {
    const errors = error.json();
    if(error.status == 406 && Array.isArray(errors) && errors.indexOf("User is not logged in.") !== -1) {
    } else if (error.status == 401 && Array.isArray(errors) && errors.indexOf("CSRF validation failed") !== -1) {
      // TODO: should logout after getting token
    }
    return Observable.throw(errors);
  }
}