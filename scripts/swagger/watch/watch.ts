import { watch } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'
import { exec as originalExec } from 'node:child_process'

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
