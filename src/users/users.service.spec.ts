import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { RolesService } from 'src/roles/roles.service';
import { MediaService } from 'src/media/media.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            preload: jest.fn(),
            save: jest.fn(),
          },
        },
        { provide: RolesService, useValue: {} },
        { provide: MediaService, useValue: {} },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
