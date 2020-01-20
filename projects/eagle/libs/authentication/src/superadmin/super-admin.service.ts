import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { AuthorizeRequest } from '../authorization/authorizer/typecast';
import { AccessLevel, Authorization } from '../data-layer/author/author.entity';
import { AuthorService } from '../data-layer/author/author.service';

const { SuperAdmin } = AccessLevel;

/**
 * Special service that handles superadmin signups
 */
@Injectable()
export class SuperAdminAuthorizeService {
  constructor(
    private author: AuthorService,
  ) { }

  /**
   * Creates an intialadmin if none exists
   */
  async createInitalAdmin() {
    let superAdmin = await this.author.findOne({ accessLevel: SuperAdmin });
    if (!superAdmin) {
      superAdmin = await this.createAdmin(`rootadmin@hcseagle.com`);
    }
    return superAdmin;
  }

  /**
   * instantiaes and create a new super admin
   */
  async createAdmin(identification: string) {
    const superAdmin = new Authorization();
    superAdmin.accessLevel = SuperAdmin;
    superAdmin.apiKey = v4();
    superAdmin.identification = identification;
    superAdmin.trackId = v4();
    const newAdmin = await this.author.repository.save(superAdmin);
    return newAdmin;
  }

  /**
   * singup another admin by a previously registered admin
   */
  async signupAdmin(apiKey: string, newAdmin: AuthorizeRequest) {
    const oldAdmin = await this.author.findOne({ apiKey });
    if (oldAdmin && oldAdmin.accessLevel === SuperAdmin) {
      return await this.findOrCreateAdmin(newAdmin);
    }
    throw SuperAdminSignupError;
  }

  /**
   * finds or create an admin or update a existing entity to superAdmin
   */
  async findOrCreateAdmin({ identification }: AuthorizeRequest) {
    let superAdmin = await this.author.findOne({ identification });
    if (!superAdmin) {
      superAdmin = await this.createAdmin(identification);
      return superAdmin;
    }
    superAdmin.accessLevel = SuperAdmin;
    return this.author.repository.save(superAdmin);
  }
}

/** The error thrown when the requirement to signup a new admin is not meet */
export const SuperAdminSignupError = new Error(
  `The requirement for admin signup is not fullfied`,
);
