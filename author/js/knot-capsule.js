/**
 * 
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