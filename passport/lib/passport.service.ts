import { createHmac } from "node:crypto";
import { base64UrlDecode, base64UrlEncode, constantTimerEqual } from "./utils";
import { Inject, Injectable } from "@nestjs/common";
import { PASSPORT_OPTIONS } from "./constants";
import { PassportModuleOptions } from "./interfaces";

@Injectable()
export class PassportService {
  private readonly SECRET_KEY: string;

  private static readonly HMAC_DOAMIN = "PassportTokenAuth/v1";
  private static readonly INTERNAL_SEP = "|";

  constructor(
    @Inject(PASSPORT_OPTIONS) private readonly options: PassportModuleOptions,
  ) {
    this.SECRET_KEY = options.secretKey;
  }

  public generate(userId: string, ttl: number) {
    const issuedAt = this.now();
    const expiresAt = issuedAt + ttl;

    const userPart = base64UrlEncode(userId);
    const iatPart = base64UrlEncode(issuedAt.toString());
    const expPart = base64UrlEncode(expiresAt.toString());

    const serialized = this.serialize(userPart, iatPart, expPart);
    const mac = this.computeHmac(this.SECRET_KEY, serialized);

    return `${userPart}.${iatPart}.${expPart}.${mac}`;
  }

  public verify(token: string) {
    const parts = token.split(".");

    if (parts.length !== 4)
      return {
        valid: false,
        reason: "Invalid token format",
      };

    const [userPart, iatPart, expPart, hmac] = parts;

    const serialized = this.serialize(userPart, iatPart, expPart);
    const computedHmac = this.computeHmac(this.SECRET_KEY, serialized);

    if (!constantTimerEqual(hmac, computedHmac))
      return {
        valid: false,
        reason: "Invalid token signature",
      };

    const expNumber = Number(base64UrlDecode(expPart));

    if (!Number.isFinite(expNumber))
      return {
        valid: false,
        reason: "Expire error",
      };

    if (this.now() > expNumber)
      return {
        valid: false,
        reason: "Expired token",
      };

    return {
      valid: true,
      userId: base64UrlDecode(userPart),
      issuedAt: Number(base64UrlDecode(iatPart)),
      expiresAt: expNumber,
    };
  }

  private now() {
    return Math.floor(Date.now() / 1000);
  }

  private serialize(user: string, iat: string, exp: string): string {
    return [PassportService.HMAC_DOAMIN, user, iat, exp].join(
      PassportService.INTERNAL_SEP,
    );
  }

  private computeHmac(secretKet: string, payload: string) {
    return createHmac("sha256", secretKet).update(payload).digest("hex");
  }
}
