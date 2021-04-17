function clockText (time) {
  return (
    ('' + Math.floor(time / 60)).padStart(2, '0') +
    ':' + ('' + (time % 60)).padStart(2, '0')
  )
}
