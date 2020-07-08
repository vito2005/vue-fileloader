export default (value) => {
  const sizes = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
    TB: 1024 * 1024 * 1024 * 1024
  }
  const size = value > sizes.TB ? 'TB'
    : value > sizes.GB ? 'GB'
      : value > sizes.MB ? 'MB'
        : value > sizes.KB ? 'KB' : 'B'
  return (value / sizes[size]).toFixed(1) + ' ' + size
}
