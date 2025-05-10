import { ChangeLog } from 'src/entities/change-log.entity';
import { Meeting } from 'src/entities/meeting.entity';
import {
  EntityManager,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

@EventSubscriber()
export class MeetingSubscriber implements EntitySubscriberInterface<Meeting> {
  listenTo() {
    return Meeting;
  }

  async afterInsert(event: InsertEvent<Meeting>): Promise<void> {
    const meeting = event.entity;
    await this.createChangeLog(event.manager, meeting);
  }

  async afterUpdate(event: UpdateEvent<Meeting>): Promise<void> {
    const meeting = await event.manager.findOne(Meeting, {
      where: {
        id: event.entity.id,
      },
    });
    await this.createChangeLog(event.manager, meeting);
  }

  private async createChangeLog(manager: EntityManager, meeting: Meeting) {
    await manager.save(ChangeLog, {
      meetingId: meeting.id,
      title: meeting.title,
      description: meeting.description,
      status: meeting.status,
    });
  }
}
