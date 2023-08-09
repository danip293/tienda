import {
  EntitySubscriberInterface,
  EventSubscriber,
  TransactionRollbackEvent,
  TransactionCommitEvent,
  TransactionStartEvent,
  UpdateEvent,
  InsertEvent,
  RemoveEvent,
  Connection,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Audit, Change } from './entities/audit.entity';

import { AuditRepository } from './audit.repository';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ProductsService } from './products.service';

@Injectable()
@EventSubscriber()
export class EntitySubcriber implements EntitySubscriberInterface {
  constructor(
    private readonly connection: Connection,
    @InjectRepository(AuditRepository)
    private readonly repository: AuditRepository,
  ) {
    connection.subscribers.push(this); // <---- THIS
  }
  /**
   * Called after entity is loaded.
   */
  // afterLoad(entity: any) {
  //   console.log(`AFTER ENTITY LOADED: `, entity);
  // }

  /**
   * Called before post insertion.
   */
  // beforeInsert(event: InsertEvent<any>) {
  //   console.log(`BEFORE POST INSERTED: `, event.entity);
  // }

  /**
   * Called after entity insertion.
   */
  // afterInsert(event: InsertEvent<any>) {
  //   console.log(`AFTER ENTITY INSERTED: `, event.entity);
  // }

  /**
   * Called before entity update.
   */
  // beforeUpdate(event: UpdateEvent<any>) {
  //   console.log(`BEFORE ENTITY UPDATED: `, event.entity);
  // }

  /**
   * Called after entity update.
   */
  afterUpdate(event: UpdateEvent<any>) {
    const { databaseEntity, entity, updatedColumns } = event;
    const changes: Change[] = [];

    // Object.entries(databaseEntity).forEach(([key, previous]) => {
    //   const current = entity[key];
    //   if (previous !== current) {
    //     changes[key] = { current, previous };
    //   }
    // });

    updatedColumns.forEach((column) => {
      const change = new Change();
      const name: string = column.propertyName;
      change.fieldName = name;
      change.previous = databaseEntity[name];
      change.current = entity[name];
      changes.push(change);
    });

    const audit = new Audit();
    audit.changes = changes;

    try {
      this.repository.save(audit);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }

  /**
   * Called before entity removal.
   */
  //   beforeRemove(event: RemoveEvent<any>) {
  //     console.log(
  //       `BEFORE ENTITY WITH ID ${event.entityId} REMOVED: `,
  //       event.entity,
  //     );
  //   }

  /**
   * Called after entity removal.
   */
  afterRemove(event: RemoveEvent<any>) {
    console.log(
      `AFTER ENTITY WITH ID ${event.entityId} REMOVED: `,
      event.entity,
    );
  }

  /**
   * Called before entity removal.
   */
  //   beforeSoftRemove(event: SoftRemoveEvent<any>) {
  //     console.log(
  //       `BEFORE ENTITY WITH ID ${event.entityId} SOFT REMOVED: `,
  //       event.entity,
  //     );
  //   }

  /**
   * Called after entity removal.
   */
  //   afterSoftRemove(event: SoftRemoveEvent<any>) {
  //     console.log(
  //       `AFTER ENTITY WITH ID ${event.entityId} SOFT REMOVED: `,
  //       event.entity,
  //     );
  //   }

  /**
   * Called before entity recovery.
   */
  //   beforeRecover(event: RecoverEvent<any>) {
  //     console.log(
  //       `BEFORE ENTITY WITH ID ${event.entityId} RECOVERED: `,
  //       event.entity,
  //     );
  //   }

  /**
   * Called after entity recovery.
   */
  //   afterRecover(event: RecoverEvent<any>) {
  //     console.log(
  //       `AFTER ENTITY WITH ID ${event.entityId} RECOVERED: `,
  //       event.entity,
  //     );
  //   }

  /**
   * Called before transaction start.
   */
  // beforeTransactionStart(event: TransactionStartEvent) {
  //   console.log(`BEFORE TRANSACTION STARTED: `, event);
  // }

  /**
   * Called after transaction start.
   */
  // afterTransactionStart(event: TransactionStartEvent) {
  //   console.log(`AFTER TRANSACTION STARTED: `, event);
  // }

  /**
   * Called before transaction commit.
   */
  // beforeTransactionCommit(event: TransactionCommitEvent) {
  //   console.log(`BEFORE TRANSACTION COMMITTED: `, event);
  // }

  /**
   * Called after transaction commit.
   */
  // afterTransactionCommit(event: TransactionCommitEvent) {
  //   console.log(`AFTER TRANSACTION COMMITTED: `, event);
  // }

  /**
   * Called before transaction rollback.
   */
  // beforeTransactionRollback(event: TransactionRollbackEvent) {
  //   console.log(`BEFORE TRANSACTION ROLLBACK: `, event);
  // }

  /**
   * Called after transaction rollback.
   */
  // afterTransactionRollback(event: TransactionRollbackEvent) {
  //   console.log(`AFTER TRANSACTION ROLLBACK: `, event);
  // }
}
