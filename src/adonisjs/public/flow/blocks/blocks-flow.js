const flowSocket = new Rete.Socket("Flow");

class KnotComponent extends Rete.Component {
   constructor(title){
      super(title);
      this.contextMenuName = "Flow";
   }

   builder(node) {
      let inpf = new Rete.Input("flw","Flow", flowSocket);
      let outf = new Rete.Output("flw", "Flow", flowSocket);
      return node
         .addInput(inpf)
         .addOutput(outf);
   }

   worker(node, inputs, outputs) {
      outputs["flw"] = node.data.flw;
   }

   rename(component) {
      return component.contextMenuName || component.name;
   }
}
