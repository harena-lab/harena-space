document.querySelector('#console').value = ''

function present (output) {
  document.querySelector('#console').value += output + '\n'
}

present(JSON.stringify(AnnotationMetrics.i._selfOrderCount(
  [[1, 10], [2, 20], [1, 20], [2, 30]], present)))
present(JSON.stringify(AnnotationMetrics.i._selfOrderCount(
  [[1, 10, 2], [2, 20, 3], [1, 25, 5], [2, 30, 1]], present)))
present(JSON.stringify(AnnotationMetrics.i._selfOrderCount(
  [[1, 10], [2, 20], [1, 20], [3, 20], [1, 30], [2, 30], [3, 30]], present)))
present(JSON.stringify(AnnotationMetrics.i._selfOrderCount(
  [[2, 71, 2], [2, 96, 5], [3, 98, 3], [2, 100, 8], [5, 120, 2], [5, 130, 3], [5, 135, 4], [3, 140, 1], [5, 180, 2]], present)))
present(JSON.stringify(AnnotationMetrics.i._selfOrderCount(
  [[5, 135], [2, 100], [2, 71], [2, 96], [5, 130], [3, 98], [5, 180], [5, 120], [3, 140]], present)))
present(JSON.stringify(AnnotationMetrics.i._selfOrderCount(
  [[2, 71], [2, 96], [3, 98], [2, 98], [5, 98], [5, 130], [5, 135], [3, 140], [5, 180]], present)))
present(JSON.stringify(AnnotationMetrics.i._selfOrderCount(
  [[2, 65], [3, 65], [2, 89], [3, 89], [4, 35], [4, 35]], present)))

present(AnnotationMetrics.i._clusteringFreeRecall(
  [[2, 1], [4, 2], [4, 3], [3, 4], [2, 5], [3, 6], [1, 7], [4, 8], [4, 9]], present
))
present(AnnotationMetrics.i._clusteringFreeRecall(
  [[3, 1], [4, 2], [4, 3], [3, 4], [1, 5], [1, 6], [3, 7], [1, 8], [1, 9], [2, 10], [2, 11], [2, 12], [4, 13], [4, 14], [3, 15]], present
))
present(AnnotationMetrics.i._clusteringFreeRecall(
  [[2, 1], [2, 2], [3, 3], [1, 4], [1, 5], [1, 6], [1, 7], [2, 8], [3, 9], [3, 10], [2, 11], [1, 12], [4, 13], [4, 14], [4, 15], [4, 16], [2, 17], [2, 18], [3, 19], [1, 20]], present
))
present(AnnotationMetrics.i._clusteringFreeRecall(
  [[5, 135], [2, 100], [2, 71], [2, 96], [5, 130], [3, 98], [5, 180], [5, 120], [3, 140]], present))
present(AnnotationMetrics.i._clusteringFreeRecall(
  [[2, 71], [2, 96], [3, 98], [2, 98], [5, 98], [5, 130], [5, 135], [3, 140], [5, 180]], present))
present(AnnotationMetrics.i._clusteringFreeRecall(
  [[2, 71], [2, 96], [3, 98], [2, 98], [5, 98], [7,98], [5, 130], [5, 135], [3, 140], [5, 180]], present))
present(AnnotationMetrics.i._clusteringFreeRecall(
    [[2, 1], [5, 2], [2, 3], [3, 4], [1, 5], [5, 6]], present
))
present(AnnotationMetrics.i._clusteringFreeRecall(
  [[1, 1], [1, 2], [1, 3], [2, 4]], present
))
present(AnnotationMetrics.i._clusteringFreeRecall(
  [[7,1],[3,2],[7,3],[3,4],[2,5],[2,6]], present
))
present(AnnotationMetrics.i._clusteringFreeRecall(
  [[1,1],[1,2],[5,3],[2,4],[8,5],[1,6],[1,7]], present
))
present(AnnotationMetrics.i._clusteringFreeRecall(
  [[5,1], [5,2], [5,3]], present
))