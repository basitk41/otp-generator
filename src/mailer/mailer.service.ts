import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('SMTP_EMAIL'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendMail(email: string, otp: string): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: '"Basit Ali" <basit.iplex@gmail.com>',
        to: email,
        subject: 'OTP Code - OTP Generator',
        text: `Your OTP Code is ${otp}`,
        html: `<b>Your OTP Code is ${otp}</b>`,
      });
      console.log('Email sent:', info.messageId);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
