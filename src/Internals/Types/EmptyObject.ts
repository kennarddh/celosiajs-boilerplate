// https://github.com/sindresorhus/type-fest/blob/main/source/empty-object.d.ts
declare const emptyObjectSymbol: unique symbol

type EmptyObject = { [emptyObjectSymbol]?: never }

export default EmptyObject
