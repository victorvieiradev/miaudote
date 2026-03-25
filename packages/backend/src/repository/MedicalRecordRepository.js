/**
 * MedicalRecordRepository - Gerencia persistência de registros médicos
 * Suporta injeção de dependência (database adapter)
 */
import { MedicalRecord } from '../entities/MedicalRecord.js';

export class MedicalRecordRepository {
  constructor(databaseAdapter) {
    if (!databaseAdapter) {
      throw new Error('DatabaseAdapter é obrigatório no construtor de MedicalRecordRepository');
    }
    this.database = databaseAdapter;
  }

  getAll(tenantId = null) {
    return this.database.getAllMedicalRecords(tenantId);
  }

  findById(id, tenantId = null) {
    const record = this.database.getAllMedicalRecords(tenantId).find(r => r.id === id);
    return record ? new MedicalRecord(record) : null;
  }

  findByCatId(catId, tenantId = null) {
    return this.database.getAllMedicalRecords(tenantId)
      .filter(r => r.cat_id === catId)
      .map(r => new MedicalRecord(r))
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Mais recente primeiro
  }

  findByType(type, tenantId = null) {
    return this.database.getAllMedicalRecords(tenantId)
      .filter(r => r.type === type)
      .map(r => new MedicalRecord(r));
  }

  findOverdueFollowUps(tenantId = null) {
    const now = new Date();
    return this.database.getAllMedicalRecords(tenantId)
      .filter(r => r.followUpDate && new Date(r.followUpDate) < now)
      .map(r => new MedicalRecord(r));
  }

  create(recordData, tenantId = null) {
    const newRecord = new MedicalRecord({ ...recordData, tenant_id: tenantId });

    const records = this.database.getAllMedicalRecords(tenantId);
    records.push(newRecord);
    this.database.saveMedicalRecords(records);

    return newRecord;
  }

  update(id, updates, tenantId = null) {
    const record = this.findById(id, tenantId);
    if (!record) {
      throw new Error('Registro médico não encontrado');
    }

    const updatedRecord = new MedicalRecord({
      ...record,
      ...updates,
      id: record.id,
      updatedAt: new Date().toISOString(),
    });

    const records = this.database.getAllMedicalRecords(tenantId).map(r =>
      r.id === id ? updatedRecord : r
    );
    this.database.saveMedicalRecords(records);

    return updatedRecord;
  }

  delete(id, tenantId = null) {
    const records = this.database.getAllMedicalRecords(tenantId).filter(r => r.id !== id);
    this.database.saveMedicalRecords(records);
    return true;
  }

  // Métodos específicos para relatórios
  getVaccinationHistory(catId, tenantId = null) {
    return this.findByCatId(catId, tenantId).filter(r => r.isVaccination());
  }

  getDewormingHistory(catId, tenantId = null) {
    return this.findByCatId(catId, tenantId).filter(r => r.isDeworming());
  }

  getTotalCost(catId, tenantId = null) {
    return this.findByCatId(catId, tenantId)
      .reduce((total, record) => total + (record.cost || 0), 0);
  }
}