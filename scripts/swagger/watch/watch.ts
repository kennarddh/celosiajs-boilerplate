import path from 'path'

import { exec as originalExec } from 'child_process'
import { watch } from 'fs/promises'
import { promisify } from 'util'

import debounce from '../../utils/debouce'

const exec = promisify(originalExec)

const debounced = debounce(() => {
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
