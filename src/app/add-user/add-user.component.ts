import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';  

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})


export class AddUserComponent implements OnInit {
  heroes: Hero[] = [];
  
  hero: Hero | undefined;
  showMainContent: Boolean = true;
  incorrect: Boolean = true;
  deleted: Boolean = true;
  constructor(  
    private heroService: HeroService,
    private location: Location) { }

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes()
    .subscribe(heroes => this.heroes = heroes);
  }

  add(name: string, country: string, age: string): void {
    name = name.trim();
    age = age.trim();
    country = country.trim();
  
    if (!name || !age || !country) { 
      this.incorrect = false;
      return; 
    }
      else 
        this.incorrect = true;
    
    for (let i = 1; i < 101; i++)
      if (age == String(i)) {
        this.showMainContent = true;
        this.heroService.addHero({ country, age, name }  as Hero)
        .subscribe(hero => {
        this.heroes.push(hero);
        this.goBack();
        });
        break;
      }
      else {
        this.showMainContent = false;
      }
    }
    goBack(): void {
      this.location.back();
    }
  
    }
  