import { DependencyInjection, Injectable, Service } from '@celosiajs/core'

import UserRepository from 'Repositories/UserRepository'

import PasswordHashService from 'Services/PasswordHashService/PasswordHashService'
import AccessTokenService, { AccessTokenJWTPayload } from 'Services/Token/AccessTokenService'
import RefreshTokenService, { RefreshTokenJWTPayload } from 'Services/Token/RefreshTokenService'

import UnauthorizedError from './Errors/UnauthorizedError'
import UserExistsError from './Errors/UserExistsError'

@Injectable()
class AuthService extends Service {
	constructor(
		private userRepository = DependencyInjection.get(UserRepository),
		private passwordHashService = DependencyInjection.get(PasswordHashService),
		private accessTokenService = DependencyInjection.get(AccessTokenService),
		private refreshTokenService = DependencyInjection.get(RefreshTokenService),
	) {
		super('AuthService')
	}

	async createTokens(userID: number) {
		const accessTokenPayload = { id: userID } satisfies AccessTokenJWTPayload

		const accessToken = await this.accessTokenService.sign(accessTokenPayload)

		const refreshTokenPayload = { id: userID } satisfies RefreshTokenJWTPayload

		const refreshToken = await this.refreshTokenService.sign(refreshTokenPayload)

		return {
			accessToken,
			refreshToken,
		}
	}

	async login(username: string, password: string) {
		const user = await this.userRepository.getByUsername(username)

		if (user === null) throw new UnauthorizedError()

		const isPasswordCorrect = await this.passwordHashService.verify(user.password, password)

		if (!isPasswordCorrect) throw new UnauthorizedError()

		return this.createTokens(user.id)
	}

	async register(username: string, name: string, password: string) {
		const user = await this.userRepository.getByUsername(username)

		if (user !== null) throw new UserExistsError()

		const passwordDigest = await this.passwordHashService.hash(password)

		const createdUser = await this.userRepository.create(username, name, passwordDigest)

		return createdUser
	}

	async refreshToken(refreshToken: string) {
		const currentRefreshTokenPayload = await this.refreshTokenService.verify(refreshToken)

		return this.createTokens(currentRefreshTokenPayload.id)
	}
}

export default AuthService
