import { Injectable } from '@nestjs/common';

import { TransactionRepository } from '@/src/domain/repositories/transaction.repository';

import { CreateDepositDto } from '../dto/create-deposit.dto';
import { AccountsToCacheUtils } from '../../utils/accounts-to-cache.utils';
import { CheckAccountUtils } from '../../utils/check-account.utils';
import { DepositMapper } from '../mappers/transaction.mapper';

import { AccountNotFound, ValueMustBePositive } from '@/src/shared/errors/handler.exception';

@Injectable()
export class DepositService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly checkAccountUtils: CheckAccountUtils,
    private readonly sendAccountToCache: AccountsToCacheUtils
  ) { }

  async execute({ destiny, amount }: CreateDepositDto) {
    const { cuid } =
      await this.checkAccountUtils.checkIfAccountExistsByNumber(destiny);

    if (!cuid) {
      throw new AccountNotFound('Destiny', destiny)
    }

    if (amount < 0) {
      throw new ValueMustBePositive('Amount')
    }

    const deposit = await this.transactionRepository.processDeposit(
      cuid,
      amount,
    );

    await this.sendAccountToCache.sendingAccountsToCache([deposit[0]]);
    return DepositMapper.map(deposit[1])
  }
}
