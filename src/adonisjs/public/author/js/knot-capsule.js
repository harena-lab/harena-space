/**
 * Miniature Capsule
 *
 * Capsule of a mini running environment created to render a preview of a node inside a iframe miniature.
 */

class CapsuleManager {
   constructor() {
      window.messageBus.page = new MessageBus(false);
   }
   
   startCapsule() {
      PlayerManager.instance()._mainPanel = document.querySelector("#main-panel");
   }
}

(function() {
   CapsuleManager.capsule = new CapsuleManager();
})();