import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import Model from '@ckeditor/ckeditor5-ui/src/model';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';

import tableColumnIcon from '@ckeditor/ckeditor5-table/theme/icons/table-column.svg';
import tableRowIcon from '@ckeditor/ckeditor5-table/theme/icons/table-row.svg';

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class HarenaTablePlugin extends Plugin {
  init() {
    const editor = this.editor;
    const t = this.editor.t;
    const dropdownTooltip = t('Column');
    const contentLanguageDirection = editor.locale.contentLanguageDirection;
    const isContentLtr = contentLanguageDirection === 'ltr';

    editor.ui.componentFactory.add( 'tableColumnHarena', locale => {
      const options = [
        {
          type: 'button',
          model: {
            commandName: isContentLtr ? 'insertTableColumnRight' : 'insertTableColumnLeft',
            label: t( 'Insert column right' )
          }
        },
        {
          type: 'button',
          model: {
            commandName: 'removeTableColumn',
            label: t( 'Delete column' )
          }
        },
        {
          type: 'button',
          model: {
            commandName: 'selectTableColumn',
            label: t( 'Select column' )
          }
        }
      ];

      return this._prepareDropdown( t( 'Column' ), tableColumnIcon, options, locale );
    } );


    editor.ui.componentFactory.add( 'tableRowHarena', locale => {
      const options = [
        {
          type: 'button',
          model: {
            commandName: 'insertTableRowBelow',
            label: t( 'Insert row below' )
          }
        },
        {
          type: 'button',
          model: {
            commandName: 'removeTableRow',
            label: t( 'Delete row' )
          }
        },
        {
          type: 'button',
          model: {
            commandName: 'selectTableRow',
            label: t( 'Select row' )
          }
        }
      ];

      return this._prepareDropdown( t( 'Row' ), tableRowIcon, options, locale );
    } );
  }

  _prepareDropdown( label, icon, options, locale ) {
    const editor = this.editor;
    const dropdownView = createDropdown( locale );
    const commands = this._fillDropdownWithListOptions( dropdownView, options );

    // Decorate dropdown's button.
    dropdownView.buttonView.set( {
      label,
      icon,
      tooltip: true
    } );

    // Make dropdown button disabled when all options are disabled.
    dropdownView.bind( 'isEnabled' ).toMany( commands, 'isEnabled', ( ...areEnabled ) => {
      return areEnabled.some( isEnabled => isEnabled );
    } );

    this.listenTo( dropdownView, 'execute', evt => {
      editor.execute( evt.source.commandName );
      editor.editing.view.focus();
    } );

    return dropdownView;
  }

  _fillDropdownWithListOptions( dropdownView, options ) {
    const editor = this.editor;
    const commands = [];
    const itemDefinitions = new Collection();

    for ( const option of options ) {
      addListOption( option, editor, commands, itemDefinitions );
    }

    addListToDropdown( dropdownView, itemDefinitions, editor.ui.componentFactory );

    return commands;
  }
}

function addListOption( option, editor, commands, itemDefinitions ) {
  const model = option.model = new Model( option.model );
  const { commandName, bindIsOn } = option.model;

  if ( option.type === 'button' || option.type === 'switchbutton' ) {
    const command = editor.commands.get( commandName );

    commands.push( command );

    model.set( { commandName } );

    model.bind( 'isEnabled' ).to( command );

    if ( bindIsOn ) {
      model.bind( 'isOn' ).to( command, 'value' );
    }
  }

  model.set( {
    withText: true
  } );

  itemDefinitions.add( option );
}
