/**
 * Utilities in general
 */

class Utils {
   screenDimensions() {
      let dimensions = {
         left: (window.screenLeft != undefined) ? window.screenLeft : window.screenX,
         top: (window.screenTop != undefined) ? window.screenTop : window.screenY,
         width: (window.innerWidth)
                   ? window.innerWidth
                   : (document.documentElement.clientWidth)
                      ? document.documentElement.clientWidth
                      : screen.width,
         height: (window.innerHeight)
                    ? window.innerHeight
                    : (document.documentElement.clientHeight)
                       ? document.documentElement.clientHeight
                       : screen.height,
         };
      dimensions.zoom = dimensions.width / window.screen.availWidth;
      return dimensions;
   }
   
   centralize(width, height) {
      const dimensions = this.screenDimensions();
      return {
         left: ((dimensions.width - width) / 2) / dimensions.zoom + dimensions.left,
         top: ((dimensions.height - height) / 2) / dimensions.zoom + dimensions.top
      }
   }
}

(function() {
   Utils.tools = new Utils();
})();