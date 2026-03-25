/**
 * Adoption Entity - Representa uma adoção
 * Separa a lógica de adoção da entidade Cat
 */
export class Adoption {
  constructor({
    id,
    cat_id,
    adopter_id,
    applicationDate = new Date().toISOString(),
    approvalDate = null,
    completionDate = null,
    status = 'pending', // pending, approved, rejected, completed
    notes = '',
    rejectionReason = '',
    createdAt = new Date().toISOString(),
    updatedAt = null,
  }) {
    this.id = id || `adoption-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.cat_id = cat_id;
    this.adopter_id = adopter_id;
    this.applicationDate = applicationDate;
    this.approvalDate = approvalDate;
    this.completionDate = completionDate;
    this.status = status;
    this.notes = notes;
    this.rejectionReason = rejectionReason;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    this.validate();
  }

  validate() {
    if (!this.cat_id) {
      throw new Error('ID do gato é obrigatório');
    }
    if (!this.adopter_id) {
      throw new Error('ID do adotante é obrigatório');
    }
    if (!['pending', 'approved', 'rejected', 'completed'].includes(this.status)) {
      throw new Error('Status deve ser pending, approved, rejected ou completed');
    }
  }

  approve(notes = '') {
    if (this.status !== 'pending') {
      throw new Error('Apenas adoções pendentes podem ser aprovadas');
    }
    this.status = 'approved';
    this.approvalDate = new Date().toISOString();
    this.notes = notes;
    this.updatedAt = new Date().toISOString();
  }

  reject(reason = '') {
    if (this.status !== 'pending') {
      throw new Error('Apenas adoções pendentes podem ser rejeitadas');
    }
    this.status = 'rejected';
    this.rejectionReason = reason;
    this.updatedAt = new Date().toISOString();
  }

  complete() {
    if (this.status !== 'approved') {
      throw new Error('Apenas adoções aprovadas podem ser completadas');
    }
    this.status = 'completed';
    this.completionDate = new Date().toISOString();
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

  isCompleted() {
    return this.status === 'completed';
  }
}