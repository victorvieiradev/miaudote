export class Cat {
  constructor({
    id,
    name,
    photo,
    description,
    status = "available",
    adopter = null,
    // Novos campos (permite que o backend mantenha os dados do frontend)
    estimatedAge,
    sex,
    breed,
    coat,
    microchip,
    rescuedAt,
    rescueLocation,
    origin,
    rescuer,
    initialWeight,
    bodyCondition,
    spayedNeutered,
    vaccination,
    fivFelv,
    deworming,
    temperament,
    sociability,
    habits,
  }) {
    this.id =
      id || Date.now().toString() + Math.random().toString(36).substr(2, 9);
    this.name = name;
    this.photo = photo;
    this.description = description;
    this.status = status;
    this.adopter = adopter;

    // Campos adicionais do formulário
    this.estimatedAge = estimatedAge;
    this.sex = sex;
    this.breed = breed;
    this.coat = coat;
    this.microchip = microchip;
    this.rescuedAt = rescuedAt;
    this.rescueLocation = rescueLocation;
    this.origin = origin;
    this.rescuer = rescuer;
    this.initialWeight = initialWeight;
    this.bodyCondition = bodyCondition;
    this.spayedNeutered = spayedNeutered;
    this.vaccination = vaccination;
    this.fivFelv = fivFelv;
    this.deworming = deworming;
    this.temperament = temperament;
    this.sociability = sociability;
    this.habits = habits;
  }
}