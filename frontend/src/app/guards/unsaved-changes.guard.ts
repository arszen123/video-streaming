import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OnUnsavedChanges } from '../interfaces/on-unsaved-changes';

@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesGuard implements CanDeactivate<OnUnsavedChanges> {
  canDeactivate(
    component: OnUnsavedChanges,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const changes = component.onUnsavedChanges();
    if (changes instanceof Observable) {
      return (changes as Observable<boolean>).pipe(map(this._transform));
    }
    return this._transform(changes);
  }

  private _transform(changes) {
    switch (typeof changes) {
      case 'string':
        return confirm(changes);
      case 'boolean':
        return changes;
    }
  }
  
}
