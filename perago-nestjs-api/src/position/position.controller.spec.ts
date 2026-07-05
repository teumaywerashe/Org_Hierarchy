import { Test, TestingModule } from '@nestjs/testing';
import { PositionController } from './position.controller';
import { PositionService } from './position.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findTree: jest.fn(),
  findOne: jest.fn(),
  findChildren: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

  describe('PositionController', () => {
  let controller: PositionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PositionController],
      providers: [{ provide: PositionService, useValue: mockService }],
    }).compile();

    controller = module.get<PositionController>(PositionController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should create a position', async () => {
      const dto = { name: 'CEO', description: 'Chief Executive Officer' };
      const result = { id: 'uuid-1', ...dto, parentId: null };
      mockService.create.mockResolvedValue(result);

      expect(await controller.create(dto)).toEqual(result);
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll()', () => {
    it('should return an array of positions', async () => {
      const positions = [{ id: 'uuid-1', name: 'CEO' }];
      mockService.findAll.mockResolvedValue(positions);

      expect(await controller.findAll()).toEqual(positions);
    });
  });

  describe('findTree()', () => {
    it('should return positions as tree', async () => {
      const tree = [{ id: 'uuid-1', name: 'CEO', children: [] }];
      mockService.findTree.mockResolvedValue(tree);

      expect(await controller.findTree()).toEqual(tree);
    });
  });

  describe('findOne()', () => {
    it('should return one position', async () => {
      const position = { id: 'uuid-1', name: 'CEO' };
      mockService.findOne.mockResolvedValue(position);

      expect(await controller.findOne('uuid-1')).toEqual(position);
    });

    it('should throw NotFoundException when not found', async () => {
      mockService.findOne.mockRejectedValue(new NotFoundException());
      await expect(controller.findOne('bad-uuid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findChildren()', () => {
    it('should return children of a position', async () => {
      const children = [{ id: 'uuid-2', name: 'CTO', parentId: 'uuid-1' }];
      mockService.findChildren.mockResolvedValue(children);

      expect(await controller.findChildren('uuid-1')).toEqual(children);
    });
  });

  describe('update()', () => {
    it('should update and return the position', async () => {
      const dto = { name: 'Updated CEO' };
      const result = { id: 'uuid-1', name: 'Updated CEO' };
      mockService.update.mockResolvedValue(result);

      expect(await controller.update('uuid-1', dto)).toEqual(result);
    });
  });

  describe('remove()', () => {
    it('should remove a position', async () => {
      mockService.remove.mockResolvedValue(undefined);
      await expect(controller.remove('uuid-1')).resolves.toBeUndefined();
    });

    it('should throw BadRequestException when position has children', async () => {
      mockService.remove.mockRejectedValue(new BadRequestException());
      await expect(controller.remove('uuid-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
