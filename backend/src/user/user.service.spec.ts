import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as faker from 'faker';

import FakeRepository from '../FakeRepository';
import { User } from './user.entity';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: FakeRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
  });

  describe('when creating user', () => {
    it('calls userRepository', async () => {
      const email = faker.internet.email();
      const username = faker.lorem.word();
      const password = faker.lorem.word();

      const createUserDto: CreateUserDto = {
        email,
        username,
        password,
      };

      const createdUserEntity = new User(createUserDto);
      const savedUser = new User({
        id: faker.random.number(),
        createdAt: new Date(),
        updatedAt: new Date(),
        email,
        username,
        password,
      });

      const userRepositorySaveSpy = jest
        .spyOn(userRepository, 'save')
        .mockResolvedValue(savedUser);

      const userRepositoryCreateSpy = jest
        .spyOn(userRepository, 'create')
        .mockReturnValue(createdUserEntity);

      const result = await userService.create(createUserDto);

      expect(userRepositoryCreateSpy).toBeCalledWith(createUserDto);
      expect(userRepositorySaveSpy).toBeCalledWith(createdUserEntity);
      expect(result).toEqual(savedUser);
    });
  });
});
