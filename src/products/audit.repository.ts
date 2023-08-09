import { EntityRepository, Repository } from 'typeorm';
// Entities
import { Audit } from './entities/audit.entity';

@EntityRepository(Audit)
export class AuditRepository extends Repository<Audit> {}
