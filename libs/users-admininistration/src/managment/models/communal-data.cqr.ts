import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BatchEventQuery, createModelCQR, CreateModelItem, DeleteEventQuery, FindEventQuery, RetriveEventQuery, UpdateModelItem } from '@ulmax/microservice/modelCQR';
import { CommunalDataService } from '../services/communal-data.service';
import { CommunalData } from './comunal-data.entity';

/**
 * creating the CQR Objects from the factories
 */
const CQR = createModelCQR<CommunalData>('users-management', 'communal-data');

export const CommunalDataCQRActions = CQR.Actions;
export const CommunalDataCQREvents = CQR.Events;

console.log({
  CommunalDataCQRActions,
});

const {
  create,
  update,
  remove,
  retrieve,
  find,
  batch,
} = CommunalDataCQRActions;

/**
 * injectable service for PersonalBiodatCQR
 */
@Controller()
export class CommunalDataCQRController extends CQR.ModelClass {
  constructor(svc: CommunalDataService) {
    super(svc.repository);
  }

  /**
   * saves the item
   */
  @MessagePattern(create)
  create(item: CreateModelItem<CommunalData>) {
    return super.create(item);
  }

  /**
   * updates the item
   */
  @MessagePattern(update)
  update(item: UpdateModelItem<CommunalData>) {
    return super.update(item);
  }

  /**
   * retrieves the item
   */
  @MessagePattern(retrieve)
  retrieve(item: RetriveEventQuery<CommunalData>) {
    return super.retrieve(item);
  }

  /**
   * finds the item
   */
  @MessagePattern(find)
  find(item: FindEventQuery<CommunalData>) {
    return super.find(item);
  }

  /**
   * removes the item
   */
  @MessagePattern(remove)
  async remove(item: DeleteEventQuery<CommunalData>) {
    return super.remove(item);
  }

  /**
   * batch event for items
   */
  @MessagePattern(batch)
  async batch(item: BatchEventQuery<CommunalData>) {
    return super.batch(item);
  }
}
