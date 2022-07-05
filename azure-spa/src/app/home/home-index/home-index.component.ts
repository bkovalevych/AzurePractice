import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@microsoft/signalr';
import { UserValue } from 'src/app/core/models/values/user-value';
import { AuthService } from 'src/app/core/services/api/auth.service';

@Component({
  selector: 'app-home-index',
  templateUrl: './home-index.component.html',
  styles: []
})
export class HomeIndexComponent implements OnInit {
  user: UserValue;
  createChatModalVisibility = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService) { }

  ngOnInit(): void {

  }

  oncreateChatModalVisibilityChanged(visible: boolean) {
    this.createChatModalVisibility = visible;
  }
}
