import { Response } from 'express'

import { JSON } from 'Types/JSON'
import { z } from 'zod'

import BaseController from './BaseController'
import BaseMiddleware from './BaseMiddleware'

export type EmptyObject = Record<PropertyKey, never>

export type MiddlewareArray = BaseMiddleware<any, any, any>[]

export type ValidateMiddlewares<
	Controller extends BaseController<any>,
	T extends MiddlewareArray,
	Input extends Record<string, any> = Record<string, never>,
	Results extends any[] = [],
> = T extends [
	BaseMiddleware<IControllerRequest<Controller>, Input, infer Output>,
	...infer Tail extends MiddlewareArray,
]
	? ValidateMiddlewares<Controller, Tail, Input & Output, [...Results, T[0]]>
	: T extends [
				BaseMiddleware<IRequest<any, any, any, any>, any, infer Output>,
				...infer Tail extends MiddlewareArray,
		  ]
		? ValidateMiddlewares<
				Controller,
				Tail,
				Input,
				[...Results, BaseMiddleware<IControllerRequest<Controller>, Input, Output>]
			>
		: Results

type MergeMiddlewaresOutput<
	T extends MiddlewareArray,
	Input extends Record<string, any> = {},
> = T extends [BaseMiddleware<any, any, infer Output>, ...infer Tail extends MiddlewareArray]
	? MergeMiddlewaresOutput<Tail, Output & Input>
	: Input

export type ValidateController<
	Controller extends BaseController<any>,
	Middlewares extends MiddlewareArray | [],
> =
	Controller extends BaseController<infer Data>
		? MergeMiddlewaresOutput<Middlewares> extends Data
			? Controller
			: never
		: never

export type IControllerRequest<Controller extends BaseController<any>> = IRequest<
	z.infer<Controller['body']>,
	z.infer<Controller['query']>,
	z.infer<Controller['params']>,
	z.infer<Controller['cookies']>
>

export interface IRequest<
	Body extends Record<string, any> = Record<PropertyKey, never>,
	Query extends Record<string, any> = Record<PropertyKey, never>,
	Params extends Record<string, any> = Record<PropertyKey, never>,
	Cookies extends Record<string, any> = Record<PropertyKey, never>,
> {
	body: {} extends Body ? Record<PropertyKey, never> : Body
	query: {} extends Query ? Record<PropertyKey, never> : Query
	params: {} extends Params ? Record<PropertyKey, never> : Params
	cookies: {} extends Cookies ? Record<PropertyKey, never> : Cookies
}

export type IControllerResponse = Response<JSON>
