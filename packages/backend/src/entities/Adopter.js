export class Adopter {
  constructor(name, whatsapp) {
    this.name = name;
    this.whatsapp = whatsapp;
    this.date = new Date().toISOString();
  }
}