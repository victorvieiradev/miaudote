/**
 * MedicalRecord Entity - Representa um registro médico de um gato
 * Permite histórico médico temporal
 */
export class MedicalRecord {
  constructor({
    id,
    cat_id,
    tenant_id,
    date = new Date().toISOString(),
    type, // vaccination, deworming, surgery, checkup, illness, etc.
    description,
    vet_name = '',
    clinic_name = '',
    medications = [],
    followUpDate = null,
    notes = '',
    cost = 0,
    createdAt = new Date().toISOString(),
    updatedAt = null,
  }) {
    this.id = id || `medical-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.cat_id = cat_id;
    this.tenant_id = tenant_id;
    this.date = date;
    this.type = type;
    this.description = description;
    this.vet_name = vet_name;
    this.clinic_name = clinic_name;
    this.medications = medications;
    this.followUpDate = followUpDate;
    this.notes = notes;
    this.cost = cost;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    this.validate();
  }

  validate() {
    if (!this.cat_id) {
      throw new Error('ID do gato é obrigatório');
    }
    if (!this.type) {
      throw new Error('Tipo do registro médico é obrigatório');
    }
    if (!this.description) {
      throw new Error('Descrição é obrigatória');
    }
    if (!['vaccination', 'deworming', 'surgery', 'checkup', 'illness', 'treatment', 'other'].includes(this.type)) {
      throw new Error('Tipo deve ser vaccination, deworming, surgery, checkup, illness, treatment ou other');
    }
    if (this.cost < 0) {
      throw new Error('Custo não pode ser negativo');
    }
  }

  isVaccination() {
    return this.type === 'vaccination';
  }

  isDeworming() {
    return this.type === 'deworming';
  }

  requiresFollowUp() {
    return this.followUpDate !== null;
  }

  isOverdue() {
    if (!this.followUpDate) return false;
    return new Date(this.followUpDate) < new Date();
  }

  updateNotes(newNotes) {
    this.notes = newNotes;
    this.updatedAt = new Date().toISOString();
  }
}