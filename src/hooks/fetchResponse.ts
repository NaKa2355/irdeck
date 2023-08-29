
interface FetchResponse<Data, Error> {
    data: Data;
    error: Error | undefined;
    isCached: boolean;
    isError: boolean;
    isFetching: boolean;
    fetch: () => {};
}