import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Type } from '@nestjs/common';

/**
 * configuration for test entity provider
 */
export interface ProviderConfig<Provider> { entity: any; provider: Type<Provider>; }

/**
 * TestEntityProvider tests auto generated serivces for enities
 */
export class EntityTestProvider<ModelProvider> {
    /**
     * mocks subliminal records used by typeorm manually
     */
    private mockRepo = {
        metadata: {
            columns: [{ propertyName: 'id', isPrimary: true }],
            relations: [],
        },
    };

    /**
     * The instanced service from the test module created
     */
    public service: ModelProvider;

    constructor(private config: ProviderConfig<ModelProvider>) {}

    /**
     * setups preconditions before the test is performed
     */
    private initalize() {
        beforeEach(async () => {
            const app: TestingModule = await Test.createTestingModule({
                providers: [
                    this.config.provider,
                    { provide: getRepositoryToken(this.config.entity), useValue: this.mockRepo },
                ],
            }).compile();
            this.service = app.get<ModelProvider>(this.config.provider);
        });

    }

    /**
     * perform the tests on the providers
     */
    test() {
        describe(this.config.provider.name, () => {
            this.initalize();
            describe('Instance creation', () => {
                it('should have repositiy defined', () => {
                    expect((this.service as any).repository).toBe(this.mockRepo);
                });
            });
        });
    }
}
