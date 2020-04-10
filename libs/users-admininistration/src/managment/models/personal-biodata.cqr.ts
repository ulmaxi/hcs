import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BatchEventQuery, createModelCQR, CreateModelItem, DeleteEventQuery, FindEventQuery, RetriveEventQuery, UpdateModelItem } from '@ulmax/microservice/modelCQR';
import { PersonalBiodataService } from '../services/person-biodata.service';
import { PersonalBiodata } from './personal-biodata.entity';

/**
 * creating the CQR Objects from the factories
 */
const CQR = createModelCQR<PersonalBiodata>(
  'users-management',
  'personal-biodata',
);

export const PersonalBiodataCQRActions = CQR.Actions;
export const PersonalBiodataCQREvents = CQR.Events;

const {
  create,
  update,
  remove,
  retrieve,
  find,
  batch,
} = PersonalBiodataCQRActions;

/**
 * injectable service for PersonalBiodatCQR
 */
@Controller()
export class PersonalBiodataCQRController extends CQR.ModelClass {
  constructor(svc: PersonalBiodataService) {
    super(svc.repository);
  }

  /**
   * saves the item
   */
  @MessagePattern(create)
  create(item: CreateModelItem<PersonalBiodata>) {
    return super.create(item);
  }

  /**
   * updates the item
   */
  @MessagePattern(update)
  update(item: UpdateModelItem<PersonalBiodata>) {
    return super.update(item);
  }

  /**
   * retrieves the item
   */
  @MessagePattern(retrieve)
  retrieve(item: RetriveEventQuery<PersonalBiodata>) {
    return super.retrieve(item);
  }

  /**
   * finds the item
   */
  @MessagePattern(find)
  find(item: FindEventQuery<PersonalBiodata>) {
    return super.find(item);
  }

  /**
   * removes the item
   */
  @MessagePattern(remove)
  async remove(item: DeleteEventQuery<PersonalBiodata>) {
    return super.remove(item);
  }

  /**
   * batch event for items
   */
  @MessagePattern(batch)
  async batch(item: BatchEventQuery<PersonalBiodata>) {
    return super.batch(item);
  }
}
