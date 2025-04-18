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
        const n = params['n']?.split(';') ?? [];
        this.fname = n[1] ?? this.fname;
        this.lname = n[0] ?? this.lname;
        this.job = params['job'] ?? this.job;
        this.company = params['org'] ?? this.company;
        this.email = params['eml'] ?? this.email;
        this.phone = params['tel'] ?? this.phone;

        if (this.isAllEmpty()) {
          this.mode = 'edit';
        } else {
          this.mode = 'preview';
        }
      }
    });
  }

  onInputChanges(event: Event): void {
    // Get values from input fields
    const fnameInput = document.getElementById('fname') as HTMLInputElement;
    const lnameInput = document.getElementById('lname') as HTMLInputElement;
    const jobInput = document.getElementById('job') as HTMLInputElement;
    const companyInput = document.getElementById('company') as HTMLInputElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const phoneInput = document.getElementById('phone') as HTMLInputElement;
    
    // Update component properties
    this.fname = fnameInput?.value || '';
    this.lname = lnameInput?.value || '';
    this.job = jobInput?.value || '';
    this.company = companyInput?.value || '';
    this.email = emailInput?.value || '';
    this.phone = phoneInput?.value || '';
    
    // Update URL params with only non-empty values
    const url = new URL(window.location.href);
    
    if (this.lname || this.fname) {
      url.searchParams.set('n', `${this.lname || ''};${this.fname || ''};;;`);
    } else {
      url.searchParams.delete('n');
    }
    
    if (this.job) url.searchParams.set('job', this.job);
    else url.searchParams.delete('job');
    
    if (this.company) url.searchParams.set('org', this.company);
    else url.searchParams.delete('org');
    
    if (this.email) url.searchParams.set('eml', this.email);
    else url.searchParams.delete('eml');
    
    if (this.phone) url.searchParams.set('tel', this.phone);
    else url.searchParams.delete('tel');
    
    this.location.replaceState(url.pathname + url.search);
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
    return (
      this.fname === '' &&
      this.lname === '' &&
      this.job === '' &&
      this.company === '' &&
      this.email === '' &&
      this.phone === ''
    );
  }

  protected downloadVCARD() {
    this.toFile(this.createVCARD(), 'contact.vcf');
  }

  private createVCARD(): string {
    const vcard: string = 'BEGIN:VCARD\n' + 'VERSION:3.0\n';
    const n = [this.lname || '', this.fname || '', '', '', ''].join(';');
    const fn = [this.fname || '', this.lname || ''].join(' ').trim();
    const org = this.company || '';
    const title = this.job || '';
    const email = this.email || '';
    const tel = this.phone || '';
    const vCard =
      vcard +
      'N:' +
      n +
      '\n' +
      'FN:' +
      fn +
      '\n' +
      'ORG:' +
      org +
      '\n' +
      'TITLE:' +
      title +
      '\n' +
      'EMAIL:' +
      email +
      '\n' +
      'TEL:' +
      tel +
      '\n' +
      'END:VCARD';
    return vCard;
  }

  private toFile(vCard: string, filename: string = 'contact.vcf') {
    const blob = new Blob([vCard], { type: 'text/vcard' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
