import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Hero } from '../hero';
import { ConfirmationDialog } from './confirmation-dialog.component';
import { HeroService } from '../hero.service';
import { Observable, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'
import { delay } from 'rxjs/operators';
import {  MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})

export class AddUserComponent implements OnInit {
  heroes: Hero[] = [];
  heroes$!: Observable<Hero[]>;
  showMainContent: Boolean = true;
  incorrect: Boolean = true;
  hero: Hero | undefined;
  userName: Boolean = true;
  
  private searchTerms = new Subject<string>();
  constructor(  
    private heroService: HeroService,
    private location: Location,
    private dialog: MatDialog,) { }

  ngOnInit() {
    this.getHeroes(); 
    this.heroes$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.heroService.searchHeroesName(term)),
    );
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
      this.showMainContent = true;
      this.userName = true;
      return; 
    }
    else 
    this.incorrect = true;
        this.heroService.getHeroes().subscribe( heroes => {
          var nums: string[]= new Array(4);
          
          for(let i=0; i<heroes.length; i++) {
            nums = Object.values(heroes[i])
            if (nums[1] == name || nums[2] == name) {
              this.userName = false;
             return          
            }
          }
          for (let i = 1; i < 101; i++)
          if (age == String(i)  && (nums[1] !== name || nums[2] !== name)) {
            this.showMainContent = true;
            this.userName = true;
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
        });
    }

    back(): void {
      this.location.back();
    }

    goBack(): void {
      const dialogRef = this.dialog.open(ConfirmationDialog,{
        data:{
          message: 'Are you sure you want to leave page without saving?',
          buttonText: {
            cancel: 'Cancle',
            ok: 'Go back'
          }
        }
      });
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          const a = document.createElement('a');
          a.click();
          a.remove();
          this.location.back();
        }
      });
    }
}  