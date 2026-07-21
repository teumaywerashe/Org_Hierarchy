import {
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from '../user/user.entity';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '../user/role.enum';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit() {
    const count = await this.usersRepo.count();
    if (count > 0) {
      return;
    }

    const defaultUsers: CreateUserDto[] = [
      {
        username: 'admin',
        email: 'admin@perago.local',
        password: 'password',
        role: Role.ADMIN,
      },
      {
        username: 'hr',
        email: 'hr@perago.local',
        password: 'password',
        role: Role.HR_MANAGER,
      },
      {
        username: 'viewer',
        email: 'viewer@perago.local',
        password: 'password',
        role: Role.VIEWER,
      },
    ];

    for (const user of defaultUsers) {
      await this.createUser(user);
    }
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async createUser(dto: CreateUserDto) {
    const existing = await this.usersRepo.findOne({
      where: [{ username: dto.username }, { email: dto.email }],
    });
    if (existing) {
      throw new ConflictException('Username or email already exists');
    }

    const user = this.usersRepo.create({
      ...dto,
      password: await this.hashPassword(dto.password),
    });
    const saved = await this.usersRepo.save(user);
    return this.sanitizeUser(saved);
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepo.findOne({
      where: { username: dto.username },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return {
      accessToken: await this.jwtService.signAsync({
        sub: user.id,
        username: user.username,
        role: user.role,
      }),
      user: this.sanitizeUser(user),
    };
  }

  async findAllUsers() {
    const users = await this.usersRepo.find();
    return users.map((user) => this.sanitizeUser(user));
  }

  async findUserById(id: string) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.sanitizeUser(user);
  }

  sanitizeUser(user: UserEntity) {
    const { password, ...safeUser } = user;
    return safeUser;
  }
}
