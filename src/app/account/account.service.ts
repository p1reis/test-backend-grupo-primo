import { Injectable } from '@nestjs/common';

import { AccountRepository } from '@/src/domain/repositories/account.repository';

import { CreateAccountMapped } from '@/src/domain/interfaces/accountMapped.interface';
import { GenerateAccountNumberUtils } from '@/src/shared/utils/generate-account-number';

import { AccountMapper } from './mappers/account.mapper';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { CheckAccountUtils } from '../utils/check-account.utils';
import { AccountsToCacheUtils } from '../utils/accounts-to-cache.utils';

import { AccountAlreadyExists, AccountCreationFailed } from './errors/handler.exception';
import { AccountNotFound, CpfInvalid, ValueMustBePositive } from '@/src/shared/errors/handler.exception';
import { isCPF } from 'brazilian-values';

@Injectable()
export class AccountService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly generateAccountNumber: GenerateAccountNumberUtils,
    private readonly checkAccountUtils: CheckAccountUtils,
    private readonly sendAccountsToCache: AccountsToCacheUtils,
  ) { }

  async createAccount({
    firstName,
    lastName,
    cpf,
    balance,
  }: CreateAccountDto): Promise<CreateAccountMapped> {
    try {
      const accountExists =
        await this.checkAccountUtils.checkIfAccountExistsByCpf(cpf);

      if (accountExists) {
        throw new AccountAlreadyExists(cpf)
      }

      if (balance < 0) {
        throw new ValueMustBePositive('Balance')
      }

      const cpfIsValid = isCPF(cpf)

      if (!cpfIsValid) {
        throw new CpfInvalid(cpf)
      }

      const newAccount = await this.accountRepository.create({
        number: this.generateAccountNumber.generateAccountNumber(),
        firstName,
        lastName,
        cpf,
        balance,
      });

      const accounts = await this.accountRepository.findAll();
      await this.sendAccountsToCache.sendingAccountsToCache(accounts);

      return AccountMapper.newAccount(newAccount);
    } catch (error) {
      throw new AccountCreationFailed(error.message)
    }
  }

  findAllAccounts() {
    console.log('all accounts');
    return `This action returns all account`;
  }

  async findOneAccount(number: string) {
    const accountIsInCache =
      await this.checkAccountUtils.checkIfAccountExistsByNumber(number);
    const accountInDatabase = await this.accountRepository.findUnique(number);

    if (accountIsInCache) {
      return AccountMapper.accountFound(accountIsInCache);
    }

    if (accountInDatabase) {
      return AccountMapper.accountFound(accountInDatabase);
    }

    throw new AccountNotFound('This', number);
  }

  updateAccount(number: string, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${number} account`;
  }

  removeAccount(number: string) {
    return `This action removes a #${number} account`;
  }
}
