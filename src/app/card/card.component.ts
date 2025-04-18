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
  fname: string = '';
  lname: string = '';
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
      if (event instanceof NavigationEnd) {
        const params = this.route.snapshot.queryParams;
        this.fname = params['fname'] ?? this.fname;
        this.lname = params['lname'] ?? this.lname;
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
    url.searchParams.set('fname', (document.getElementById('fname') as HTMLInputElement)?.value);
    url.searchParams.set('lname', (document.getElementById('lname') as HTMLInputElement)?.value);
    url.searchParams.set('job', (document.getElementById('job') as HTMLInputElement)?.value);
    url.searchParams.set('company', (document.getElementById('company') as HTMLInputElement)?.value);
    url.searchParams.set('email', (document.getElementById('email') as HTMLInputElement)?.value);
    url.searchParams.set('phone', (document.getElementById('phone') as HTMLInputElement)?.value);
    this.location.replaceState(url.pathname + url.search);

    this.fname = (document.getElementById('fname') as HTMLInputElement)?.value;
    this.lname = (document.getElementById('lname') as HTMLInputElement)?.value;
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
    return this.fname === '' && this.lname === '' && this.job === '' && this.company === '' && this.email === '' && this.phone === '';
  }

  protected downloadVCARD() {
    this.toFile(this.createVCARD(), 'contact.vcf');
  }

  private createVCARD(): string{
    const vcard: string = 'BEGIN:VCARD\n' +
      'VERSION:3.0\n';
      const n = [this.lname || '', this.fname || '', '', '', ''].join(';')
      const fn = [this.fname || '', this.lname || ''].join(' ').trim();
      const org = this.company || ''
      const title = this.job || ''
      const email = this.email || ''
      const tel = this.phone || ''
      const vCard = vcard +
      'N:' + n + '\n' +
      'FN:' + fn + '\n' +
      'ORG:' + org + '\n' +
      'TITLE:' + title + '\n' +
      'EMAIL:' + email + '\n' +
      'TEL:' + tel + '\n' +
      'END:VCARD';
    return vCard;
  }

  private toFile(vCard: string, filename: string = 'contact.vcf') {
    const blob = new Blob([vCard], { type: 'text/vcard' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
