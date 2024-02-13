import { PrismaClient } from '@prisma/client'
import { PrismaClientInitializationError } from '@prisma/client/runtime/library'

import Logger from 'Utils/Logger/Logger.js'

const prisma = new PrismaClient()

Logger.info('DB Init')

try {
	await prisma.$connect()

	Logger.info('DB Connected')
} catch (error) {
	if (error instanceof PrismaClientInitializationError) {
		Logger.error('Prisma failed to connect to the database.', { error })
	}
}

export default prisma
