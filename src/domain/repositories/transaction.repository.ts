import { Injectable } from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { PrismaService } from 'src/infrastructure/database/connection/prisma.service';

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) { }

  private get transaction() {
    return this.prisma.transaction;
  }

  private get account() {
    return this.prisma.account;
  }

  processDeposit(destiny: string, amount: number) {
    const deposit = this.account.update({
      where: { cuid: destiny },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    const transaction = this.transaction.create({
      data: {
        type: 'DEPOSIT',
        accountOrigin: { connect: { cuid: destiny } },
        amount
      },
      include: {
        accountOrigin: {
          select: {
            firstName: true,
            lastName: true,
            number: true,
            balance: true,
          },
        },
      },
    });

    return this.prisma.$transaction([deposit, transaction]);
  }

  processWithdraw(from: string, amount: number) {
    const withdraw = this.account.update({
      where: { cuid: from },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });

    const transaction = this.transaction.create({
      data: {
        type: 'WITHDRAW',
        accountOrigin: { connect: { cuid: from } },
        amount
      },
      include: {
        accountOrigin: {
          select: {
            firstName: true,
            lastName: true,
            number: true,
            balance: true,
          },
        },
      },
    });

    return this.prisma.$transaction([withdraw, transaction]);
  }

  processTransfer(origin: string, destiny: string, amount: number) {
    const updatedOrigin = this.account.update({
      where: { cuid: origin },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });

    const updatedDestiny = this.account.update({
      where: { cuid: destiny },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    const transaction = this.transaction.create({
      data: {
        type: 'TRANSFER',
        accountOrigin: { connect: { cuid: origin } },
        accountDestiny: { connect: { cuid: destiny } },
        amount
      },
      include: {
        accountOrigin: {
          select: {
            firstName: true,
            lastName: true,
            number: true,
            balance: true,
          },
        },
        accountDestiny: {
          select: {
            firstName: true,
            lastName: true,
            number: true,
            balance: true,
          },
        },
      },
    });

    return this.prisma.$transaction([updatedOrigin, updatedDestiny, transaction]);
  }

  async findUnique(cuid: string): Promise<Transaction> {
    return await this.transaction.findUnique({
      where: {
        cuid,
      },
    });
  }
}
