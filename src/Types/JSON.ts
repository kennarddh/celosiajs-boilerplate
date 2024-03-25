export type JSON = string | number | boolean | JSONObject | JSONArray

export interface JSONObject {
	[x: string]: JSON
}

export interface JSONArray extends Array<JSON> {}
