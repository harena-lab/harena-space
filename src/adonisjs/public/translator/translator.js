/**
 * Translator of Case Notebooks
 * 
 * Translates case notebook narratives (extension of markdown) to object representations and further to HTML.
 */
class Translator {
   
   constructor() {
      this.authoringRender = false;

      this._markdownTranslator = new showdown.Converter();
      
      this._annotationMdToObj = this._annotationMdToObj.bind(this);
      /*
      this._textObjToHTML = this._textObjToHTML.bind(this);
      this._imageObjToHTML = this._imageObjToHTML.bind(this);
      */
      // this._textObjToHTML = this._textObjToHTML.bind(this);
   }

   /*
    * Properties
    */

   get currentThemeFamily() {
      return this._currentThemeFamily;
   }
   
   set currentThemeFamily(newValue) {
      this._currentThemeFamily = newValue;
   }

   get authoringRender() {
      return this._authoringRender;
   }
   
   set authoringRender(newValue) {
      this._authoringRender = newValue;
   }

   get authorAttr() {
      return (this.authoringRender) ? " author" : "";
   }

   /*
    * Proxy of Markdown functions
    */
   htmlToMarkdown(html) {
      return this._markdownTranslator.makeMarkdown(html);
   }

   /*
    * Compiles a markdown text to an object representation
    */
   compileMarkdown(caseId, markdown) {
      let compiledCase = this._indexKnots(caseId, markdown);
      
      for (let kn in compiledCase.knots) {
         this.extractKnotAnnotations(compiledCase.knots[kn]);
         this.compileKnotMarkdown(compiledCase.knots, kn);
      }

      this._extractCaseMetadata(compiledCase);

      return compiledCase;
   }

   /*
    * Index all knots to guide references
    */
   _indexKnots(caseId, markdown) {
      let compiledCase = {
         id:    caseId,
         knots: {}
      };
      
      let knotCtx = [];
      let knotBlocks = markdown.split(Translator.marksKnotTitle);
      for (var kb = 1; kb < knotBlocks.length; kb += 2) {
         let transObj = this._knotMdToObj(knotBlocks[kb].match(Translator.marks.knot));
         transObj.render = true;
         let label = transObj.title;
         // console.log("Label: " + label);
         if (transObj.level == 1)
            knotCtx[0] = {label: label, obj: transObj};
         else {
            let upper = -1;
            for (let l = transObj.level-2; l >=0 && upper == -1; l--)
               if (knotCtx[l] != null)
                  upper = l;
            
            if (upper != -1) {
               label = knotCtx[upper].label + "." + label;
               knotCtx[upper].obj.render = false;
            }
            knotCtx[transObj.level-1] = {label: label, obj: transObj};
         }
         let knotId = label.replace(/ /g, "_");
         if (kb == 1)
            compiledCase.start = knotId;
         else if (transObj.categories && transObj.categories.indexOf("start") >= 0)
            compiledCase.start = knotId;
         if (compiledCase.knots[knotId]) {
            if (!compiledCase._error)
               compiledCase._error = [];
            compiledCase._error.push("Duplicate knots title: " + label);
         } else {
            transObj._source = knotBlocks[kb] + knotBlocks[kb+1];
            compiledCase.knots[knotId] = transObj;
         }
      }
      return compiledCase;
   }
   
   /*
    * Extract annotations of a single node
    */
   extractKnotAnnotations(knot) {
      const mdAnnToObj = {
         ctxopen   : this._contextOpenMdToObj,
         ctxclose  : this._contextCloseMdToObj,
         annotation: this._annotationMdToObj
      };
      
      knot.annotations = [];
      let currentSet = knot.annotations;
      // let maintainContext = false;

      let mdfocus = knot._source;
      
      // let newSource = "";
      let matchStart;
      do {
         // look for the next nearest expression match
         matchStart = -1;
         let selected = "";
         for (let mk in Translator.marksAnnotation) {
            let pos = mdfocus.search(Translator.marksAnnotation[mk]);
            if (pos > -1 && (matchStart == -1 || pos < matchStart)) {
               selected = mk;
               matchStart = pos;
            }
         }
         
         if (matchStart > -1) {
            // add a segment that does not match to any expression
            // if (matchStart > 0)
            //    newSource += mdfocus.substring(0, matchStart);
            
            // translate the expression to an object
            let matchSize = mdfocus.match(Translator.marksAnnotation[selected])[0].length;
            let toTranslate = mdfocus.substr(matchStart, matchSize);
            let transObj = mdAnnToObj[selected](
                  Translator.marksAnnotation[selected].exec(toTranslate));
            
            // hierarchical annotation building inside contexts
            switch (selected) {
               case "ctxopen":
                  currentSet.push(transObj);
                  currentSet = [];
                  transObj.annotations = currentSet;
                  /*
                  if (toTranslate.indexOf("#") > -1) {
                     newSource += toTranslate;
                     maintainContext = true;
                  }
                  */
                  break;
               case "ctxclose":
                  currentSet = knot.annotations;
                  /*
                  if (maintainContext)
                     newSource += toTranslate;
                  maintainContext = false;
                  */
                  break;
               case "annotation":
                  currentSet.push(transObj);
                  /*
                  if (toTranslate.indexOf("#") > -1)
                     newSource += toTranslate;
                  else
                     newSource += transObj.natural.complete;
                  */
                  break;
            }
            
            if (matchStart + matchSize >= mdfocus.length)
               matchStart = -1;
            else
               mdfocus = mdfocus.substring(matchStart + matchSize);
         }
      } while (matchStart > -1);
      /*
      if (mdfocus.length > 0)
         newSource += mdfocus;
      */
      
      // source without annotations to be compiled in the next step
      // knot._preparedSource = newSource;
   }
   
   /*
    * Compiles a single knot to an object representation
    */
   compileKnotMarkdown(knotSet, knotId) {
      let knot = knotSet[knotId];
      
      if (knot.categories)
         delete knot.categories;
      
      let mdfocus = knot._source;
      knot.content = [];
      let compiledKnot = knot.content;
      
      this._objSequence = 0;
      
      let matchStart;
      do {
         // look for the next nearest expression match
         matchStart = -1;
         let selected = "";
         for (let mk in Translator.marks) {
            if (!((mk == "annotation" || mk == "selector") &&
                  this.authoringRender)) {
               let pos = mdfocus.search(Translator.marks[mk]);
               if (pos > -1 && (matchStart == -1 || pos < matchStart)) {
                  selected = mk;
                  matchStart = pos;
               }
            }
         }

         if (matchStart > -1) {
            // add a segment that does not match to any expression as type="text"
            if (matchStart > 0) {
               const submark = mdfocus.substring(0, matchStart);
               compiledKnot.push(this._initializeObject(
                  this._textMdToObj(submark), submark));
            }
            
            // translate the expression to an object
            let matchSize = mdfocus.match(Translator.marks[selected])[0].length;
            let toTranslate = mdfocus.substr(matchStart, matchSize);
            let transObj = this._initializeObject( 
               this.mdToObj(selected,
                  Translator.marks[selected].exec(toTranslate)), toTranslate);
            
            // attach to a knot array (if it is a knot) or an array inside a knot
            if (selected == "knot") {
               knot._sourceHead = toTranslate;
               if (transObj.categories)
                  knot.categories = transObj.categories;
            } else
               compiledKnot.push(transObj);
            
            if (matchStart + matchSize >= mdfocus.length) {
               matchStart = -1;
               mdfocus = "";
            } else
               mdfocus = mdfocus.substring(matchStart + matchSize);
         }
      } while (matchStart > -1);
      if (mdfocus.length > 0)
         compiledKnot.push(
            this._initializeObject(this._textMdToObj(mdfocus), mdfocus));
      
      // giving context to links and variables
      for (let c in compiledKnot) {
         if (compiledKnot[c].type == "input")
            compiledKnot[c].variable = knotId + "." + compiledKnot[c].variable;
         else if (compiledKnot[c].type == "context-open")
            compiledKnot[c].context = knotId + "." + compiledKnot[c].context;
         else if (compiledKnot[c].type == "option" || compiledKnot[c].type == "divert") {
            let target = compiledKnot[c].target.replace(/ /g, "_");
            let prefix = knotId;
            let lastDot = prefix.lastIndexOf(".");
            while (lastDot > -1) {
               prefix = prefix.substring(0, lastDot);
               if (knotSet[prefix + "." + target])
                  target = prefix + "." + target;
               lastDot = prefix.lastIndexOf(".");
            }
            compiledKnot[c].contextTarget = target;
         }  
      }
      
      // delete knot._preparedSource;
   }

   mdToObj(mdType, match) {
      let obj;
      switch(mdType) {
         case "knot"   : obj = this._knotMdToObj(match); break;
         case "image"  : obj = this._imageMdToObj(match); break;
         case "option" : obj = this._optionMdToObj(match); break;
         case "field"  : obj = this._fieldMdToObj(match); break;
         case "divert" : obj = this._divertMdToObj(match); break;
         case "talk"     : obj = this._talkMdToObj(match); break;
         case "talkopen" : obj = this._talkopenMdToObj(match); break;
         case "talkclose": obj = this._talkcloseMdToObj(match); break;
         case "input"    : obj = this._inputMdToObj(match); break;
         case "compute"  : obj = this._computeMdToObj(match); break;
         // <TODO> provisory: annotation recognition is duplicated to support code generation
         case "annotation"  : obj = this._annotationMdToObj(match); break;
         case "selctxopen"  : obj = this._selctxopenMdToObj(match); break;
         case "selctxclose" : obj = this._selctxcloseMdToObj(match); break;
         case "selector"    : obj = this._selectorMdToObj(match); break;
      };
      return obj;
   }

   _extractCaseMetadata(compiledCase) {
      if (compiledCase.knots._Case_) {
         const content = compiledCase.knots._Case_.content;
         for (let c in content)
            if (content[c].type == "field")
               switch (content[c].field) {
                  case "theme": compiledCase.theme = content[c].value;
                                // this.currentThemeFamily = content[c].value;
                                break;
                  case "name" : compiledCase.name = content[c].value;
                                break;
               }
      }
   }

   /*
    * Produce a sequential stamp to uniquely identify each recognized object
    */
   _initializeObject(obj, submark) {
      obj._source = submark;
      obj._modified = false;
      this._objSequence++;
      obj.seq = this._objSequence;
      return obj;
   }

   /*
    *
    */
   async generateHTML(knot) {
      this.newThemeSet();
      let finalHTML = await this.generateHTMLBuffer(knot);
      this.deleteThemeSet();
      return finalHTML;
   }

   newThemeSet() {
      this._themeSet = {};
   }

   deleteThemeSet() {
      // <TODO> there is some synchronization problem - it is deleting before finishing
      // delete this._themeSet;
   }
   
   async generateHTMLBuffer(knot) {
      let themes = (knot.categories)
                   ? knot.categories : ["knot"];
      for (let tp in themes)
         if (!this._themeSet[themes[tp]]) {
            const templ = await
                    this.loadTheme(themes[tp]);
            if (templ != "")
               this._themeSet[themes[tp]] = templ;
            else {
               if (!this._themeSet["knot"])
                  this._themeSet["knot"] = await
                     this._loadTheme("knot");
               this._themeSet[themes[tp]] = this._themeSet["knot"];
            }
         }
      let finalHTML = await this.generateKnotHTML(knot);
      for (let tp = themes.length-1; tp >= 0; tp--)
         finalHTML = this._themeSet[themes[tp]].replace("{knot}", finalHTML);
      
      return finalHTML;
   }

   async loadTheme(themeName) {
      const themeObj = await MessageBus.ext.request(
            "data/theme/" + this.currentThemeFamily + "." + themeName + "/get");
      return themeObj.message;
   }


   /*
    * Generate HTML in a single knot
    */
   async generateKnotHTML(knotObj) {
      let preDoc = "";
      let html = "";
      if (knotObj != null && knotObj.content != null) {
         // produces a pretext with object slots to process markdown
         for (let kc in knotObj.content)
            preDoc += (knotObj.content[kc].type == "text" ||
                       knotObj.content[kc].type == "field" ||
                       knotObj.content[kc].type == "context-open" ||
                       knotObj.content[kc].type == "context-close" ||
                       (knotObj.content[kc].type == "selector" &&
                        this.authoringRender)) 
               ? this.objToHTML(knotObj.content[kc])
               : "@@" + knotObj.content[kc].seq + "@@";
               
         
         // converts to HTML
         html = this._markdownTranslator.makeHtml(preDoc);

         // inserts Markdown DCCs in authoring mode
         html = html.replace(/<p><dcc-markdown id='dcc(\d+)'( author)?><\/p>/igm,
                             "<dcc-markdown id='dcc$1'$2>")
                    .replace(/<p><\/dcc-markdown><\/p>/igm, "</dcc-markdown>");

         // replaces the marks
         let current = 0;
         let next = html.indexOf("@@");
         while (next != -1) {
            let end = html.indexOf("@@", next+1);
            let seq = parseInt(html.substring(next+2, end));
            while (knotObj.content[current].seq < seq)
               current++;
            if (knotObj.content[current].seq != seq)
               console.log("Error in finding seq.");
            else
               html = html.substring(0, next) +
                      this.objToHTML(knotObj.content[current]) +
                      html.substring(end+2);
            next = html.indexOf("@@");
         }
         
         html = html.replace(Translator.contextHTML.open, this._contextSelectorHTMLAdjust);
         html = html.replace(Translator.contextHTML.close, this._contextSelectorHTMLAdjust);
      }
      return html;
   }

   objToHTML(obj) {
      let html;
      switch(obj.type) {
         case "text"   : html = this._textObjToHTML(obj); break;
         case "image"  : html = this._imageObjToHTML(obj); break;
         case "option" : html = this._optionObjToHTML(obj); break;
         case "field"  : html = this._fieldObjToHTML(obj); break;
         case "divert" : html = this._divertObjToHTML(obj); break;
         case "talk"   : html = this._talkObjToHTML(obj); break;
         case "talk-open" : html = this._talkopenObjToHTML(obj); break;
         case "talk-close": html = this._talkcloseObjToHTML(obj); break;
         case "input"   : html = this._inputObjToHTML(obj); break;
         case "compute" : html = this._computeObjToHTML(obj); break;
         case "context-open"  : html = this._selctxopenObjToHTML(obj); break;
         case "context-close" : html = this._selctxcloseObjToHTML(obj); break;
         case "selector"   : html = this._selectorObjToHTML(obj); break;
         case "annotation" : html = this._annotationObjToHTML(obj); break;
         // score  : this.translateScore
      }
      return html;
   }
   
   generateCompiledJSON(compiledCase) {
      return "(function() { DCCPlayerServer.playerObj =" +
             JSON.stringify(compiledCase) + "})();"; 
   }
   
   /*
    * Put together all source fragments
    */
   assembleMarkdown(compiledCase) {
      let md = "";
      /*
      for (let kn in compiledCase.knots)
         md += compiledCase.knots[kn]._source;
      */
      for (let kn in compiledCase.knots) {
         if (compiledCase.knots[kn].toCompile)
            md += compiledCase.knots[kn]._source;
         else {
            md += compiledCase.knots[kn]._sourceHead;
            for (let ct in compiledCase.knots[kn].content)
               md += compiledCase.knots[kn].content[ct]._source;
         }
      }
      return md;
   }

   /*
    * Updates the markdown of an element according to its object representation
    */
   updateElementMarkdown(element) {
      // switch instead array to avoid binds
      switch (element.type) {
         case "knot": element._sourceHead = this._knotObjToMd(element);
                      element._sorce = element._sourceHead;
                      break;
         case "text": element._source = this._textObjToMd(element);
                      break;
         case "image": element._source = this._imageObjToMd(element);
                       break;
         case "option": element._source = this._optionObjToMd(element);
                        break;
      }
      element._source += "\n\n";
   }
   
   /*
    * Adjusts the HTML generated to avoid trapping the constext selector tag in a paragraph
    */
   _contextSelectorHTMLAdjust(matchStr, insideP) {
      return insideP;
   }
   
   /*
    * Knot Md to Obj
    * Input: ## [title] ([category],..,[category]) ##
    *        or
    *        [title] ([category],..,[category])
    *        =====
    * Output:
    * {
    *    type: "knot"
    *    title: <title of the knot> #2 or #4
    *    categories: [<set of categories>]  #3 or #5
    *    level: <level of the knot> #1 or #6
    *    content: [<sub-nodes>] - generated in further routines
    * }
    */
   _knotMdToObj(matchArray) {
      let knot = {
         type: "knot"
      };
      
      if (matchArray[2] != null)
         knot.title = matchArray[2].trim();
      else
         knot.title = matchArray[4].trim();
      
      if (matchArray[3] != null)
         knot.categories = matchArray[3].split(",");
      else if (matchArray[5] != null)
         knot.categories = matchArray[5].split(",");
      if (knot.categories)
         for (let c in knot.categories)
            knot.categories[c] = knot.categories[c].trim();
      
      // moves special categories to the beggining of the list
      if (knot.categories != null) {
         for (let sc in Translator.specialCategories) {
            let cat = knot.categories.indexOf(Translator.specialCategories[sc]);
            if (cat >= 0) {
               let category = knot.categories[cat];
               knot.categories.splice(cat, 1);
               knot.categories.unshift(category);
            }
         }
      }
      
      if (matchArray[1] != null)
         knot.level = matchArray[1].trim().length;
      else
         if (matchArray[6][0] == "=")
            knot.level = 1;
         else
            knot.level = 2;
         
      return knot;
   }
   
   /*
    * Text Md to Obj
    * Output:
    * {
    *    type: "text"
    *    content: <unprocessed content in markdown>
    * }
    */
   _textMdToObj(markdown) {
      return {
         type: "text",
         content: markdown
      };
   }

   /* Output:
    * {
    *    type: "knot"
    *    title: <title of the knot> #2 or #4
    *    categories: [<set of categories>]  #3 or #5
    *    level: <level of the knot> #1 or #6
    *    content: [<sub-nodes>] - generated in further routines
    * }
    */
   _knotObjToMd(obj) {
      return Translator.markdownTemplates.knot
                .replace("[level]", "#".repeat(obj.level))
                .replace("[title]", obj.title)
                .replace("[categories]",
                   (obj.categories)
                      ? " (" + obj.categories.join(",") + ")" : ""); 
   }
   
   /*
    * Text Obj to HTML
    * Output: [content]
    */
   _textObjToHTML(obj) {
      // return this._markdownTranslator.makeHtml(obj.content);
      let result = obj.content;
      if (this.authoringRender)
         result = Translator.htmlTemplatesEditable.text
                    .replace("[seq]", obj.seq)
                    .replace("[author]", this.authorAttr)
                    .replace("[content]", obj.content);
      return result;
   }

   _textObjToMd(obj) {
      return obj.content;
   }

   /*
   textUpdate(obj, update) {
      obj.content = update.content;
   }
   */

   /*
    * Image Md to Obj
    * Input: !\[alt-text\]([path] "[title]")
    * Output:
    * {
    *    type:  "image"
    *    alternative:   <alt text>
    *    path:  <image path>
    *    title: <image title>
    * }
    */
   _imageMdToObj(matchArray) {
      let image = {
         type: "image",
         alternative:  matchArray[1].trim(),
         path: matchArray[2].trim()
      };
      if (matchArray[3] != null)
         image.title = matchArray[3].trim();
      return image;
   }
   
   /*
    * Image Obj to HTML
    * Output: <img src="[path]" alt="[title]">
    */
   _imageObjToHTML(obj) {
      let result;
      if (this.authoringRender)
         result = Translator.htmlTemplatesEditable.image
            .replace("[seq]", obj.seq)
            .replace("[author]", this.authorAttr)
            .replace("[path]", obj.path)
            .replace("[alternative]", obj.alternative)
            .replace("[title]", (obj.title)
               ? " title='" + obj.title + "'" : "");
      else
         result = Translator.htmlTemplates.image
            .replace("[path]", Basic.service.imageResolver(obj.path))
            .replace("[alt]", (obj.title)
               ? " alt='" + obj.title + "'" : "");
      return result;
   }

   _imageObjToMd(obj) {
      return Translator.markdownTemplates.image
                .replace("{alternative}", obj.alternative)
                .replace("{path}", obj.path)
                .replace("{title}",
                   (obj.title) ? '"' + obj.title + '"' : "");
   }

   /*
   imageUpdate(obj, update) {
      obj.alternative = update.alternative;
      obj.path = update.path;
      if (update.title)
         obj.title = update.title;
   }
   */

   /*
    * Context Open Md to Obj
    * Input: {{ [context] #[evaluation]: [option-1], ..., [option-n]
    * Expression: \{\{([\w \t\+\-\*"=\:%\/]+)(?:#([\w \t\+\-\*"=\%\/]+):([\w \t\+\-\*"=\%\/,]+))?[\f\n\r]
    * Output: {
    *    type: "context"
    *    context: <identification of the context>
    *    evaluation: <characteristic being evaluated in the context - for selector>
    *    options: <set of options>
    *    annotations: [<set of annotations in this context>]
    * }
    */
   _contextOpenMdToObj(matchArray) {
      let context = {
         type: "context",
         context: matchArray[1].trim()
      };
      
      if (matchArray[2] != null) {
         context.evaluation = matchArray[2].trim();
         context.options = matchArray[3];
      }
     
      return context;
   }

   /*
    * Context Close Md to Obj
    * Input: }}
    * Expression: \}\}
    * Output: {}
    */
   _contextCloseMdToObj(matchArray) {
   }   
   
   /*
    * Annotation Md to Obj
    * Input outside: { [natural] ([formal]) #[context value] }
    * Expression outside: \{([\w \t\+\-\*"=\:%\/]+)\}(?:\(([\w \t\+\-\*"=\:%\/]+)\))?(?!\/)
    * Output: {
    *    type: "annotation"
    *    natural: {  #1
    *       complete: <complete text in natural language>
    *       expression: <expression in the text to be evaluated>
    *       specification: <specify the expression defining, for example, a measurable value, rate or origin>
    *       rate: <compose the rate of the specification>
    *    }
    *    formal: {   #2
    *       complete: <complete text written in formal way to be recognized against a dictionary>
    *       expression: <expression in the text to be evaluated>
    *       specification: <specify the expression defining, for example, a measurable value, rate or origin>
    *       rate: <compose the rate of the specification>
    *    }
    * }
    */
   _annotationMdToObj(matchArray) {
      let annotation = {
         type: "annotation",
         natural: this._annotationInsideMdToObj(
                     Translator.marksAnnotationInside.exec(matchArray[1].trim()))
      };
      
      if (matchArray[2] != null)
         annotation.formal = this._annotationInsideMdToObj(
            Translator.marksAnnotationInside.exec(matchArray[2].trim()));
      
      if (matchArray[3] != null)
         annotation.value = matchArray[3].trim();
     
      return annotation;
   }
   
   /*
    * Annotation Inside Md to Obj
    * Input inside: [expression] =|: [specification] / [rate]
    * Expression inside: ([\w \t\+\-\*"]+)(?:[=\:]([\w \t%]*)(?:\/([\w \t%]*))?)?
    * Output: {
    *    complete: <complete text> #0
    *    expression: <expression in the text to be evaluated> #1
    *    specification: <specify the expression defining, for example, a measurable value, rate or origin> #2
    *    rate: <compose the rate of the specification> #3
    * }
    */
   _annotationInsideMdToObj(matchArray) {
      let inside = {
         complete: matchArray[0]
      };
      
      if (matchArray[1] != null)
         inside.expression = matchArray[1].trim(); 
      if (matchArray[2] != null)
         inside.specification = matchArray[2].trim(); 
      if (matchArray[3] != null)
         inside.rate = matchArray[3].trim(); 
      
      return inside;
   }

   /*
    * Annotation Obj to HTML
    * Output: [natural]
    */
   _annotationObjToHTML(obj) {
      return obj.natural.complete;
   }   
   
   /*
    * Option Md to Obj
    * Input: + [label] ([rule]) -> [target] or * [label] ([rule]) -> [target]([parameter])
    * Output:
    * {
    *    type: "option"
    *    subtype: "+" or "*" #1
    *    label: <label to be displayed -- if there is not an explicit divert, the label is the divert> #2
    *    rule:  <rule of the trigger -- determine its position in the knot> #3
    *    target: <target node to divert> #4
    *    parameter: <parameter for the target knot> #5
    * }
    */
   _optionMdToObj(matchArray) {
      let option = {
         type: "option",
         subtype: matchArray[1].trim()
      };
      
      if (matchArray[2] != null)
         option.label = matchArray[2].trim();
      /*
      else {
         option.label = matchArray[4].trim();
         const lastDot = option.label.lastIndexOf(".");
         if (lastDot > -1)
            option.label = option.label.substr(lastDot + 1);
      }
      */
      if (matchArray[3] != null)
         option.rule = matchArray[3].trim();
      if (matchArray[4] != null)
         option.target = matchArray[4].trim();
      if (matchArray[5] != null)
         option.parameter = matchArray[5].trim();
      
      return option;
   }

   /*
    * Option Obj to HTML
    * Output:
    *   <dcc-trigger id='dcc[seq]'  type='[subtype]' link='[link].html' label='[display]' [image] [location]></dcc-trigger>
    */
   _optionObjToHTML(obj) {
      // const display = (obj.label != null) ? obj.label : obj.target;
      const location = (obj.rule != null) ? " location='" + obj.rule + "'" : "";
      
      const optionalImage = "";
      // <TODO> Temporary
      /*
      const optionalImage = (obj.rule == null) ?
         " image='images/" + display.toLowerCase().replace(/ /igm, "-") + ".svg'" : 
         "";
      */

      let label;
      if (obj.label)
         label = obj.label;
      else {
         label = obj.target;
         const lastDot = label.lastIndexOf(".");
         if (lastDot > -1)
            label = label.substr(lastDot + 1);
      }
     
      return Translator.htmlTemplates.option
         .replace("[seq]", obj.seq)
         .replace("[author]", this.authorAttr)
         .replace("[subtype]", obj.subtype)
         .replace("[link]", obj.contextTarget)
         .replace("[display]", label)
         .replace("[parameter]",
            (obj.parameter == null) ? "" : " parameter='" + obj.parameter + "'")
         .replace("[image]", optionalImage)
         .replace("[location]", location);
   }
   
   _optionObjToMd(obj) {
      return Translator.markdownTemplates.option
                .replace("{label}", obj.label + " ")
                .replace("{rule}", (obj.rule) ? "(" + obj.rule + ") " : "")
                .replace("{target}", obj.target);
   }
   
   /*
    * Field Md to Obj
    * Input: * [field]: [value]
    * Output:
    * {
    *    type: "field"
    *    presentation: <unprocessed content in markdown> #0
    *    field: <label of the field> #1
    *    value: <value of the field> #2
    * }
    */
   _fieldMdToObj(matchArray) {
      return {
         type: "field",
         presentation: matchArray[0],
         field: matchArray[1].trim(),
         value: matchArray[2].trim()
      };
   }

   /*
    * Field Obj to HTML
    * Output:
    *   [raw content in markdown]
    */
   _fieldObjToHTML(obj) {
      return obj.presentation;
   }

   /*
    * Divert Md to Obj
    * Input: -> [target]
    * Output:
    * {
    *    type: "divert"
    *    target: <target node to divert> #1
    * }
    */
   _divertMdToObj(matchArray) {
      const target = matchArray[1].trim();
      let label = target;
      const lastDot = label.lastIndexOf(".");
      if (lastDot > -1)
         label = label.substr(lastDot + 1);
      
      return {
         type: "divert",
         label: label,
         target: target
      };
   }

   /*
    * Divert Obj to HTML
    * Output:
    *   <dcc-trigger id='dcc[seq]' link='[link].html' label='[display]'></dcc-trigger>
    */
   _divertObjToHTML(obj) {
      return Translator.htmlTemplates.divert.replace("[seq]", obj.seq)
                                            .replace("[author]", this.authorAttr)
                                            .replace("[link]", obj.target)
                                            .replace("[display]", obj.label);
   }

   /*
    * Talk Md to Obj
    * Input: :[character]: [talk]
    * Output:
    * {
    *    type: "talk"
    *    character: <identification of the character> #1
    *    speech: <character's speech> #2
     * }
    */
   _talkMdToObj(matchArray) {
      return {
         type: "talk",
         character: matchArray[1].trim(),
         speech: matchArray[2].trim()
      };
   }   

   /*
    * Talk Obj to HTML
    * Output:
    * <dcc-talk id='dcc[seq]' character='[character]' speech='[speech]'>
    * </dcc-talk>
    */
   _talkObjToHTML(obj) {
      // let charImg = "images/" + obj.character.toLowerCase()
      //                              .replace(/ /igm, "_") + "-icon.png";
      return Translator.htmlTemplates.talk.replace("[seq]", obj.seq)
                                          .replace("[author]", this.authorAttr)
                                          .replace("[character]", obj.character)
                                          .replace("[speech]", obj.speech);
   }   
   
   /*
    * Talk Open Md to Obj
    * Input: :[character]:
    * Output:
    * {
    *    type: "talk-open"
    *    character: <identification of the character> #1
     * }
    */
   _talkopenMdToObj(matchArray) {
      let result = {
         type: "talk-open",
         character: matchArray[1].trim()
      };
      if (matchArray[2] != null) {
         result.image = {
            alternative:  matchArray[2].trim(),
            path: matchArray[3].trim()
         };
         if (matchArray[4] != null)
            result.image.title = matchArray[4].trim();
      }
      return result;
   }   

   /*
    * Talk Open Obj to HTML
    * Output:
    * <dcc-talk id='dcc[seq]' character='[character]'>
    */
   _talkopenObjToHTML(obj) {
      return Translator.htmlTemplates.talkopen
         .replace("[seq]", obj.seq)
         .replace("[author]", this.authorAttr)
         .replace("[character]", obj.character)
         .replace("[image]",
            (obj.image) ? " image='" + obj.image.path + "' alt='" : "")
         .replace("[alt]",
            (obj.image && obj.image.title)
               ? " alt='" + obj.title + "'" : "");
   }  
   
   /*
    * Talk Close Md to Obj
    * Input: ::
    * Output:
    * {
    *    type: "talk-close"
     * }
    */
   _talkcloseMdToObj(matchArray) {
      return {
         type: "talk-close"
      };
   }   

   /*
    * Talk Close Obj to HTML
    * Output:
    * </dcc-talk>
    */
   _talkcloseObjToHTML(obj) {
      return Translator.htmlTemplates.talkclose;
   }
   
   /*
    * Input Md to Obj
    * Input: {?[rows] [variable] : [vocabulary] # [write answer], ..., [write answer]; [wrong answer], ..., [wrong answer]}
    * Output:
    * {
    *    type: "input"
    *    variable: <variable that will receive the input> #2
    *    rows: <number of rows for the input> #1
    *    vocabulary: <the vocabulary to interpret the input> #3
    *    right: [<set of right answers>] #4
    *    wrong: [<set of wrong answers>] #5
    * }
    */
   _inputMdToObj(matchArray) {
      let input = {
             type: "input",
             variable: matchArray[2].trim().replace(/ /igm, "_")
      };
      
      if (matchArray[1] != null)
         input.rows = parseInt(matchArray[1]);
      
      if (matchArray[3] != null)
         input.vocabulary = matchArray[3].trim();
      
      if (matchArray[4] != null) {
         let right = matchArray[4].split(",");
         for (let r in right)
            right[r] = right[r].trim();
         input.right = right;
      }
      
      if (matchArray[5] != null) {
         let wrong = matchArray[5].split(",");
         for (let w in wrong)
            wrong[w] = wrong[w].trim();
         input.wrong = wrong;
      }
            
      return input;
   }
   
   /*
    * Input Obj to HTML
    * Output: <dcc-input id='dcc[seq]' variable='[variable]' rows='[rows]' [vocabulary]> 
    *         </dcc-input>
    */
   _inputObjToHTML(obj) {
      const rows = (obj.rows) ? " rows='" + obj.rows + "'" : "";
      const vocabulary = (obj.vocabulary) ? " vocabulary='" + obj.vocabulary + "'" : "";
      
      return Translator.htmlTemplates.input.replace("[seq]", obj.seq)
                                           .replace("[author]", this.authorAttr)
                                           .replace("[variable]", obj.variable)
                                           .replace("[rows]", rows)
                                           .replace("[vocabulary]", vocabulary);
   }

   /*
    * Expression Md to Obj
    * Input: ~ [variable] +|-|*|/|= [number]
    * Output:
    * {
    *    type: "compute"
    *    variable: <variable name>
    *    operator: +|-|*|/|=
    *    value: <value>
    * }
    */
   _computeMdToObj(matchArray) {
      let sentence = {
         type: "compute",
         operator: matchArray[2],
         value: matchArray[3].trim()
      };
      
      if (matchArray[1] != null)
         sentence.variable = matchArray[1].trim();
      
      return sentence;
   }
   
   /*
    * Expression Obj to HTML
    * Output:
    *   <dcc-compute sentence='[sentence]'></dcc-compute>
    */
   _computeObjToHTML(obj) {
      const variable = (obj.variable != null)
               ? obj.variable : Translator.defaultVariable;

      const sentence = variable + obj.operator + obj.value;

      return Translator.htmlTemplates.compute
                .replace("[sentence]", sentence);
   }

   /*
    * Selector Context Open Md to Obj
    * Input: {{ [context] #[evaluation]: [option-1], ..., [option-n]
    * Output:
    * {
    *    type: "context-open"
    *    context: <identification of the context> #1
    *    evaluation: <characteristic being evaluated in the context> #2
    *    options: <set of options> #3
    *    colors: <set of colors> #4
    * }
    */
   _selctxopenMdToObj(matchArray) {
      let context = {
         type: "context-open",
         context: matchArray[1].trim()
      };
      if (matchArray[2] != null)
         context.evaluation = matchArray[2].trim();
      if (matchArray[3] != null)
         context.options = matchArray[3];
      if (matchArray[4] != null)
         context.colors = matchArray[4].trim();
      
      // <TODO> weak strategy -- improve
      this._lastSelectorContext = context.context;
      this._lastSelectorEvaluation = context.evaluation;
      // console.log("1. last context: " + this._lastSelectorContext);

      return context;
   }
   
   /*
    * Selector Context Open Obj to HTML
    * Output: <dcc-group-selector id='dcc[seq]' context='[context]' evaluation='[evaluation]' states='[options]' colors='[colors]'>
    */
   _selctxopenObjToHTML(obj) {
      let evaluation = (obj.evaluation != null) ? " evaluation='" + obj.evaluation + "'" : "";
      let states = (obj.options != null) ? " states='" + obj.options + "'" : "";
      let colors = (obj.colors != null) ? " colors='" + obj.colors + "'" : "";
      
      return Translator.htmlTemplates.selctxopen.replace("[seq]", obj.seq)
                                                .replace("[author]", this.authorAttr)
                                                .replace("[context]", obj.context)
                                                .replace("[evaluation]", evaluation)
                                                .replace("[states]", states)
                                                .replace("[colors]", colors);
   }

   /*
    * Selector Context Close Md to Obj
    * Output:
    * {
    *    type: "context-close"
    * }
    */
   _selctxcloseMdToObj(matchArray) {
      return {
         type: "context-close"
      };
   }
   
   /*
    * Selector Context Close Obj to HTML
    * Output: </dcc-group-selector>
    */
   _selctxcloseObjToHTML(obj) {
      // console.log("3. last context: " + this._lastSelectorContext);
      // <TODO> weak strategy -- improve
      // delete this._lastSelectorContext;
      
      return Translator.htmlTemplates.selctxclose;
   }

   /*
    * Selector Md to Obj
    * Input: {[expression]}/[value]
    * Output:
    * {
    *    type: "selector"
    *    expression: <expression to be evaluated (natural)> #1
    *    value: <right value of the expression according to the evaluated context> #3
    * }
    */
   _selectorMdToObj(matchArray) {
      let selector = {
         type: "selector",
         expression: matchArray[1].trim()
      };
      if (matchArray[3] != null)
         selector.value = matchArray[3].trim();

      // <TODO> weak strategy -- improve
      if (this._lastSelectorContext) {
         if (this._lastSelectorContext == "answers")
            selector.present = "answer";
         else if (this._lastSelectorContext == "player")
            selector.present = this._lastSelectorEvaluation;
      }
      // console.log("2. last context: " + this._lastSelectorContext);
      return selector;
   }
   
   /*
    * Selector Obj to HTML
    * Output: <dcc-state-selector id='dcc[seq]'>[expression]</dcc-state-selector>
    */
   _selectorObjToHTML(obj) {
      let answer="";
      if (obj.present) {
         if (obj.present == "answer")
            answer = " answer='" + obj.value + "'";
         else
            answer = " player='" + obj.present + "'";
      }

      let result = obj.expression;
      if (!this.authoringRender)
         result = Translator.htmlTemplates.selector
                     .replace("[seq]", obj.seq)
                     .replace("[author]", this.authorAttr)
                     .replace("[expression]", obj.expression)
                     .replace("[answer]", answer);

      return result;
   }
}

(function() {
   Translator.marksKnotTitle = /((?:^[ \t]*(?:#+)[ \t]*(?:[^\( \t\n\r\f][^\(\n\r\f]*)(?:\((?:\w[\w \t,]*)\))?[ \t]*#*[ \t]*$)|(?:^[ \t]*(?:[^\( \t\n\r\f][^\(\n\r\f]*)(?:\((?:\w[\w \t,]*)\))?[ \t]*[\f\n\r][\n\r]?(?:==+|--+)$))/igm;
   // /((?:^[ \t]*(?:#+)[ \t]*(?:\w[\w \t]*)(?:\((?:\w[\w \t,]*)\))?[ \t]*#*[ \t]*$)|(?:^[ \t]*(?:\w[\w \t]*)(?:\((?:\w[\w \t,]*)\))?[ \t]*[\f\n\r][\n\r]?(?:==+|--+)$))/igm;

   Translator.marksAnnotation = {
     // knot   : /^[ \t]*==*[ \t]*(\w[\w \t]*)(?:\(([\w \t]*)\))?[ \t]*=*[ \t]*[\f\n\r]/im,
     ctxopen : /\{\{([\w \t\+\-\*\."=\:%\/]+)(?:#([\w \t\+\-\*\."=\%\/]+):([\w \t\+\-\*"=\%\/,]+)(?:;([\w \t#,]+))?)?[\f\n\r]/im,
     ctxclose: /\}\}/im,
     annotation: /\{([^\(\}#]+)(?:\(([^\)]+)\)[ \t]*)?(?:#([^\}]+))?\}/im
   };
   
   Translator.marksAnnotationInside = /([\w \t\+\-\*"]+)(?:[=\:]([\w \t%]*)(?:\/([\w \t%]*))?)?/im;

   Translator.marks = {
      knot   : /(?:^[ \t]*(#+)[ \t]*([^\( \t\n\r\f][^\(\n\r\f]*)(?:\((\w[\w \t,]*)\))?[ \t]*#*[ \t]*$)|(?:^[ \t]*([^\( \t\n\r\f][^\(\n\r\f]*)(?:\((\w[\w \t,]*)\))?[ \t]*[\f\n\r][\n\r]?(==+|--+)$)/im,
      image  : /!\[([\w \t]*)\]\(([\w:.\/\?&#\-]+)[ \t]*(?:"([\w ]*)")?\)/im,
      // image  : /<img src="([\w:.\/\?&#\-]+)" (?:alt="([\w ]+)")?>/im,
      option : /^[ \t]*([\+\*])[ \t]*([^\(&> \t][^\(&>\n\r\f]*)?(?:\(([\w \t-]+)\)[ \t]*)?(?:-(?:(?:&gt;)|>)[ \t]*([^\(\n\r\f]+)(?:\(([^\)\n\r\f]+)\))?)$/im,
      field  : /^[ \t]*(?:[\+\*])[ \t]*([\w.\/\?&#\-][\w.\/\?&#\- \t]*):[ \t]*([^\n\r\f]+)$/im,
      divert : /-(?:(?:&gt;)|>) *(\w[\w. ]*)/im,
      talk   : /^[ \t]*:[ \t]*(\w[\w \t]*):[ \t]*([^\n\r\f]+)$/im,
      talkopen: /^[ \t]*:[ \t]*(\w[\w \t]*):[ \t]*(?:[\f\n\r][\n\r]?!\[([\w \t]*)\]\(([\w:.\/\?&#\-]+)[ \t]*(?:"([\w ]*)")?\))?[ \t]*$/im,
      talkclose: /[ \t]*:[ \t]*:[ \t]*$/im,
      input  : /\{[ \t]*\?(\d+)?([\w \t]*)(?:\:([\w \t]+))?(?:#([\w \t\+\-\*"=\%\/,]+)(?:;([\w \t\+\-\*"=\%\/,]+))?)?\}/im,
      compute: /~[ \t]*(\w+)?[ \t]*([+\-*/=])[ \t]*(\d+(?:\.\d+)?)/im,
      annotation : /\{([\w \t\+\-\*"=\:%\/]+)(?:\(([\w \t\+\-\*"=\:%\/]+)\)[ \t]*)?\}/im,
      selctxopen : Translator.marksAnnotation.ctxopen,
      selctxclose: Translator.marksAnnotation.ctxclose,
      selector   : Translator.marksAnnotation.annotation
      // annotation : 
      // score  : /^(?:<p>)?[ \t]*~[ \t]*([\+\-=\*\\%]?)[ \t]*(\w*)?[ \t]*(\w+)[ \t]*(?:<\/p>)?/im
   };
   
   // Translator.specialCategories = ["start", "note"];
   
   Translator.contextHTML = {
      open:  /<p>(<dcc-group-selector(?:[\w \t\+\-\*"'=\%\/,]*)?>)<\/p>/igm,
      close: /<p>(<\/dcc-group-selector>)<\/p>/igm
   };

   Translator.defaultVariable = "points";

   Translator.instance = new Translator();
})();