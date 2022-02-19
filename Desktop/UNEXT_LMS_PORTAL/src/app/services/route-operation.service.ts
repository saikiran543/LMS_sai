import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { combineLatest, filter, map, Observable, of, ReplaySubject, switchMap } from 'rxjs';
import { isEqual } from "lodash";

@Injectable({
  providedIn: 'root'
})
export class RouteOperationService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  eventQueue = new ReplaySubject<any>(1);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  existingParams: any= {};
  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    combineLatest([this.router.events.pipe(filter((event)=>event instanceof NavigationEnd)),this.activatedRoute.queryParams])
      .subscribe(()=>{
        this.getUrlParams();
      });
  }
  
  getUrlParams() :void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getParams = (route: any) => ({
      ...route.params,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...route.children.reduce((acc: any, child: any) =>
        ({ ...getParams(child), ...acc }), {})
    });
    const urlParams = getParams(this.router.routerState.snapshot.root);
    const params = {params: urlParams,queryParams: this.activatedRoute.snapshot.queryParams};
    if(!isEqual(params, this.existingParams)){
      this.existingParams = params;
      this.eventQueue.next(params);
    }
  }

  listen(key: string):Observable<string>{
    const obs = this.eventQueue.asObservable().pipe(
      switchMap(data=>{
        return of({...data.params,...data.queryParams});
      }),
      map(data=>data[key])
    );
    return obs;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listenParams():Observable<any>{
    const obs = this.eventQueue.asObservable().pipe(
      map(data=>data['params'])
    );
    return obs;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listenQueryParams():Observable<any>{
    const obs = this.eventQueue.asObservable().pipe(
      map(data=>data['queryParams'])
    );
    return obs;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listenAllParams():Observable<any>{
    const obs = this.eventQueue.asObservable();
    return obs;
  }
}
