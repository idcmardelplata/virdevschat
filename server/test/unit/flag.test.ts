interface FlagComponentsInterface {
  getValueOf(name: string): any
}

interface FlagComponentProviderInterface {
  getFlag(name: string): Promise<boolean>;
}

import { Client, OpenFeature } from '@openfeature/server-sdk';
import dotenv from 'dotenv';
import { EnvVarProvider } from '@openfeature/env-var-provider';

class EnvProvider implements FlagComponentProviderInterface {
  private client: Client;
  constructor() {
    dotenv.config();
    OpenFeature.setProvider(new EnvVarProvider());
    this.client = OpenFeature.getClient();
  }
  async getFlag(name: string): Promise<boolean> {
    return await this.client.getBooleanValue(name, false);
  }
}

//TODO: Crear un factory
class FlagComponent implements FlagComponentsInterface {
  private provider: FlagComponentProviderInterface;
  constructor(provider: FlagComponentProviderInterface) {
    this.provider = provider;
  }
  async getValueOf(name: string): Promise<boolean> {
    return await this.provider.getFlag(name);

  }
}
describe("Flag", () => {
  it("Should be instantiate", () => {
    let flagComponent = new FlagComponent(new EnvProvider());
    expect(flagComponent).toBeInstanceOf(FlagComponent);

  })

  it("Should be return value of SERVER_REFACTOR ", async () => {
    let flagComponent = new FlagComponent(new EnvProvider());
    expect(await flagComponent.getValueOf('server-refactor')).toBe(true);
  })


})
