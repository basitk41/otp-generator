import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './user.dto';
import { ResponseUtil, OTPService } from './utils';
import { MailerService } from './mailer/mailer.service';
import { IUser, IOTPSuccessResponse } from './types';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
  ) {}

  @Get('user/:id')
  async getUserById(@Param('id') id: string): Promise<IUser> {
    const user = await this.userService.user({ id: Number(id) });
    if (!user) {
      ResponseUtil.notFound('User');
    } else {
      return plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
      });
    }
  }

  @Post('user')
  async signupUser(
    @Body() userData: { name: string; email: string },
  ): Promise<IUser> {
    if (userData?.name !== '' && userData?.email !== '') {
      const user = await this.userService.user({ email: userData?.email });
      if (user) {
        ResponseUtil.badRequest('User already exists');
      }
      const newUser = await this.userService.createUser(userData);
      return plainToInstance(UserResponseDto, newUser, {
        excludeExtraneousValues: true,
      });
    } else {
      ResponseUtil.badRequest('Name and Email are required');
    }
  }

  @Post('generate-otp/:email')
  async generateOTP(
    @Param('email') email: string,
  ): Promise<IOTPSuccessResponse> {
    const user = await this.userService.user({ email });
    if (!user) {
      ResponseUtil.notFound('User');
    }
    const otp = OTPService.generateOTP();
    this.mailerService.sendMail(email, otp);
    await this.userService.updateUser({
      where: { email },
      data: { otp, otp_expiration_date: OTPService.getOTPExpiration() },
    });
    return {
      status: 'success',
      message: 'OTP sent successfully',
    };
  }

  @Get('verfiy-otp/:email/:otp')
  async verfiyOTP(
    @Param('email') email: string,
    @Param('otp') otp: string,
  ): Promise<IOTPSuccessResponse> {
    const user = await this.userService.user({ email });
    if (!user) {
      ResponseUtil.notFound('User');
    }
    if (user.otp !== otp) {
      ResponseUtil.badRequest('Invalid OTP');
    } else if (OTPService.isExpired(user.otp_expiration_date)) {
      ResponseUtil.badRequest('OTP Expired');
    } else {
      await this.userService.updateUser({
        where: { email },
        data: { otp: null, otp_expiration_date: null },
      });
      return {
        status: 'success',
        message: 'OTP verified successfully',
      };
    }
  }
  @Get('hello')
  getHello(): string {
    return 'Hello World!';
  }
}
