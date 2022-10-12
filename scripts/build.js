/* eslint-disable security/detect-non-literal-regexp */
/* eslint-disable security/detect-child-process */
const { exec } = require('node:child_process')
const { readdir, rmSync, lstatSync, existsSync } = require('node:fs')
const { writeFile, copyFile } = require('node:fs/promises')
const { resolve } = require('node:path')

const packageJson = require('../package')
const { testRegex } = require('../jest.config')

const cleanCommand = 'npm run clean'
const transpileCommand =
	'cross-env NODE_ENV=production npx babel ./src --out-dir ./build/src/'
const buildCodeCommand =
	'npx swagger-cli bundle ./src/Swagger/Swagger.json --outfile ./build/src/Swagger.json --type json'

const base = './build/'

const {
	devDependencies: _,
	scripts: _2,
	keywords: _3,
	...newPackageJson
} = packageJson

newPackageJson.main = './src/index.js'
newPackageJson.scripts = { start: 'node ./src/index.js' }

const execPromise = command =>
	new Promise((resolvePromise, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error) return reject(error)

			resolvePromise(stdout, stderr)
		})
	})

const recursive = root => {
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
			} else if (new RegExp(testRegex).test(path)) {
				rmSync(path, { force: true, recursive: true })

				return
			}

			// eslint-disable-next-line security/detect-non-literal-regexp

			if (isDir) {
				recursive(path)
			}
		})
	})
}

const copyEnv = () => {
	if (existsSync('./.env.production.local')) {
		copyFile('./.env.production.local', resolve(base, '.env'))
	} else {
		copyFile('./.env.example', resolve(base, '.env'))
	}
}

const main = async () => {
	await execPromise(cleanCommand)

	await execPromise(transpileCommand)

	await execPromise(buildCodeCommand)

	writeFile(resolve(base, 'package.json'), JSON.stringify(newPackageJson))

	copyEnv()

	recursive(base)
}

main()
