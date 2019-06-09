/**
 * Base for all visual components
 */

class DCCVisual extends DCCBase {
   get presentation() {
      return (this._presentation) ? this._presentation : null;
   }
}