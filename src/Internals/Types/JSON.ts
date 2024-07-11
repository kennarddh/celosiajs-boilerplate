type JSON = null | string | number | boolean | JSONObject | JSONArray

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
export interface JSONObject {
	[x: string]: JSON
}

export type JSONArray = JSON[]

export default JSON
