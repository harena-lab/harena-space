class AnnotationMetrics {
  _selfOrderCount(categoriesOrder, present) {
    // sort by text position (second element)
    const sortedL = categoriesOrder.sort((a, b) => a[1] - b[1])
  
    // group by category (first element)
    // group = [category, position of the first group element, count]
    const grouped = []
    for (let cat = 1; cat <= 8; cat++) {
      let prev = -1
      let prevG = -1
      let catG = null
      for (let i = 0; i < sortedL.length; i++) {
        if (sortedL[i][0] === cat) {
          // if any element in the previous position is not in the same category
          if (prev == -1 || (sortedL[prev][0] !== cat &&
              (prevG == -1 || sortedL[prev][1] > sortedL[prevG][1]))) {
            catG = [cat, sortedL[i][1], 1]  // new category grouping
            grouped.push(catG)
          } else {
            catG[2]++
          }
          prevG = i
        }
        // last distinct position in the sequence
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
          }
        }
      }
    }

    if (present != null) {
      present('\n\n=== Self Order Count ===')
      present('--- sorted by position')
      present(sortedL)
      present('--- grouped by category')
      present(JSON.parse(JSON.stringify(grouped)))
      present('--- group sorted by position')
      present(JSON.parse(JSON.stringify(sortedG)))
      present('--- final group after ordering')
      present(sortedG)
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
  _clusteringFreeRecall (categoriesOrder, present) {
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
      // find next position of the same category or neighbor start
      while (nextPos < sortedL.length &&
             sortedL[nextPos][0] != cat && sortedL[nextPos][1] === sortedL[i][1])
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

    const arc = 
      (max - er == 0) ? ('' + (r - er)) + ('/' + (max - er)) : (r - er) / (max - er)  // adjusted ratio of clustering

    if (present != null) {
      present('\n\n=== Clustering Free Recall ===')
      present(JSON.stringify(categoriesOrder))
      present('--- n = ' + n)
      present('--- sorted by position')
      present(JSON.stringify(sortedL))
      present('--- c = ' + c)
      present('--- ni')
      present(JSON.stringify(nc))
      present('--- r = ' + r)
      present('--- max = ' + max)
      present('--- E(r) = ' + Math.round(er * 100) / 100)
      present('--- RR = ' + Math.round(rr * 100) / 100)
      present('--- MRR = ' + Math.round(mrr * 100) / 100)
      present('--- DS = ' + Math.round(ds * 100) / 100)
      present('--- ARC = ' + ((isNaN(arc)) ? arc : Math.round(arc * 100) / 100))
    }

    return arc
  }
}

(function () {
  AnnotationMetrics.i = new AnnotationMetrics()
})()