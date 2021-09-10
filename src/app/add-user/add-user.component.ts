import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})


export class AddUserComponent implements OnInit {
  heroes: Hero[] = [];
  showMainContent: Boolean = true;
  incorrect: Boolean = true;
  hero: Hero | undefined;

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
    
    console.log('Excecute filter');
    

    this.heroes = this.heroes.filter((hero: Hero) => hero.name === name);
    this.heroes = this.heroes;
    console.log(this.heroes);
// this.heroes = this.heroes.filter(hero => 
 // hero.name === name);
       
    if (!name || !age || !country) { 
      this.incorrect = false;
      this.showMainContent = true;
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
        this.back();
        });
        break;
      }
      else {
        this.showMainContent = false;
      }
    }

    back(): void {
      this.location.back();
    }

    goBack(): void {
      if (confirm('Are you sure you want to leave page without saving?')) {
        this.location.back();
      }
      else return;
    }

    }
  