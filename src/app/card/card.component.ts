import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent implements OnInit {
  name: string = '';
  job: string = '';
  company: string = '';
  email: string = '';
  phone: string = '';

  mode: 'edit' | 'preview' = 'edit';

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly location: Location
  ) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      console.log(event);
      if (event instanceof NavigationEnd) {
        const params = this.route.snapshot.queryParams;
        this.name = params['name'] ?? this.name;
        this.job = params['job'] ?? this.job;
        this.company = params['company'] ?? this.company;
        this.email = params['email'] ?? this.email;
        this.phone = params['phone'] ?? this.phone;

        if (this.isAllEmpty()) {
          this.mode = 'edit';
        } else {
          this.mode = 'preview';
        }
      }
    });
  }

  onInputChanges(event: Event): void {
    const url = new URL(window.location.href);
    url.searchParams.set('name', (document.getElementById('name') as HTMLInputElement)?.value);
    url.searchParams.set('job', (document.getElementById('job') as HTMLInputElement)?.value);
    url.searchParams.set('company', (document.getElementById('company') as HTMLInputElement)?.value);
    url.searchParams.set('email', (document.getElementById('email') as HTMLInputElement)?.value);
    url.searchParams.set('phone', (document.getElementById('phone') as HTMLInputElement)?.value);
    this.location.replaceState(url.pathname + url.search);

    this.name = (document.getElementById('name') as HTMLInputElement)?.value;
    this.job = (document.getElementById('job') as HTMLInputElement)?.value;
    this.company = (document.getElementById('company') as HTMLInputElement)?.value;
    this.email = (document.getElementById('email') as HTMLInputElement)?.value;
    this.phone = (document.getElementById('phone') as HTMLInputElement)?.value;
  }

  copyUrl() {
    navigator.clipboard.writeText(window.location.href);
  }

  toggleEdit() {
    if (this.mode === 'edit') {
      this.mode = 'preview';
    } else {
      this.mode = 'edit';
    }
  }

  protected isAllEmpty(): boolean {
    return this.name === '' && this.job === '' && this.company === '' && this.email === '' && this.phone === '';
  }
}
