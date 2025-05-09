import InMemoryCache from '~~/server/domain/InMemoryCache'

export const useInMemoryCache = <T>() => ({
  cache: new InMemoryCache<T>(),
})
