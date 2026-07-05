import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { PositionEntity } from './position.entity';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(PositionEntity)
    private readonly positionRepo: Repository<PositionEntity>,
  ) {}

  async create(dto: CreatePositionDto): Promise<PositionEntity> {
    if (dto.parentId) {
      const parent = await this.positionRepo.findOne({
        where: { id: dto.parentId },
      });
      if (!parent) throw new NotFoundException('Parent position not found');
    }
    const position = this.positionRepo.create(dto);
    return this.positionRepo.save(position);
  }

  async findAll(): Promise<PositionEntity[]> {
    return this.positionRepo.find({ relations: ['children', 'parent'] });
  }

  async findTree(): Promise<PositionEntity[]> {
    const all = await this.positionRepo.find({
      relations: ['children'],
    });
    // Return only root nodes; children are nested via relation
    const roots = all.filter((p) => p.parentId === null);
    return this.buildTree(roots, all);
  }

  private buildTree(
    nodes: PositionEntity[],
    all: PositionEntity[],
  ): PositionEntity[] {
    return nodes.map((node) => {
      node.children = this.buildTree(
        all.filter((p) => p.parentId === node.id),
        all,
      );
      return node;
    });
  }

  async findOne(id: string): Promise<PositionEntity> {
    const position = await this.positionRepo.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });
    if (!position) throw new NotFoundException('Position not found');
    return position;
  }

  async findChildren(id: string): Promise<PositionEntity[]> {
    await this.findOne(id); // verify exists
    return this.positionRepo.find({ where: { parentId: id } });
  }

  async update(id: string, dto: UpdatePositionDto): Promise<PositionEntity> {
    const position = await this.findOne(id);

    if (dto.parentId && dto.parentId === id) {
      throw new BadRequestException('Position cannot be its own parent');
    }

    if (dto.parentId) {
      const parent = await this.positionRepo.findOne({
        where: { id: dto.parentId },
      });
      if (!parent) throw new NotFoundException('Parent position not found');
    }

    Object.assign(position, dto);
    return this.positionRepo.save(position);
  }

  async remove(id: string): Promise<void> {
    const position = await this.findOne(id);
    const children = await this.positionRepo.find({ where: { parentId: id } });
    if (children.length > 0) {
      throw new BadRequestException(
        'Cannot delete position with existing children. Remove or reassign children first.',
      );
    }
    await this.positionRepo.remove(position);
  }
}
