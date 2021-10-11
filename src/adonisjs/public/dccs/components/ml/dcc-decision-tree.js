/* Decision Tree DCC
  ******************/

class DCCDecisionTree extends DCCBase {
  constructor () {
    super()

    this.train = this.train.bind(this)
  }

  connectedCallback () {
    super.connectedCallback()

    if (this.hasAttribute('id'))
      this._provides(this.id, 'ml/train', this.train)
  }

  notify (topic, message) {
    if (!topic.includes('/'))
      topic = 'ml/' + topic
    const content =
      ((message.value) ? message.value : (message.body) ? message.body : message)
    switch (topic.toLowerCase()) {
      case 'ml/train':
        this.train(content.csv)
        break
    }
  }

  train (csv) {
    loadString(csv, function(D) {
      var tree = new learningjs.tree();
      tree.train(D, function(model, err){
        if(err) {
          console.log(err);
        } else {
          model.calcAccuracy(D.data, D.targets, function(acc, correct, total){
            console.log( 'training: got '+correct +' correct out of '+total+' examples. accuracy:'+(acc*100.0).toFixed(2)+'%');
          });
          console.log('=== resulting tree')
          console.log(model)
        }
      });
    });
  }

  
}

(function () {
  customElements.define('dcc-decision-tree', DCCDecisionTree)
})()
