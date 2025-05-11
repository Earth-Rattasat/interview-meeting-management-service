import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { Meeting } from 'src/entities/meeting.entity';
import { User } from 'src/entities/user.entity';
import { Comment } from 'src/entities/comment.entity';
import { HashingService } from 'src/modules/auth/hashing.service';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  const hashingService = app.get(HashingService);

  const userRepo = dataSource.getRepository(User);
  const user = await userRepo.save({
    email: 'admin@example.com',
    password: await hashingService.hash('123456'),
    name: 'Admin',
  });
  console.log('✅ Seeding user completed.');

  const meetingRepo = dataSource.getRepository(Meeting);
  const meetings = await meetingRepo.save([
    {
      title: 'Meeting 1',
      description: 'Meeting description 1',
      createdById: user.id,
    },
    {
      title: 'Meeting 2',
      description: 'Meeting description 2',
      createdById: user.id,
    },
  ]);
  console.log('✅ Seeding meetings completed.');

  const commentRepo = dataSource.getRepository(Comment);
  await commentRepo.save(
    meetings.map((meeting) => ({
      meetingId: meeting.id,
      createdById: user.id,
      description: `Comment 1 - ${meeting.title}`,
    })),
  );
  console.log('✅ Seeding comments completed.');

  await app.close();
}
bootstrap();
