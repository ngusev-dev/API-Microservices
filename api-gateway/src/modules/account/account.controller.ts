import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AccountClientGrpc } from './account.grpc';
import {
  ConfirmEmailChangeRequest,
  ConfirmPhoneChangeRequest,
  InitEmailChangeRequest,
  InitPhoneChangeRequest,
} from './dto';
import { Authorized, Protected } from 'src/shared/decorators';

@Controller('account')
export class AccountController {
  constructor(private readonly account: AccountClientGrpc) {}

  @ApiOperation({
    summary: 'Initiate email change',
    description: 'Send OTP code to the user',
  })
  @ApiBearerAuth()
  @Protected()
  @Post('email/init')
  @HttpCode(HttpStatus.OK)
  public initEmailChage(
    @Body() dto: InitEmailChangeRequest,
    @Authorized() userId: string,
  ) {
    return this.account.initEmailChange({
      ...dto,
      userId,
    });
  }

  @ApiOperation({
    summary: 'Confirm email change',
    description: 'Verify OTP code',
  })
  @ApiBearerAuth()
  @Protected()
  @Post('email/confirm')
  @HttpCode(HttpStatus.OK)
  public confirmEmailChange(
    @Body() dto: ConfirmEmailChangeRequest,
    @Authorized() userId: string,
  ) {
    return this.account.confirmEmailChange({
      ...dto,
      userId,
    });
  }

  @ApiOperation({
    summary: 'Initiate phone change',
    description: 'Send OTP code to the user',
  })
  @ApiBearerAuth()
  @Protected()
  @Post('phone/init')
  @HttpCode(HttpStatus.OK)
  public initPhoneChage(
    @Body() dto: InitPhoneChangeRequest,
    @Authorized() userId: string,
  ) {
    return this.account.initPhoneChange({
      ...dto,
      userId,
    });
  }

  @ApiOperation({
    summary: 'Confirm phone change',
    description: 'Verify OTP code',
  })
  @ApiBearerAuth()
  @Protected()
  @Post('phone/confirm')
  @HttpCode(HttpStatus.OK)
  public confirmPhoneChange(
    @Body() dto: ConfirmPhoneChangeRequest,
    @Authorized() userId: string,
  ) {
    return this.account.confirmPhoneChange({
      ...dto,
      userId,
    });
  }
}
