import { ClaimUploadStore } from './claim-upload-store';

describe('ClaimUploadStore', () => {
  describe('modelIdDB', () => {
    it('should return the internal DB_map', () => {
      const store = new ClaimUploadStore(undefined);
      expect(store.modelIdDB).toBeInstanceOf(Map);
    });

    describe('update', () => {
      it('should throw the payload error', () => {
        const mockError = new Error('test_error');
        const store = new ClaimUploadStore(undefined);
        expect(() =>
          store.update('admission', { trackerId: undefined, error: mockError }),
        ).toThrow(mockError);
      });

      it('should call the rollback function before throwing error', () => {
        const mockError = new Error('test_error');
        const rollbackSpy = jest.fn().mockReturnValueOnce(null);
        const store = new ClaimUploadStore(rollbackSpy);
        expect(() =>
          store.update('admission', { trackerId: undefined, error: mockError }),
        ).toThrow(mockError);
        expect(rollbackSpy).toHaveBeenCalledWith(store);
      });

      it('should update the internalDB with field and tracker', () => {
        const store = new ClaimUploadStore(undefined);
        const trackerId = 'trackerid';
        store.update('admission', { trackerId });
        expect(store.modelIdDB.get('admission')).toEqual(trackerId);
      });
    });
  });
});
