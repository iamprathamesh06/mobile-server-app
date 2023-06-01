import { Test, TestingModule } from '@nestjs/testing';
import { GrainsService } from './grains.service';

describe('GrainsService', () => {
  let service: GrainsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GrainsService],
    }).compile();

    service = module.get<GrainsService>(GrainsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
