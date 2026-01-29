import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Organization } from '../organizations/organization.entity';
import { User, Role } from '../users/user.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Organization)
    private orgRepo: Repository<Organization>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async onModuleInit() {
    const orgCount = await this.orgRepo.count();
    if (orgCount > 0) return;

    const org = this.orgRepo.create({
      name: 'Default Organization',
    });
    await this.orgRepo.save(org);

    const user = this.userRepo.create({
      email: 'owner@test.com',
      password: await bcrypt.hash('password', 10),
      role: Role.OWNER,
      organization: org,
    });

    await this.userRepo.save(user);

    console.log('Database seeded with default org & owner user');
  }
}
