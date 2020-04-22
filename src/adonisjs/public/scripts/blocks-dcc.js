/**
 * Customized blocks for Blockly
 */

class ScriptBlocksDCC {
   static create() {
      ScriptBlocksDCC.s = new ScriptBlocksDCC();
   }

   constructor() {
      this._buildBlocks();
   }

   _buildBlocks() {
      Blockly.Blocks["image"] = {
        init: function() {
          this.jsonInit({
            "message0": "image %1",
            "args0": [
               {
                 "type": "field_image",
                 "src": "images/cell/carnivorous-dinosaur.svg",
                 "width": 32,
                 "height": 32,
                 "alt": "carnivorous dinosaur"
               }
            ],
            "colour": 200,
            "tooltip": "A Dinosaur image.",
            "previousStatement": "Image"
          });
        }
      };
      Blockly.Blocks["state"] = {
        init: function() {
          this.jsonInit({
            "message0": "variable %1 rotate %2 image %3",
            "args0": [
               {
                 "type": "field_variable",
                 "name": "variable",
                 "variable": "x"
               },
               {
                 "type": "field_checkbox",
                 "name": "rotate",
                 "check": "Boolean"
               },
               {
                 "type": "input_statement",
                 "name": "image",
                 "check": "Image"
               }
            ],
            "colour": 200,
            "tooltip": "A State DCC."
          });
        }
      };

   }
}

(function() {
})();