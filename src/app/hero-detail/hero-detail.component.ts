import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: [ './hero-detail.component.css' ]
})
export class HeroDetailComponent implements OnInit {
  hero: Hero | undefined;
  showMainContent: Boolean = true;
  incorrect: Boolean = true;
  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.heroService.getHero(id)
      .subscribe(hero => this.hero = hero);
  }

  goBack(): void {
    if (confirm('Are you sure you want to leave page without saving?')) {
      this.location.back();
    }
    else return;
  }

  back(): void {
      this.location.back();
  }

  save (name: string, country: string, age: string): void {
    name = name.trim();
    age = age.trim();
    country = country.trim();

    if (!name || !age || !country) { 
      this.incorrect = false;
      this.showMainContent = true;
      return; 
    }
    else
    this.incorrect = true;

    for (let i=1; i < 101; i++)
      if (age == String(i)) {
        this.showMainContent = true;
          if (this.hero) {
            this.heroService.updateHero(this.hero)
            .subscribe(() => this.back());
          }
          break;
      }
      else {
        this.showMainContent = false;
      }
  }
}