function sortSubstitutionCount(numbersList) {
  const sortedL = numbersList.slice().sort((a, b) => a - b)
  present(numbersList)
  present(sortedL)
  let subs = 0
  for (let i = 0; i < numbersList.length; i++) {
    if (numbersList[i] !== sortedL[i]) {
      subs++
    }
  }
  return Math.ceil(subs/2)
}

// present(sortSubstitutionCount([1, 1, 1, 2, 3, 3, 4]))
// present(sortSubstitutionCount([1, 1, 1, 3, 2, 3, 4]))
// present(sortSubstitutionCount([1, 1, 1, 3, 3, 2, 4]))
// present(sortSubstitutionCount([1, 1, 1, 4, 3, 2, 3]))
// present(sortSubstitutionCount([1, 4, 1, 3, 3, 2, 1]))
// present(sortSubstitutionCount([4, 3, 3, 2, 1, 1, 1]))

function selfOrderCount(categoriesOrder) {
  // sort by text position (second element)
  const sortedL = categoriesOrder.sort((a, b) => a[1] - b[1])
  present('Sorted by position')
  present(sortedL)

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
  present('Grouped by category')
  present(JSON.parse(JSON.stringify(grouped)))

  // sort groups by position (second element)
  const sortedG = grouped.sort((a, b) => a[1] - b[1])
  present('Group sorted by position')
  present(JSON.parse(JSON.stringify(sortedG)))

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
  present('Final group after ordering')
  present(sortedG)

  return subs
}

// present(selfOrderCount(
//   [[1, 10], [2, 20], [1, 20], [2, 30]]))
// present(selfOrderCount(
//   [[1, 10], [2, 20], [1, 25], [2, 30]]))
// present(selfOrderCount(
//   [[1, 10], [2, 20], [1, 20], [3, 20], [1, 30], [2, 30], [3, 30]]))
// present(selfOrderCount(
//   [[2, 71], [2, 96], [3, 98], [2, 100], [5, 120], [5, 130], [5, 135], [3, 140], [5, 180]]))
// present(selfOrderCount(
//   [[5, 135], [2, 100], [2, 71], [2, 96], [5, 130], [3, 98], [5, 180], [5, 120], [3, 140]]))
// present(selfOrderCount(
//   [[2, 71], [2, 96], [3, 98], [2, 98], [5, 98], [5, 130], [5, 135], [3, 140], [5, 180]]))

/*
 * Category clustering calculator for free recall
 * https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3665324/
 * tested here and traferred to /editor/annotate/js/metrics.js
*/
function clusteringFreeRecall(categoriesOrder, console) {

  const n = categoriesOrder.length  // number of recalled items

  // sort by text position (second element)
  const sortedL = categoriesOrder.sort((a, b) => a[1] - b[1])

  const nc = {}  // number of recalled items in each recalled category
  let r = 0  // number of category repetition
  for (let i = 0; i < sortedL.length; i++) {
    const cat = sortedL[i][0]
    if (!nc[cat])
      nc[cat] = 1
    else
      nc[cat]++
    let nextPos = i + 1
    while (nextPos < sortedL.length && sortedL[nextPos][1] === sortedL[i][1])
      nextPos++
    if (nextPos < sortedL.length) {
      let sp = nextPos
      while (sp < sortedL.length && sortedL[sp][1] === sortedL[nextPos][1]) {
        if (cat == sortedL[sp][0]) {
          r++
          break
        }
        sp++
      }
    }
  }

  const c = Object.keys(nc).length  // number of recalled categories
  const max = n - c  // maximum possible number of category repetitions

  let er = 0  // expected number of category repetitions
  for (const cat in nc)
    er += nc[cat] * nc[cat]
  er = er / n - 1

  const rr = r / (n - 1)  // ratio of repetition

  const mrr = r / max  // modified ratio of repetition

  const ds = r - er  // deviation score

  const arc = (r - er) / (max - er)  // adjusted ratio of clustering

  if (console) {
    present('\n\n=== Clustering Free Recall ===')
    present(JSON.stringify(categoriesOrder))
    present('--- n = ' + n)
    present('--- sorted by position')
    present(JSON.stringify(sortedL))
    present('--- c = ' + c)
    present('--- ni')
    present(nc)
    present('--- r = ' + r)
    present('--- max = ' + max)
    present('--- E(r) = ' + Math.round(er * 100) / 100)
    present('--- RR = ' + Math.round(rr * 100) / 100)
    present('--- MRR = ' + Math.round(mrr * 100) / 100)
    present('--- DS = ' + Math.round(ds * 100) / 100)
    present('--- ARC = ' + Math.round(arc * 100) / 100)
  }

  return arc
}

function present (output) {
  document.querySelector('#console').value += output + '\n'
}

present(clusteringFreeRecall(
  [[2, 1], [4, 2], [4, 3], [3, 4], [2, 5], [3, 6], [1, 7], [4, 8], [4, 9]], true
))
present(clusteringFreeRecall(
  [[3, 1], [4, 2], [4, 3], [3, 4], [1, 5], [1, 6], [3, 7], [1, 8], [1, 9], [2, 10], [2, 11], [2, 12], [4, 13], [4, 14], [3, 15]], true
))
present(clusteringFreeRecall(
  [[2, 1], [2, 2], [3, 3], [1, 4], [1, 5], [1, 6], [1, 7], [2, 8], [3, 9], [3, 10], [2, 11], [1, 12], [4, 13], [4, 14], [4, 15], [4, 16], [2, 17], [2, 18], [3, 19], [1, 20]], true
))
present(clusteringFreeRecall(
  [[5, 135], [2, 100], [2, 71], [2, 96], [5, 130], [3, 98], [5, 180], [5, 120], [3, 140]], true))
present(clusteringFreeRecall(
  [[2, 71], [2, 96], [3, 98], [2, 98], [5, 98], [5, 130], [5, 135], [3, 140], [5, 180]], true))
present(clusteringFreeRecall(
  [[2, 71], [2, 96], [3, 98], [2, 98], [5, 98], [7,98], [5, 130], [5, 135], [3, 140], [5, 180]], true))