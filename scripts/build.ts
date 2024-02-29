/* eslint-disable security/detect-non-literal-regexp */

/* eslint-disable security/detect-child-process */

/* eslint-disable security/detect-non-literal-fs-filename */
import { exec } from 'child_process'
import { existsSync, lstatSync, readdir, rmSync } from 'fs'
import { appendFile, copyFile, writeFile } from 'fs/promises'
import { resolve } from 'node:path'

import jestConfig from '../jest.config'
// eslint-disable-next-line import/extensions
import packageJson from '../package.json'

const { testRegex } = jestConfig

const env = process.argv[2]

const base = './build/'

const outDir = resolve(base, 'src')

const cleanCommand = 'npm run clean'
const buildCommand = `cross-env NODE_ENV=${env} npx tsc --outDir ${outDir}`
const buildTscAliasCommand = `cross-env NODE_ENV=${env} npx tsc-alias -p tsconfig.json --outDir ${outDir}`

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

const removeTestRecurive = (root: string) => {
	readdir(root, (error, files) => {
		if (error) throw error

		files.forEach(file => {
			const path = resolve(root, file)

			const lstat = lstatSync(path)

			const isDir = lstat.isDirectory()

			if (Array.isArray(testRegex)) {
				testRegex.forEach(regex => {
					if (new RegExp(regex).test(path)) {
						rmSync(path, { force: true, recursive: true })
					}
				})
			} else if (new RegExp(testRegex as string).test(path)) {
				rmSync(path, { force: true, recursive: true })

				return
			}

			if (isDir) {
				removeTestRecurive(path)
			}
		})
	})
}

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

	removeTestRecurive(base)
}

main()
