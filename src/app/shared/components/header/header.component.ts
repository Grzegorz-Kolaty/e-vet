import {Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {AuthService} from "../../../core/services/auth.service";
import { NgOptimizedImage } from '@angular/common'
import {NgbCollapse} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage, NgbCollapse, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  authService = inject(AuthService);
  appTitle = 'PetCareConnect'
  isCollapsed: boolean = true;
}
