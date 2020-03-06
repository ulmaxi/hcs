/**
 * stages which have occurred in the upload progress
 */
export interface UploadState {
    staff?: boolean;
    patient?: boolean;
    admission?: boolean;
    labTests?: boolean;
    prescriptions?: boolean;
    review?: boolean;
    consultation?: boolean;
    error?: Error;
}

export type ClaimStoreKeys = keyof Omit<UploadState, 'error'>;
export interface ClaimStorePayload {
    error?: Error;
    trackerId: string | string[];
}

/**
 * Store which tracks and update the stages of upload
 */
export class ClaimUploadStore {
    private savedModelIds = new Map<ClaimStoreKeys, string | string[]>();
    constructor(
        private rollbackFunction?: (store: ClaimUploadStore) => {},
    ) { }

    /**
     * updates the progress of how and where the upload
     * is currently
     */
    update(stage: ClaimStoreKeys, payload: ClaimStorePayload) {
        if (payload.error) {
            if (this.rollbackFunction) {
                this.rollbackFunction(this);
            }
            throw payload.error;
        }
        this.savedModelIds.set(stage, payload.trackerId);
        return this;
    }

    public get modelIdDB() {
        return this.savedModelIds;
    }

}
