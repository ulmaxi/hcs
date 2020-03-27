import { Injectable, Controller } from '@nestjs/common';
import { createModelCQR, CreateModelItem, UpdateModelItem, RetriveEventQuery, FindEventQuery, DeleteEventQuery } from '@ulmax/microservice/modelCQR';
import { Prescription } from './prescription.entity';
import { PrescriptionService } from './prescription.service';
import { MessagePattern } from '@nestjs/microservices';

/**
 * creating the CQR Objects from the factories
 */
const CQR = createModelCQR<Prescription>('ehr', 'prescription');

export const PrescriptionCQRActions = CQR.Actions;
export const PrescriptionCQREvents = CQR.Events;

const { create, update, remove, retrieve, find } = PrescriptionCQRActions;


/**
 * injectable service for PersonalBiodatCQR
 */
@Controller()
export class PrescriptionCQRController extends CQR.ModelClass {
  constructor(svc: PrescriptionService) {
    super(svc.repository);
  }

   /**
   * saves the item
   */
  @MessagePattern(create)
  create(item: CreateModelItem<Prescription>) {
    return super.create(item);
  }

  /**
   * updates the item
   */
  @MessagePattern(update)
  update(item: UpdateModelItem<Prescription>) {
    return super.update(item);
  }

  /**
   * retrieves the item
   */
  @MessagePattern(retrieve)
  retrieve(item: RetriveEventQuery<Prescription>) {
    return super.retrieve(item);
  }

  /**
   * finds the item
   */
  @MessagePattern(find)
  find(item: FindEventQuery<Prescription>) {
    return super.find(item)
  }

  /**
   * removes the item
   */
  @MessagePattern(remove)
  async remove(item: DeleteEventQuery<Prescription>) {
    return super.remove(item)
  }

}
