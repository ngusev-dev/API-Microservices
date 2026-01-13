import { DynamicModule, Global, Module } from "@nestjs/common";
import {
  PassportAsyncOptionsModule,
  PassportModuleOptions,
} from "./interfaces";
import {
  createPassportAsyncOptionsProvider,
  createPassportOptionsProvider,
} from "./passport.providers";
import { PassportService } from "./passport.service";
import { PASSPORT_OPTIONS } from "./constants";

@Global()
@Module({})
export class PassportModule {
  static forRoot(options: PassportModuleOptions): DynamicModule {
    const provider = createPassportOptionsProvider(options);

    return {
      module: PassportModule,
      providers: [provider, PassportService],
      exports: [PassportService, PASSPORT_OPTIONS],
    };
  }

  static forRootAsync(options: PassportAsyncOptionsModule): DynamicModule {
    const asyncProvider = createPassportAsyncOptionsProvider(options);

    return {
      module: PassportModule,
      imports: options.imports ?? [],
      providers: [asyncProvider, PassportService],
      exports: [PassportService, PASSPORT_OPTIONS],
    };
  }
}
