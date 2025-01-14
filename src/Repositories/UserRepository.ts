import { DependencyInjection, Injectable, Repository, RepositoryError } from '@celosiajs/core'

import DatabaseRepository from './DatabaseRepository'

export interface User {
	id: number
	name: string
	username: string
	password: string
	createdAt: Date
}

@Injectable()
class UserRepository extends Repository {
	constructor(private databaseRepository = DependencyInjection.get(DatabaseRepository)) {
		super('UserRepository')
	}

	async getByID(id: number): Promise<User | null> {
		try {
			const user = await this.databaseRepository.prisma.user.findFirst({
				where: { id },
				select: {
					id: true,
					name: true,
					username: true,
					password: true,
					createdAt: true,
				},
			})

			if (user === null) return null

			return {
				id: user.id,
				name: user.name,
				username: user.username,
				password: user.password,
				createdAt: user.createdAt,
			}
		} catch (error) {
			this.logger.error('Get by id.', error)

			throw new RepositoryError()
		}
	}

	async getByUsername(username: string): Promise<User | null> {
		try {
			const user = await this.databaseRepository.prisma.user.findFirst({
				where: { username },
				select: {
					id: true,
					name: true,
					username: true,
					password: true,
					createdAt: true,
				},
			})

			if (user === null) return null

			return {
				id: user.id,
				name: user.name,
				username: user.username,
				password: user.password,
				createdAt: user.createdAt,
			}
		} catch (error) {
			this.logger.error('Get by username.', error)

			throw new RepositoryError()
		}
	}

	async create(username: string, name: string, password: string): Promise<User> {
		try {
			const user = await this.databaseRepository.prisma.user.create({
				data: {
					username,
					name,
					password,
				},
			})

			return {
				id: user.id,
				name: user.name,
				username: user.username,
				password: user.password,
				createdAt: user.createdAt,
			}
		} catch (error) {
			this.logger.error('Create.', error)

			throw new RepositoryError()
		}
	}
}

export default UserRepository
