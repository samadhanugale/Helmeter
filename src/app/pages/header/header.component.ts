import { Component, OnInit,EventEmitter ,Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  @Output() toggleSidenavEvent = new EventEmitter<void>();
  isSidenavOpen = false;
  toggleSidenav(): void {
    this.toggleSidenavEvent.emit();
    this.isSidenavOpen = !this.isSidenavOpen;
  }

 
}
