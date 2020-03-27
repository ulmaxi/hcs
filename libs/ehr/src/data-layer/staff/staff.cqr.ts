import { Injectable, Controller } from '@nestjs/common';
import { createModelCQR, CreateModelItem, UpdateModelItem, RetriveEventQuery, FindEventQuery, DeleteEventQuery } from '@ulmax/microservice/modelCQR';
import { Staff } from './staff.entity';
import { StaffService } from './staff.service';
import { MessagePattern } from '@nestjs/microservices';

/**
 * creating the CQR Objects from the factories
 */
const CQR = createModelCQR<Staff>('ehr', 'staff');

export const StaffCQRActions = CQR.Actions;
export const StaffCQREvents = CQR.Events;

const { create, update, remove, retrieve, find } = StaffCQRActions;


/**
 * injectable service for PersonalBiodatCQR
 */
@Controller()
export class StaffCQRController extends CQR.ModelClass {
  constructor(svc: StaffService) {
    super(svc.repository);
  }

   /**
   * saves the item
   */
  @MessagePattern(create)
  create(item: CreateModelItem<Staff>) {
    return super.create(item);
  }

  /**
   * updates the item
   */
  @MessagePattern(update)
  update(item: UpdateModelItem<Staff>) {
    return super.update(item);
  }

  /**
   * retrieves the item
   */
  @MessagePattern(retrieve)
  retrieve(item: RetriveEventQuery<Staff>) {
    return super.retrieve(item);
  }

  /**
   * finds the item
   */
  @MessagePattern(find)
  find(item: FindEventQuery<Staff>) {
    return super.find(item)
  }

  /**
   * removes the item
   */
  @MessagePattern(remove)
  async remove(item: DeleteEventQuery<Staff>) {
    return super.remove(item)
  }

}
