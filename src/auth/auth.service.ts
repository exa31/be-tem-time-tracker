import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { MyLogger } from '../lib/logger';
import LoginUserDto from './dto/login-user.dto';
import ResponseModel from '../model/response.model';
import { BadRequestException } from '../excecption/bad-request.exception';
import * as bcrypt from 'bcrypt';
import Helper from '../helper';
import RegisterUserDto from './dto/register-user.dto';
import { InternalServerException } from '../excecption/internal-server.exception';
import { OAuth2Client } from 'google-auth-library';
import LoginGoogleUserDto from './dto/login-google-user.dto';

@Injectable()
export class AuthService {
  private client: OAuth2Client;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private logger: MyLogger,
  ) {
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async login(
    data: LoginUserDto,
  ): Promise<ResponseModel<null | { token: string }>> {
    try {
      const user = await this.userModel.findOne({ email: data.email }).exec();
      if (!user) {
        throw new BadRequestException('Invalid email or password');
      }
      const isPasswordValid = await bcrypt.compare(
        data.password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid email or password');
      }
      const token = Helper.generateToken(user._id.toString());
      return new ResponseModel<{ token: string }>(
        true,
        { token },
        new Date(),
        'Login successful',
      );
    } catch (error) {
      this.logger.error('Error during user login', error);
      throw new BadRequestException('Invalid email or password');
    }
  }

  async loginWithGoogle(
    data: LoginGoogleUserDto,
  ): Promise<ResponseModel<null | { token: string }>> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: data.credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload) {
        throw new BadRequestException('Invalid Google token');
      }

      if (!payload.email_verified) {
        throw new BadRequestException('Email not verified');
      }

      if (!payload.email || !payload.name) {
        throw new BadRequestException('Email and name are required');
      }

      if (payload.aud !== process.env.GOOGLE_CLIENT_ID) {
        throw new BadRequestException('Invalid Google token audience');
      }

      let user = await this.userModel.findOne({ email: payload.email }).exec();
      if (!user) {
        throw new BadRequestException('Invalid Google token');
      }
      const jwtToken = Helper.generateToken(user._id.toString());
      return new ResponseModel<{ token: string }>(
        true,
        { token: jwtToken },
        new Date(),
        'Login with Google successful',
      );
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; // Re-throw known exceptions
      }
      this.logger.error('Error during Google login', error);
      throw new BadRequestException('Invalid Google token');
    }
  }

  async register(
    data: RegisterUserDto,
  ): Promise<ResponseModel<null | { token: string }>> {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      this.logger.log(
        'Registering user with email: ' + data.email + data.password,
      );

      const newUser = new this.userModel({
        email: data.email,
        password: hashedPassword,
        name: data.name,
      });
      await newUser.save();
      const token = Helper.generateToken(newUser._id.toString());
      return new ResponseModel<{ token: string }>(
        true,
        { token },
        new Date(),
        'Registration successful',
      );
    } catch (error) {
      this.logger.error('Error during user registration', error);
      if (error.code === 11000) {
        throw new BadRequestException('Email already exists');
      }
      if (error instanceof BadRequestException) {
        throw error; // Re-throw known exceptions
      }
      throw new InternalServerException('Registration failed');
    }
  }
}
