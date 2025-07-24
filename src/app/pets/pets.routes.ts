import {Routes} from "@angular/router";


export const PETS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./feature/pet-list/pet-list.component')
  },
  {
    path: ':id',
    loadComponent: () => import('./feature/pet-details/pet-details.component')
  }
]
