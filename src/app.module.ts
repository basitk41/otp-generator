import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { UserService } from './user.service';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [ConfigModule.forRoot(), MailerModule],
  controllers: [AppController],
  providers: [PrismaService, UserService],
})
export class AppModule {}
