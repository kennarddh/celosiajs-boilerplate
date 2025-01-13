import { BaseService, DependencyInjection, Injectable } from '@celosiajs/core'

import UserRepository from 'Repositories/UserRepository'

@Injectable()
class UserService extends BaseService {
	constructor(private userRepository = DependencyInjection.get(UserRepository)) {
		super('UserService')
	}

	async getUserData(id: number) {
		return await this.userRepository.getByID(id)
	}
}

export default UserService
