/**
 * Adopter Entity - Representa um adotante
 * Contém informações completas para avaliação de adoção
 */
export class Adopter {
  constructor({
    id,
    tenant_id,
    name,
    whatsapp,
    email = '',
    phone = '',
    address = '',
    homeType = '', // house, apartment, etc.
    hasOtherPets = false,
    otherPetsDetails = '',
    familyComposition = '',
    hasChildren = false,
    childrenAges = '',
    workSchedule = '',
    adoptionReason = '',
    previousExperience = '',
    status = 'pending', // pending, approved, rejected
    notes = '',
    date = new Date().toISOString(),
    createdAt = new Date().toISOString(),
    updatedAt = null,
  }) {
    this.id = id || `adopter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.tenant_id = tenant_id;
    this.name = name;
    this.whatsapp = whatsapp;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.homeType = homeType;
    this.hasOtherPets = hasOtherPets;
    this.otherPetsDetails = otherPetsDetails;
    this.familyComposition = familyComposition;
    this.hasChildren = hasChildren;
    this.childrenAges = childrenAges;
    this.workSchedule = workSchedule;
    this.adoptionReason = adoptionReason;
    this.previousExperience = previousExperience;
    this.status = status;
    this.notes = notes;
    this.date = date;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    this.validate();
  }

  validate() {
    if (!this.name || this.name.trim().length < 2) {
      throw new Error('Nome deve ter pelo menos 2 caracteres');
    }
    if (!this.whatsapp || !this.isValidPhone(this.whatsapp)) {
      throw new Error('WhatsApp deve ser um número válido');
    }
    if (this.email && !this.isValidEmail(this.email)) {
      throw new Error('Email inválido');
    }
    if (!['pending', 'approved', 'rejected'].includes(this.status)) {
      throw new Error('Status deve ser pending, approved ou rejected');
    }
  }

  isValidPhone(phone) {
    // Remove todos os caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');
    // Deve ter entre 10 e 11 dígitos (com ou sem DDD)
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  approve() {
    this.status = 'approved';
    this.updatedAt = new Date().toISOString();
  }

  reject() {
    this.status = 'rejected';
    this.updatedAt = new Date().toISOString();
  }

  isPending() {
    return this.status === 'pending';
  }

  isApproved() {
    return this.status === 'approved';
  }

  isRejected() {
    return this.status === 'rejected';
  }

  // Método para verificar se o adotante atende aos requisitos básicos
  meetsBasicRequirements() {
    return this.name && this.whatsapp && this.adoptionReason;
  }

  // Método para obter informações de contato primária
  getPrimaryContact() {
    return this.whatsapp || this.phone || this.email;
  }
}