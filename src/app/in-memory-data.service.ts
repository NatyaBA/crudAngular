import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Hero } from './hero';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const heroes = [
      { id: 1, name: 'Ithan', age: '17', country: 'Latvia' },
      { id: 2, name: 'Martin', age: '23', country: 'Norway' },
      { id: 3, name: 'Samanta', age: '13', country: 'Iceland' },
      { id: 4, name: 'Rose', age: '42', country: 'Sweden' }

    ];
    return {heroes};
  }

  genId(heroes: Hero[]): number {
    return heroes.length > 0 ? Math.max(...heroes.map(hero => hero.id)) + 1 : 1;
  }
}