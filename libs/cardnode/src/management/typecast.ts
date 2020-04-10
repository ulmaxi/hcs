// tslint:disable: max-classes-per-file
import { UnsavedModel } from '@ulmax/server-shared';
import { CommunalData, PersonalBiodata } from '@ulmax/users-admininistration';
import { UlmaxCard } from '../data-layer/card/card.entity';

/**
 * result of the data that's saved
 */
export type SavedBiodata = {
  biodata?: PersonalBiodata;
  communaldata?: CommunalData;
} & Partial<SavedBiodataErrors>;

/**
 * various errors returned
 */
export type SavedBiodataErrors = {
  biodataError: Error;
  communalError: Error;
};

/**
 * Request format to add a new member to a card
 */
export class CardMemberRequest {
  /**
   * personal biodata of new member
   */
  biodata: UnsavedModel<PersonalBiodata>;
  /**
   * communal data for the new member
   */
  communaldata: UnsavedModel<CommunalData>;
  /**
   * phoneNo for the new member (for principal privledge)
   */
  identification?: string;
}

/**
 * Request format to add a new member to a card
 */
export class UlmaxFullCard {
  /**
   * personal biodata of the member
   */
  biodata: PersonalBiodata;
  /**
   * communal data for the member
   */
  communaldata: CommunalData;

  /**
   * the saved ulmaxCard
   */
  card: UlmaxCard;
}
