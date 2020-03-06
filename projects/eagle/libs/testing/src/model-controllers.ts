import { Test } from '@nestjs/testing';

/**
 * configuration for test entity provider
 */
export interface ControllerConfig { controller: any; provider: any; }

/**
 * EntityTestController tests auto generated serivces for enities
 */
export class EntityTestController<Controller, Provider> {
    service: Provider;
    controller: Controller;

    constructor(private config: ControllerConfig) {

    }

    private initalize() {

        beforeEach(async () => {
            const { controller, provider } = this.config;
            const module = await Test.createTestingModule({
                controllers: [controller],
                providers: [{ provide: provider, useValue: {} }],
            }).compile();

            this.service = module.get<Provider>(provider);
            this.controller = module.get<Controller>(controller);
        });

    }

    test() {
        describe(this.config.controller.name, () => {
            this.initalize();
            describe('service', () => {
                it('should be defined', async () => {
                    expect(this.service).toBeDefined();
                    expect(this.controller).toBeDefined();
                });
            });
        });
    }

}
