/**
 * Customized blocks for Blockly
 */

class ScriptBlocksDCC {
   static create() {
      ScriptBlocksDCC.s = new ScriptBlocksDCC();
   }

   constructor() {
      this._buildBlocks();
      this._codeGenerator();
   }

   _buildBlocks() {
      Blockly.Blocks["image"] = {
        init: function() {
          this.jsonInit({
            "message0": "image %1",
            "args0": [
               {
                 "type": "field_image",
                 "name": "src",
                 "src": "images/cell/carnivorous-dinosaur.svg",
                 "width": 32,
                 "height": 32,
                 "alt": "carnivorous dinosaur"
               }
            ],
            "colour": 200,
            "tooltip": "A Dinosaur image.",
            "output": "lists_create_with_item"
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
                 "type": "input_value",
                 "name": "image",
                 "check": "Array"
               }
            ],
            "colour": 200,
            "tooltip": "A State DCC."
          });
        }
      };

   }

   _codeGenerator() {
      Blockly.JavaScript["image"] = function(block) {
         return "<dcc-image image='" +
                block.getFieldValue("src") + "'>\n" +
                "</dcc-image>";
      };
      Blockly.JavaScript["state"] = function(block) {
         return "<dcc-state variable='" +
                block.getFieldValue("variable") + "'" +
                ((block.getFieldValue("rotate") == "TRUE") ? " rotate" : "") +
                // Blockly.JavaScript.valueToCode(block, "image") +
                ">\n" +
                "</dcc-state>";
      };
   }
}

(function() {
})();