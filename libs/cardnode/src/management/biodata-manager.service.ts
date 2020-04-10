import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CommunalData, PersonalBiodata } from '@ulmax/frontend';
import { MicroService } from '@ulmax/microservice/shared';
import { $ToArray, AwaitMap } from '@ulmax/server-shared';
import { CommunalDataCQREvents, PersonalBiodataCQREvents } from '@ulmax/users-admininistration';
import { EventEmitter } from 'events';
import { combineLatest, Observable, of } from 'rxjs';
import { first } from 'rxjs/operators';
import { CardMemberRequest, SavedBiodata } from './typecast';

/**
 * type for the saved data's in parallel
 */
type SavedBiodataResult = [AwaitMap<PersonalBiodata>, AwaitMap<CommunalData>];

/**
 * events dispatched to controll the saving
 * flow
 */
enum BiodataManagerEvent {
  Rollback = 'rollback_error',
}

@Injectable()
export class BiodataManagerService extends EventEmitter {
  constructor(@Inject(MicroService.CardNode) private users: ClientProxy) {
    super();
    this.on(BiodataManagerEvent.Rollback, this.rollbackError);
  }

  /**
   * saves the person's biodata or returns
   * the errors during saving the data
   */
  public async save(req: CardMemberRequest): Promise<SavedBiodata> {
    const result = this.destructureResult(
      await this.saveBiodataInParallel(req).toPromise(),
    );
    return this.getDataOrErrorAndRollBack(result);
  }

  /**
   * saves both the communal and personal
   */
  private saveBiodataInParallel(
    req: CardMemberRequest,
  ): Observable<SavedBiodataResult> {
    const personal = new PersonalBiodataCQREvents.CreateEventCommand(
      req.biodata,
    );
    const communal = new CommunalDataCQREvents.CreateEventCommand(
      req.communaldata,
    );
    const personal$ = $ToArray(
      this.users.send<PersonalBiodata>(personal.action, personal),
    );
    const communal$ = $ToArray(
      this.users.send<CommunalData>(communal.action, communal),
    );
    return combineLatest(personal$, communal$).pipe(first());
  }

  /**
   * rolls back the saved biodatas
   */
  private rollbackError(datas: SavedBiodata) {
    const personal$ = $ToArray(this.rollbackBiodata(datas));
    const communal$ = $ToArray(this.rollbackCommunal(datas));
    combineLatest(personal$, communal$)
      .pipe(first())
      .subscribe(res => console.log(res));
  }

  /**
   * sends the request to delete the save communal datas
   */
  private rollbackCommunal({ communalError, communaldata }: SavedBiodata) {
    if (communalError) {
      return of(true);
    }
    const req = new CommunalDataCQREvents.DeleteEventQuery(communaldata.id);
    return this.users.send<boolean>(req.action, req);
  }

  /**
   * sends a request to delete the saved personal
   * biodata
   */
  private rollbackBiodata({ biodata, biodataError }: SavedBiodata) {
    if (biodataError) {
      return of(true);
    }
    const req = new PersonalBiodataCQREvents.DeleteEventQuery(biodata.id);
    this.users.send<boolean>(req.action, req);
  }

  /**
   * gets the saved data or start the roll back
   * of previously saved datas
   */
  private getDataOrErrorAndRollBack({
    biodata,
    communaldata,
    biodataError,
    communalError,
  }: SavedBiodata) {
    if (biodata && communaldata) {
      return { biodata, communaldata };
    }
    this.emit(BiodataManagerEvent.Rollback, {
      biodata,
      communaldata,
      biodataError,
      communalError,
    });
    return { biodataError, communalError };
  }

  /**
   * retrieves the saved data's alone
   */
  private destructureResult([
    [biodata, biodataError],
    [communaldata, communaldataError],
  ]: SavedBiodataResult) {
    return { biodata, communaldata, biodataError, communaldataError };
  }
}
