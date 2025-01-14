import { DependencyScope, Injectable, Repository } from '@celosiajs/core'

import { PrismaClient } from '@prisma/client'
import { PrismaClientInitializationError } from '@prisma/client/runtime/library'

@Injectable(DependencyScope.Singleton)
class DatabaseRepository extends Repository {
	private static prisma = new PrismaClient()

	constructor() {
		super('DatabaseRepository')
	}

	async connect() {
		this.logger.info('Init.')

		try {
			await this.prisma.$connect()

			this.logger.info('Connected.')
		} catch (error) {
			if (error instanceof PrismaClientInitializationError) {
				this.logger.error('Prisma failed to connect to the database.', error)

				const { default: OnShutdown } = await import('Utils/OnShutdown/OnShutdown')

				await OnShutdown(undefined, 1)
			}
		}
	}

	async disconnect() {
		this.logger.info('Disconnecting.')

		await this.prisma.$disconnect()

		this.logger.info('Disconnected.')
	}

	get prisma() {
		return DatabaseRepository.prisma
	}

	public async isReady() {
		try {
			await this.prisma.$queryRaw`SELECT 1`

			return true
		} catch {
			return false
		}
	}
}

export default DatabaseRepository
