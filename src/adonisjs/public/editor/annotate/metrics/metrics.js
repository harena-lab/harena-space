function sortSubstitutionCount(numbersList) {
  const sortedL = numbersList.slice().sort((a, b) => a - b)
  console.log(numbersList)
  console.log(sortedL)
  let subs = 0
  for (let i = 0; i < numbersList.length; i++) {
    if (numbersList[i] !== sortedL[i]) {
      subs++
    }
  }
  return Math.ceil(subs/2)
}

// console.log(sortSubstitutionCount([1, 1, 1, 2, 3, 3, 4]))
// console.log(sortSubstitutionCount([1, 1, 1, 3, 2, 3, 4]))
// console.log(sortSubstitutionCount([1, 1, 1, 3, 3, 2, 4]))
// console.log(sortSubstitutionCount([1, 1, 1, 4, 3, 2, 3]))
// console.log(sortSubstitutionCount([1, 4, 1, 3, 3, 2, 1]))
// console.log(sortSubstitutionCount([4, 3, 3, 2, 1, 1, 1]))

function selfOrderCount(categoriesOrder) {
  // sort by text position (second element)
  const sortedL = categoriesOrder.sort((a, b) => a[1] - b[1])
  console.log('Sorted by position')
  console.log(sortedL)

  // group by category (first element)
  // group = [category, position, count]
  const grouped = []
  for (let cat = 1; cat <= 8; cat++) {
    let prev = -1
    let prevG = -1
    let catG = null
    for (let i = 0; i < sortedL.length; i++) {
      if (sortedL[i][0] === cat) {
        if (prev == -1 || (sortedL[prev][0] !== cat &&
            (prevG == -1 || sortedL[prev][1] > sortedL[prevG][1]))) {
          catG = [cat, sortedL[i][1], 1]
          grouped.push(catG)
        } else {
          catG[2]++
        }
        prevG = i
      }
      if (i+1 == sortedL.length || sortedL[i+1][1] !== sortedL[i][1])
        prev = i
    }
  }
  console.log('Grouped by category')
  console.log(JSON.parse(JSON.stringify(grouped)))

  // sort groups by position (second element)
  const sortedG = grouped.sort((a, b) => a[1] - b[1])
  console.log('Group sorted by position')
  console.log(JSON.parse(JSON.stringify(sortedG)))

  // count order change to group together categories
  let subs = 0
  for (let cat = 1; cat <= 8; cat++) {
    let prev = -1
    for (let i = 0; i < sortedG.length; i++) {
      if (sortedG[i][0] === cat) {
        if (prev === -1)
          prev = i
        else {
          subs++
          if (sortedG[prev][2] >= sortedG[i][2]) {
            sortedG[prev][2] += sortedG[i][2]
            sortedG.splice(i, 1)
          } else {
            sortedG[i][2] += sortedG[prev][2]
            sortedG.splice(prev, 1)
          }
        }
      }
    }
  }
  console.log('Final group after ordering')
  console.log(sortedG)

  return subs
}

console.log(selfOrderCount(
  [[1, 10], [2, 20], [1, 20], [2, 30]]))
console.log(selfOrderCount(
  [[1, 10], [2, 20], [1, 25], [2, 30]]))
console.log(selfOrderCount(
  [[1, 10], [2, 20], [1, 20], [3, 20], [1, 30], [2, 30], [3, 30]]))
console.log(selfOrderCount(
  [[2, 71], [2, 96], [3, 98], [2, 100], [5, 120], [5, 130], [5, 135], [3, 140], [5, 180]]))
console.log(selfOrderCount(
  [[5, 135], [2, 100], [2, 71], [2, 96], [5, 130], [3, 98], [5, 180], [5, 120], [3, 140]]))
console.log(selfOrderCount(
  [[2, 71], [2, 96], [3, 98], [2, 98], [5, 98], [5, 130], [5, 135], [3, 140], [5, 180]]))