import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StorageKey } from '../enums/storageKey';
interface BroadCastObject {
  key: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private dataMap = new Map()
  private eventQueue: ReplaySubject<BroadCastObject>;
  
  constructor(){
    this.eventQueue = new ReplaySubject<BroadCastObject>();
  }
  set(key:string,value:unknown): void{
    this.dataMap.set(key,value);
    this.broadcast(key);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(key:string): any|null{
    if(this.checkData(key)){
      return this.dataMap.get(key);
    }
    throw new Error("Value doesn't exist");
  }

  delete(key:string):void{
    this.dataMap.delete(key);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
  broadcastValue(key:string, value?:any):boolean{
    if(this.checkData(key)|| value){
      this.broadcast(key,value);
      return true;
    }
    throw new Error("Cannot broadcast a non-existent value");
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private broadcast(key:string, value?:any):void{
    value = value || this.get(key);
    this.eventQueue.next({key,value});
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listen(key: string):Observable<any>{
    const obs = this.eventQueue.asObservable().pipe(
      filter((data) => data.key === key),
      map(data=>data.value)
    );
    return obs;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listenMany(keys: Array<string>):Observable<any>{
    const obs = this.eventQueue.asObservable().pipe(
      filter((data) => keys.includes(data.key)),
      map((dataSelected) => dataSelected)
    );
    return obs;
  }
  unsubscribe():void{
    this.eventQueue.complete();
  }
  checkData(key:string): boolean{
    return this.dataMap.has(key);
  }
  clearData(keys: StorageKey[]): void{
    keys.forEach(key=>{
      this.dataMap.delete(key);
    });
  }
}
