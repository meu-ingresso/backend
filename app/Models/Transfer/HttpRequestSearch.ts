type HttpRequestSearch = { 
  search: { [key: string]: any; } | undefined,
  where: { [key: string]: any; } | undefined,
  whereHas: { [key: string]: any; } | undefined,
  subWhere: { [key: string]: any; } | undefined,
  fields: Array<string> | undefined,
  preloads: Array<string> | undefined,
  withCounts: Array<string> | undefined,
  page: number | undefined,
  limit: number | undefined,
};

export default HttpRequestSearch;