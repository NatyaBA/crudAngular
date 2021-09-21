import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import {MatSort} from '@angular/material/sort';
import { Observable, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'
import { Location } from '@angular/common';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
  
export class HeroesComponent implements OnInit {
  heroes: Hero[] = [];
  displayedColumns: string[] = ['id', 'name', 'country', 'age','buttonOne', 'buttonSecond'];
  dataSource:any = [];
  heroes$!: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  @ViewChild(MatSort) sort: MatSort;

  constructor(private heroService: HeroService,
    private location: Location){ }

  ngAfterViewInit(): void { 
    this.heroService.getHeroes().subscribe(heroes => {
      this.dataSource = new MatTableDataSource(heroes);
      if (this.sort) {
          this.dataSource.sort = this.sort;
      }
    });
  }

  ngOnInit() {
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
       this.determinateCnt += 13;
    }, 100);

    this.res = of("  ").pipe (delay(2100));
  }
  
  progressInLoading() {
    console.log('Determinate mode: '+ this.determinateCnt + '% completed...');
  }  

  search(term: string): void {
    this.searchTerms.next(term);
  }

  getHeroes(): void {
    this.heroService.getHeroes()
    .subscribe(heroes => this.heroes = heroes);
  }
 
  delete(hero: Hero): void {
   if (confirm('Do you relly want to delete ' + hero.name+ '?')) {
     this.heroes = this.heroes.filter(h => h !== hero);
     this.heroService.deleteHero(hero.id).subscribe();
     this.ngAfterViewInit();
   }
    else return;
  }
}