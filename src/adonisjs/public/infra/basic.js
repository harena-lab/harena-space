/**
 * Utilities in general
 */

class Basic {
   contructor() {
      this._author = null;
   }

   get author() {
      return this._author;
   }
   
   set author(newValue) {
      this._author = newValue;
   }

   async signin() {
      let status = "start";
      let userid = null;
      let errorMessage = "";
      while (userid == null) {
         /*
         const userEmail =
            await DCCNoticeInput.displayNotice(errorMessage +
                                         "<h3>Signin</h3><h4>inform your email:</h4>",
                                         "input");
         const userPass =
            await DCCNoticeInput.displayNotice("<h3>Signin</h3><h4>inform your password:</h4>",
                                         "password");
         */

         let userEmail = "jacinto@example.com";
         let userPass = "jacinto";

         let loginReturn = await MessageBus.ext.request("data/user/login",
                                                        {email: userEmail,
                                                         password: userPass});

         userid = loginReturn.message.userid;
         if (this._userId == null)
            errorMessage =
               "<span style='color: red'>Invalid user and/or password.</span>";
      }
      return userid;
   }
   
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

   imageResolver(path) {
      let result = path;
      // <TODO> improve
      if (!(path.startsWith("http://") || path.startsWith("https://") ||
            path.startsWith("/") || path.startsWith("../")))
         result = DCCCommonServer.managerAddress + "artifacts/cases/" +
                  ((this.author != null) ? this.author.currentCaseId + "/" : "") +
                  path;
      return result;
   }

   themeStyleResolver(theme, cssFile) {
      return "../themes/" + theme + "/css/" + cssFile;
   }

   replaceStyle(targetDocument, oldCSS, newTheme, cssFile) {
      if (oldCSS)
         targetDocument.head.removeChild(oldCSS);

      const cssF = (cssFile) ? cssFile : "theme.css";

      let newCSS = document.createElement("link");
      newCSS.setAttribute("rel", "stylesheet");
      newCSS.setAttribute("type", "text/css");
      newCSS.setAttribute("href", this.themeStyleResolver(newTheme, cssF));
      targetDocument.head.appendChild(newCSS);

      return newCSS;
   }
}

(function() {
   Basic.service = new Basic();
})();