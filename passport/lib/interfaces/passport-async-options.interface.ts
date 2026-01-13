import { FactoryProvider, ModuleMetadata } from "@nestjs/common";
import type { PassportModuleOptions } from "./passport-module.interface";

export interface PassportAsyncOptionsModule extends Pick<
  ModuleMetadata,
  "imports"
> {
  useFactory: (
    ...args: any[]
  ) => Promise<PassportModuleOptions> | PassportModuleOptions;
  inject?: FactoryProvider["inject"];
}
