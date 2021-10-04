import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {  MatDialog } from '@angular/material/dialog';
import { Hero } from '../hero';
import { ConfirmationDialog } from './confirmation-dialog.component';
import { HeroService } from '../hero.service';
import { Observable, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: [ './hero-detail.component.css' ]
})
export class HeroDetailComponent implements OnInit {
  hero: Hero | undefined;
  showMainContent: Boolean = true;
  incorrect: Boolean = true;
  heroes$!: Observable<Hero[]>;
  userName: Boolean = true;
  private searchTerms = new Subject<string>();

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.getHero();
    this.startCounter();  
    this.heroes$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.heroService.searchHeroesName(term)),
    );
  }

  res: Observable<String>;
  determinateCnt = 0;
  startCounter() {
    setInterval(() => {
       this.determinateCnt += 60;
    }, 100);
    this.res = of("  ").pipe (delay(2100));
  }
  
  progressInLoading() {
    console.log('Determinate mode: '+ this.determinateCnt + '% completed...');
  }  

  getHero(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.heroService.getHero(id)
    .subscribe(hero => this.hero = hero);
  }

  goBack(): void {
    const dialogRef = this.dialog.open(ConfirmationDialog,{
      data:{
        message: 'Are you sure you want to leave page without saving??',
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

  back(): void {
    this.location.back();
  }

  save (hero: Hero, name: string, country: string, age: string): void {
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
            if ((nums[1] == name || nums[2] == name) && i+1 !==hero.id) {
              this.userName = false;
             return          
            }
          }
          for (let i = 1; i < 101; i++)
          if (age == String(i)  && (nums[1] !== name || nums[2] !== name)) {
            this.showMainContent = true;
            this.userName = true;
            if (this.hero) {
              this.heroService.updateHero(this.hero)
              .subscribe(() => this.back());
            }
          break;
        }
        else {
          this.showMainContent = false;
        }
        });
  }
}