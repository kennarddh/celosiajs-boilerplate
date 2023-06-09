import path from 'path'

import { exec as originalExec } from 'child_process'
import { watch } from 'fs/promises'
import { promisify } from 'util'

import Debouce from '../../Utils/Debouce'

const exec = promisify(originalExec)

const debounced = Debouce(() => {
	exec('npm run build:swagger')
}, 500)

const watcher = watch(path.resolve(__dirname, '../../../src/Swagger/'), {
	recursive: true,
})

const main = async () => {
	// eslint-disable-next-line no-restricted-syntax
	for await (const _ of watcher) {
		debounced()
	}
}

main()
