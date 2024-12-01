import { HttpException, HttpStatus } from '@nestjs/common';
import * as moment from 'moment';

export class ResponseUtil {
  static notFound(entityName: string) {
    throw new HttpException(
      {
        status: 'error',
        message: `${entityName} not found.`,
      },
      HttpStatus.NOT_FOUND,
    );
  }

  static badRequest(details: string) {
    throw new HttpException(
      {
        status: 'error',
        message: details,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
  static serverError(details: string) {
    throw new HttpException(
      {
        status: 'error',
        message: 'An internal server error occurred.',
        details,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class OTPService {
  /**
   * Generates a 4-digit OTP.
   * @returns {string} - The generated OTP.
   */
  static generateOTP(): string {
    return (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
  }

  /**
   * Calculates the OTP expiration time.
   * @param {number} minutes - The number of minutes after which the OTP will expire.
   * @returns {string} - The expiration date as a string.
   */
  static getOTPExpiration(minutes: number = 1): string {
    return moment(new Date()).add(minutes, 'minutes').toString();
  }

  /**
   * Checks if the current time is after the provided expiration date.
   * @param {string | Date} otpExpirationDate - The expiration date to compare with the current time.
   * @returns {boolean} - True if the current time is after the expiration date, false otherwise.
   */
  static isExpired(otpExpirationDate: string | Date): boolean {
    return moment(new Date()).isAfter(otpExpirationDate);
  }
}
