function typeOf(data) {
  return Object.prototype.toString
    .call(data)
    .slice(8, -1)
    .toLowerCase()
}

console.log(typeOf([]))
console.log(typeOf())
console.log(typeOf(null))
console.log(typeOf(''))
console.log(typeOf(0))
console.log(typeOf({}))
console.log(typeOf(false))
