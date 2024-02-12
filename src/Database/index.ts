import { PrismaClient } from '@prisma/client'

import Logger from 'Utils/Logger/Logger'

const prisma = new PrismaClient()

Logger.info('DB Init')

export default prisma
