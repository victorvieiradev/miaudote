/**
 * Cat Entity - Representa um gato no sistema de adoção
 * Contém todas as informações necessárias para gestão e adoção
 */
export class Cat {
  constructor({
    id,
    tenant_id = null,
    name,
    photo,
    description,
    status = "available",
    createdAt = new Date().toISOString(),
    updatedAt = null,
    // Identificação Básica
    estimatedAge,
    sex,
    breed,
    coat,
    microchip,
    // Dados do Resgate
    rescuedAt,
    rescueLocation,
    origin,
    rescuer,
    // Saúde e Clínica
    initialWeight,
    bodyCondition,
    spayedNeutered = false,
    vaccination = [],
    fivFelv = 'Não testado',
    deworming = '',
    // Perfil Comportamental
    temperament = [],
    sociability = [],
    habits = '',
  }) {
    this.id = id || `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.tenant_id = tenant_id;
    this.name = name;
    this.photo = photo;
    this.description = description;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    // Identificação Básica
    this.estimatedAge = estimatedAge;
    this.sex = sex;
    this.breed = breed;
    this.coat = coat;
    this.microchip = microchip;

    // Dados do Resgate
    this.rescuedAt = rescuedAt;
    this.rescueLocation = rescueLocation;
    this.origin = origin;
    this.rescuer = rescuer;

    // Saúde e Clínica
    this.initialWeight = initialWeight;
    this.bodyCondition = bodyCondition;
    this.spayedNeutered = spayedNeutered;
    this.vaccination = vaccination;
    this.fivFelv = fivFelv;
    this.deworming = deworming;

    // Perfil Comportamental
    this.temperament = temperament;
    this.sociability = sociability;
    this.habits = habits;

    this.validate();
  }

  validate() {
    if (!this.name || this.name.trim().length < 1) {
      throw new Error('Nome do gato é obrigatório');
    }
    if (!this.photo) {
      throw new Error('Foto do gato é obrigatória');
    }
    if (!this.description) {
      throw new Error('Descrição do gato é obrigatória');
    }
    if (!['available', 'adopted', 'unavailable'].includes(this.status)) {
      throw new Error('Status deve ser available, adopted ou unavailable');
    }
    if (!this.tenant_id) {
      throw new Error('Tenant ID é obrigatório');
    }
    const validSex = ['Macho', 'Fêmea', 'Femea'];
    if (this.sex && !validSex.includes(this.sex)) {
      throw new Error('Sexo deve ser Macho ou Fêmea (aceita Femea)');
    }

    const validAge = ['Filhote', 'Jovem', 'Adulto', 'Idoso'];
    if (this.estimatedAge && !validAge.includes(this.estimatedAge)) {
      throw new Error('Idade estimada deve ser Filhote, Jovem, Adulto ou Idoso');
    }
  }

  // Métodos de negócio
  isAvailable() {
    return this.status === 'available';
  }

  isAdopted() {
    return this.status === 'adopted';
  }

  canBeAdopted() {
    return this.isAvailable() && this.isHealthy();
  }

  isHealthy() {
    // Lógica básica de saúde - pode ser expandida
    return this.bodyCondition !== 'Crítico' && this.fivFelv !== 'Positivo';
  }

  markAsAdopted() {
    if (!this.isAvailable()) {
      throw new Error('Gato não está disponível para adoção');
    }
    this.status = 'adopted';
    this.updatedAt = new Date().toISOString();
  }

  markAsAvailable() {
    if (this.isAdopted()) {
      throw new Error('Gato adotado não pode voltar a estar disponível');
    }
    this.status = 'available';
    this.updatedAt = new Date().toISOString();
  }

  // Getters para propriedades computadas
  getAgeGroup() {
    return this.estimatedAge || 'Não informado';
  }

  getHealthStatus() {
    if (this.bodyCondition === 'Crítico') return 'Crítico';
    if (this.fivFelv === 'Positivo') return 'Doente';
    return 'Saudável';
  }

  hasVaccination() {
    return Array.isArray(this.vaccination) && this.vaccination.length > 0;
  }

  isSpayedNeutered() {
    return this.spayedNeutered === true;
  }

  // Método para verificar compatibilidade com adotante
  isCompatibleWith(adopterPreferences = {}) {
    // Lógica básica - pode ser expandida
    if (adopterPreferences.noCats && this.temperament.includes('Agressivo')) {
      return false;
    }
    return true;
  }
}