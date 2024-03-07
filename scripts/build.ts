/* eslint-disable security/detect-non-literal-fs-filename security/detect-child-process */
import { exec } from 'child_process'
import { existsSync } from 'fs'
import { appendFile, copyFile, writeFile } from 'fs/promises'
import { resolve } from 'node:path'

import packageJson from '../package.json'

const env = process.argv[2]

const base = './build/'

const cleanCommand = 'npm run clean'
const buildCommand = `cross-env NODE_ENV=${env} npx tsc --outDir ${base}`
const buildTscAliasCommand = `cross-env NODE_ENV=${env} npx tsc-alias -p tsconfig.json --outDir ${base}`

interface IPackageJson {
	name: string
	version: string
	scripts: Record<string, string>
	dependencies: Record<string, string>
}

const newPackageJson: IPackageJson = {
	name: packageJson.name,
	version: packageJson.version,
	scripts: {},
	dependencies: packageJson.dependencies,
}

newPackageJson.scripts.start = `node ./src/index.js`

const execPromise = (command: string) =>
	new Promise((resolvePromise, reject) => {
		exec(command, (error, stdout) => {
			if (error) return reject(error)

			resolvePromise(stdout)
		})
	})

const copyEnv = async () => {
	let path = ''

	if (env === 'production' && existsSync('./.env.production.local')) {
		path = './.env.production.local'
	} else if (env === 'development' && existsSync('./.env')) {
		path = './.env'
	} else {
		path = './.env.example'
	}

	copyFile(path, resolve(base, '.env')).then(() => {
		appendFile(resolve(base, '.env'), `\n\nNODE_ENV=${env}`)
	})
}

const main = async () => {
	await execPromise(cleanCommand)

	await execPromise(buildCommand)

	await execPromise(buildTscAliasCommand)

	writeFile(resolve(base, 'package.json'), JSON.stringify(newPackageJson))

	copyEnv()
}

main()
