/** Memoize the first prepare call (Rspress may invoke `config` more than once). */
export function createPrepareOnce<Options>(
  prepare: (options: Options) => Promise<void>
): (options: Options) => Promise<void> {
  let pending: Promise<void> | undefined
  return options => {
    pending ??= prepare(options)
    return pending
  }
}
