import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvVariableT } from 'src/shared/types/env-variable.types';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService<EnvVariableT>) {}

  get<K extends keyof EnvVariableT>(key: K): EnvVariableT[K] {
    return this.configService.getOrThrow(key, { infer: true });
  }

  set<K extends keyof EnvVariableT>(key: K, value: EnvVariableT[K]): void {
    this.configService.set(key, value);
  }
}
