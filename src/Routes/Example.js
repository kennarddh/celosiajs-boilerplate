import express from 'express'

// Controllers
import { ExampleController } from '../Controllers/Example'

// Validation
import ExampleValidation from '../Validation/Example'

const Router = express.Router()

Router.post('/example', ExampleValidation(), ExampleController)

export default Router
