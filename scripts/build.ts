/* eslint-disable security/detect-non-literal-regexp */
/* eslint-disable security/detect-child-process */
import { exec } from 'node:child_process'
import { readdir, rmSync, lstatSync, existsSync } from 'node:fs'
import { writeFile, copyFile, appendFile } from 'node:fs/promises'
import { resolve } from 'node:path'

// eslint-disable-next-line import/extensions
import packageJson from '../package.json'
import jestConfig from '../jest.config'

const { testRegex } = jestConfig

const env = process.argv[2]

const base = './build/'

const cleanCommand = 'npm run clean'
const buildCommand = `cross-env NODE_ENV=${env} npx tsc --outDir ${resolve(
	base,
	'src'
)}`
const buildCodeCommand = `npx swagger-cli bundle ./src/Swagger/Swagger.json --outfile ${base}src/Swagger.json --type json`

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

	await execPromise(buildCodeCommand)

	writeFile(resolve(base, 'package.json'), JSON.stringify(newPackageJson))

	copyEnv()

	removeTestRecurive(base)
}

main()
