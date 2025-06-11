import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { MyLogger } from '../lib/logger';
import LoginUserDto from './dto/login-user.dto';
import ResponseModel from '../model/response.model';
import { BadRequestException } from '../excecption/bad-request.exception';
import bcrypt from 'bcrypt';
import Helper from '../helper';
import RegisterUserDto from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private logger: MyLogger,
  ) {}

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

  async register(
    data: RegisterUserDto,
  ): Promise<ResponseModel<null | { token: string }>> {
    try {
      const existingUser = await this.userModel
        .findOne({ email: data.email })
        .exec();
      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const newUser = new this.userModel({
        email: data.email,
        password: hashedPassword,
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
      if (error instanceof BadRequestException) {
        throw error; // Re-throw known exceptions
      }
      throw new BadRequestException('Registration failed');
    }
  }
}
