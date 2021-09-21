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
        message: 'Are you sure want to delete?',
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