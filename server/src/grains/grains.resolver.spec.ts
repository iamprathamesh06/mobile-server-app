import { Test, TestingModule } from '@nestjs/testing';
import { GrainsResolver } from './grains.resolver';
import { GrainsService } from './grains.service';

describe('GrainsResolver', () => {
  let resolver: GrainsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GrainsResolver, GrainsService],
    }).compile();

    resolver = module.get<GrainsResolver>(GrainsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
