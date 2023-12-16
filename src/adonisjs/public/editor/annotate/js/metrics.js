class AnnotationMetrics {
  _selfOrderCount(categoriesOrder) {
    // sort by text position (second element)
    const sortedL = categoriesOrder.sort((a, b) => a[1] - b[1])
  
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
  
    // sort groups by position (second element)
    const sortedG = grouped.sort((a, b) => a[1] - b[1])
    const groupsText = JSON.parse(JSON.stringify(sortedG))
  
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
            sortedG[prev][2] += sortedG[i][2]
            sortedG.splice(i, 1)
            // if (sortedG[prev][2] >= sortedG[i][2]) {
            //   sortedG[prev][2] += sortedG[i][2]
            //   sortedG.splice(i, 1)
            // } else {
            //   sortedG[i][2] += sortedG[prev][2]
            //   sortedG.splice(prev, 1)
            // }
          }
        }
      }
    }
  
    return {
      groups: groupsText,
      ordered: sortedG,
      score: subs
    }
  }

  /*
  * Category clustering calculator for free recall
  * https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3665324/
  */
  _clusteringFreeRecall (categoriesOrder) {
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

    return arc
  }
}

(function () {
  AnnotationMetrics.i = new AnnotationMetrics()
})()