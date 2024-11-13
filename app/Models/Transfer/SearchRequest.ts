type SearchRequest = { 
  where?: { [key: string]: any; } | undefined,
  subWhere?: { [key: string]: any; } | undefined,
  fields?: Array<string> | undefined,
  preloads?: Array<string> | undefined,
  withCounts?: Array<string> | undefined,
  page?: number | undefined,
  limit?: number | undefined,
};

export default SearchRequest;