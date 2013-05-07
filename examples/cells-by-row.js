/**
 * CellsByRow example
 */

( function( window ) {

'use strict';

var Outlayer = window.Outlayer;

var CellsByRow = window.CellsByRow = Outlayer.create('cellsByRow');

var defaultOptions = Outlayer.prototype.options;

defaultOptions.columnWidth = 100;
defaultOptions.rowHeight = 100;

CellsByRow.prototype._resetLayout = function() {
  this.getSize();

  this._getMeasurement( 'columnWidth', 'width' );
  this._getMeasurement( 'rowHeight', 'height' );

  this.cols = Math.floor( this.size.innerWidth / this.columnWidth );
  this.cols = Math.max( this.cols, 1 );

  this.itemIndex = 0;
};

CellsByRow.prototype.layoutItems = function( items, isInstant ) {
  if ( !items || !items.length ) {
    return;
  }

  // emit layoutComplete when done
  this._itemsOn( items, 'layout', function onItemsLayout() {
    this.emitEvent( 'layoutComplete', [ this, items ] );
  });

  // getItemSizes( items );
  this._layoutQueue = [];

  for ( var i=0, len = items.length; i < len; i++ ) {
    var item = items[i];
    item.getSize();
    var column = this.itemIndex % this.cols;
    var row = Math.floor( this.itemIndex / this.cols );
    var x = column * this.columnWidth;
    var y = row * this.rowHeight;
    this._queueItemLayout( item, x, y, isInstant );
    this.itemIndex++;
  }

  this._processLayoutQueue();

  // set container size
  var elemH = Math.ceil( this.itemIndex / this.cols ) * this.rowHeight;
  // add padding and border width if border box
  var elemSize = this.size;
  if ( elemSize.isBorderBox ) {
    elemH += elemSize.paddingBottom + elemSize.paddingTop +
      elemSize.borderTopWidth + elemSize.borderBottomWidth;
  }
  this.element.style.height = elemH + 'px';

};

CellsByRow.prototype._queueItemLayout = function( item, x, y, isInstant ) {
  this._layoutQueue.push({
    item: item,
    x: x,
    y: y,
    isInstant: isInstant
  });
};

CellsByRow.prototype._processLayoutQueue = function() {
  for ( var i=0, len = this._layoutQueue.length; i < len; i++ ) {
    var obj = this._layoutQueue[i];
    this._layoutItem( obj.item, obj.x, obj.y, obj.isInstant );
  }
};

// function getItemSizes( items ) {
//   for ( var i=0, len = items.length; i < len; i++ ) {
//     items[i].getSize();
//   }
// }

})( window );
