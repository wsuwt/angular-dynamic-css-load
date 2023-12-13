import { DOCUMENT } from '@angular/common';
import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';

import { Toggle } from '@refinitiv-ui/elements/toggle';
import { CheckChangedEvent } from '@refinitiv-ui/elements/event';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('theme') theme!: ElementRef<Toggle>;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  async ngOnInit() {
    await this.loadTheme(this.currentTheme);
  }

  get currentTheme(): string {
    return sessionStorage.getItem('elf-theme') === 'dark' ? 'dark' : 'light';
  }

  get isDarkTheme(): boolean {
    return sessionStorage.getItem('elf-theme') === 'dark';
  }

  private loadCSS(stylesheetName: string) {
    const style = this.document.createElement('link');
    const head = this.document.getElementsByTagName('head')[0];

    style.rel = 'stylesheet';
    style.href = `${stylesheetName}.css`;

    head.appendChild(style);
  }

  async loadTheme(theme: string) {
    this.loadCSS(theme);

    document.documentElement.setAttribute('theme', theme);
    document.documentElement.style.setProperty('--theme', theme);

    return import(`../themes/${theme}`);
  }

  handleThemeToggle(event: Event) {
    const theme = (event as CheckChangedEvent).detail.value ? 'dark' : 'light';
    sessionStorage.setItem('elf-theme', theme);
    window.location.reload();
  }
}
