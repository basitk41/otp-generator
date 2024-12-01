import { User as UserModel } from '@prisma/client';

export interface IUser extends Omit<UserModel, 'otp' | 'otp_expiration_date'> {
  otp?: string | null;
  otp_expiration_date?: Date | null;
}

export interface IOTPSuccessResponse {
  status: string;
  message: string;
}
