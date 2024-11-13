type SearchRequest = { 
  search?: { [key: string]: any; } | undefined,
  where?: { [key: string]: any; } | undefined,
  whereHas?: { [key: string]: any; } | undefined,
  whereBetween?: { [key: string]: any; } | undefined,
  subWhere?: { [key: string]: any; } | undefined,
  orderBy?: Array<string>,
  fields?: Array<string> | undefined,
  preloads?: Array<string> | undefined,
  preloadsWhereHas?: Array<string> | undefined,
  withCounts?: Array<string> | undefined,
  page?: number | undefined,
  limit?: number | undefined,
};

export default SearchRequest;