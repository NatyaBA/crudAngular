import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import {MatSort} from '@angular/material/sort';


@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
  
export class HeroesComponent implements OnInit {
  heroes: Hero[] = [];
  displayedColumns: string[] = ['id', 'name', 'country', 'age','buttonOne', 'buttonSecond'];
  dataSource:any = [];
  @ViewChild(MatSort) sort: MatSort;



  constructor(private heroService: HeroService){ }

  ngAfterViewInit(): void
  {
    this.heroService.getHeroes().subscribe(heroes => {
      this.dataSource = new MatTableDataSource(heroes);
      if (this.sort) 
      {
          this.dataSource.sort = this.sort;
      }
    });
  }
  ngOnInit() {
    this.getHeroes(); 
  }

  getHeroes(): void {
    this.heroService.getHeroes()
    .subscribe(heroes => this.heroes = heroes);
  }
 

  delete(hero: Hero): void {
   if (confirm('Do you relly want to delete ' + hero.name+ '?')) {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero.id).subscribe();
     this.heroService.getHeroes();
   }
    else return;
  }
}