import type { Provider } from "@nestjs/common";
import {
  PassportAsyncOptionsModule,
  PassportModuleOptions,
} from "./interfaces";
import { PASSPORT_OPTIONS } from "./constants";

export function createPassportOptionsProvider(
  options: PassportModuleOptions,
): Provider {
  return {
    provide: PASSPORT_OPTIONS,
    useValue: Object.freeze({ ...options }),
  };
}

export function createPassportAsyncOptionsProvider(
  options: PassportAsyncOptionsModule,
): Provider {
  return {
    provide: PASSPORT_OPTIONS,
    useFactory: async (...args: any[]) => {
      const resolved = await options.useFactory(...args);

      if (!resolved || typeof resolved.secretKey !== "string")
        throw new Error(
          "[PassportModule] 'secretKey' is required and must be a string",
        );

      return Object.freeze({ ...resolved });
    },
    inject: options.inject ?? [],
  };
}
