/**
 * Panel Manager
 *
 * Manages the panels.
 */

class Panels {
   static start() {
      Panels.s = new Panels();
   }

   constructor() {
      this._navigationBlock = document.querySelector("#navigation-block");
      this._knotPanel = document.querySelector("#knot-panel");
      this._propertiesPanel = document.querySelector("#properties-panel");
      this._buttonExpandNav = document.querySelector("#button-expand-nav");
      this._buttonRetracNav = document.querySelector("#button-retract-nav");
   }

   setupWideNavigator() {
      this._navigationBlock.style.flex = "80%";
      this._knotPanel.style.flex = "20%";
      this._buttonExpandNav.style.display = "none";
      this._buttonRetracNav.style.display = "initial";
   }

   setupRegularNavigator() {
      this._navigationBlock.style.flex = "20%";
      this._knotPanel.style.flex = "80%";
      this._buttonExpandNav.style.display = "initial";
      this._buttonRetracNav.style.display = "none";
   }

   setupProperties() {
      this._navigationBlock.style.flex = "10%";
      this._knotPanel.style.flex = "60%";
      this._propertiesPanel.style.display = "initial";
      // this._propertiesPanel.style.flex = "30%";
   }
}