/**
 * Utilities in general
 */

class Basic {
   constructor() {
      this._host = null;
      this._rootPath = "../";

      // initial values of shared states
      this.currentThemeFamily = Basic.standardThemeFamily;
      this.currentCaseId = null;

      /*
      this.requestCurrentThemeFamily = this.requestCurrentThemeFamily.bind(this);
      MessageBus.ext.subscribe("control/_current_theme_name/get",
                               this.requestCurrentThemeFamily);
      */
   }

   /*
    * Properties
    */

   get host() {
      return this._host;
   }
   
   set host(newValue) {
      this._host = newValue;
   }

   get rootPath() {
      return this._rootPath;
   }
   
   set rootPath(newValue) {
      this._rootPath = newValue;
   }

   /*
    * States shared by author, player, and other environments
    */

   get currentThemeFamily() {
      return this._currentThemeFamily;
   }
   
   set currentThemeFamily(newValue) {
      // Translator.instance.currentThemeFamily = newValue;
      this._currentThemeFamily = newValue;
   }

   /*
   requestCurrentThemeFamily(topic, message) {
      MessageBus.ext.publish(MessageBus.buildResponseTopic(topic, message),
                             this.currentThemeFamily);
   }
   */

   set currentCaseId(newValue) {
      this._currentCaseId = newValue;
   }

   get currentCaseId() {
      return this._currentCaseId;
   }

   isBlank(str) {
      return (!str || /^\s*$/.test(str));
   }

   async signin(state) {
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

         const userEmail = "jacinto@example.com";
         const userPass = "jacinto";

         let loginReturn = await MessageBus.ext.request("data/user/login",
                                                        {email: userEmail,
                                                         password: userPass});

         userid = loginReturn.message.userid;
         if (userid == null)
            errorMessage =
               "<span style='color: red'>Invalid user and/or password.</span>";
         else {
            if (state)
              state.sessionRecord(userid, loginReturn.message.token);
         }
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
                  ((this.host != null) ? this.currentCaseId + "/" : "") +
                  path;
      return result;
   }

   themeStyleResolver(cssFile) {
      return this._rootPath + "themes/" + this.currentThemeFamily +
             "/css/" + cssFile;
   }

   systemStyleResolver(cssFile) {
      return this._rootPath + "themes/" + Basic.systemThemeFamily +
             "/css/" + cssFile;
   }

   // <TODO> Not used (remove?)
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
   Basic.standardThemeFamily = "minimal";
   Basic.systemThemeFamily = "system";

   Basic.service = new Basic();
})();