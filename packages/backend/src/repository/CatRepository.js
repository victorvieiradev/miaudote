import { Cat } from '../entities/Cat.js';

export class CatRepository {
  constructor() {
    this.cats = this.getSeedData().map(c => new Cat(c));
  }

  getAll() {
    return this.cats;
  }

  save(cats) {
    this.cats = cats;
    return true;
  }

  getSeedData() {
    return [
      {
        id: "1",
        name: "Mingau",
        photo:
          "https://images.unsplash.com/photo-1595433707802-68267d83760a?w=800",
        description: "Um mestre em ronronar e pedir sachê.",
        status: "available",
      },
      {
        id: "2",
        name: "Luna",
        photo:
          "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=800",
        description: "Calma, elegante e adora janelas ensolaradas.",
        status: "available",
      },
      {
        id: "3",
        name: "Simba",
        photo:
          "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800",
        description: "O rei da sala de estar procura sua rainha.",
        status: "available",
      },
    ];
  }
}