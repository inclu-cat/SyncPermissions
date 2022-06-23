//
// SyncPermissions
// A tiny tool to synchronize permissions
//

// constant
const gmailColNumber = 1;
const resourceFirstColNumber = 2;
const resourceNameRowNumber = 3;
const resourceIdRowNumber = 4;
const dataFirstRowNumber = 6;
const logRangeCell = 'D1';

// these data are set by loadData()
let selectionStartRowIndex;
let selectionStartColIndex;
let data;
let rowCount;
let colCount;
let logRange;

/**
 * On click Run button
 */
function onClickRun() {
  let ui = SpreadsheetApp.getUi();
  var html = HtmlService.createHtmlOutputFromFile('dialog')
    .setWidth(300)
    .setHeight(120);
  ui.showModalDialog(html, "Confirm");
}
/**
 * Sync permissions
 */
function syncPermissions(useSelection) {

  let sheet = SpreadsheetApp.getActiveSheet();
  let dataRange = sheet.getDataRange();

  let params = [];
  if ( useSelection ){

    let selection = sheet.getSelection();
    if ( selection == null ){
      return;
    }
    let selectionRange = selection.getActiveRange();
    params.push((selectionRange.getRow() - 1).toString()); // selectionStartRowIndex
    params.push((selectionRange.getColumn() - 1).toString()); // selectionStartColIndex
    params.push((selectionRange.getLastRow() - 1).toString()); // selectionEndRowIndex
    params.push((selectionRange.getLastColumn() - 1).toString()); // selectionEndColIndex
  }
  else{
    params.push("0"); // selectionStartRowIndex
    params.push("0"); // selectionStartColIndex
    params.push((dataRange.getLastRow()-1).toString());     // selectionEndRowIndex
    params.push((dataRange.getLastColumn()-1).toString());  // selectionEndColIndex
  }

  // detect how many cells to process
  loadData(params);
  if ( rowCount <= 0 || colCount <= 0 ){
    return;
  }
  // execute via LongRun
  executeLongRun("syncPermissionsMain", rowCount * colCount, params, "syncPermissionsInit", "syncPermissionsFinalizer");
}
/**
 * Loads data
 */
function loadData(params) {

  log('Loading the data...');

  // read params
  selectionStartRowIndex = parseInt(params[0], 10);
  selectionStartColIndex = parseInt(params[1], 10);
  let selectionEndRowIndex = parseInt(params[2], 10); // not need to be global
  let selectionEndColIndex = parseInt(params[3], 10); // not need to be global

  // load data range
  let sheet = SpreadsheetApp.getActiveSheet(); // this works even starting by trigger
  data = sheet.getDataRange().getValues();
  if ( data.length == 0 ){
    rowCount = 0;
    colCount = 0;
    log('no data to process');
    return;
  }

  // fix selection
  selectionStartRowIndex = Math.max(selectionStartRowIndex, dataFirstRowNumber - 1);
  selectionStartColIndex = Math.max(selectionStartColIndex, resourceFirstColNumber - 1);
  selectionEndRowIndex = Math.min(selectionEndRowIndex, data.length - 1);
  selectionEndColIndex = Math.min(selectionEndColIndex, data[0].length - 1);

  // set rowCount, colCount
  rowCount = selectionEndRowIndex - selectionStartRowIndex + 1;
  if ( rowCount <= 0 ) {
    console.log('no data to process');
    return;
  }
  colCount = selectionEndColIndex - selectionStartColIndex + 1;
  if ( colCount <= 0 ){
    console.log('no data to process');
    return;
  }
}

/**
 * Initializer
 */
function syncPermissionsInit(startIndex, params) {
  // LongRun.instance.setMaxExecutionSeconds(10); // for test

  loadData(params);
}

/**
 * A function executed for each cell.
 */
function syncPermissionsMain(index) {
  try {
    if ( rowCount <= 0 || colCount <= 0 ){
      return;
    }

    let rowIndex = Math.trunc(index / colCount);
    let colIndex = index % colCount;
    let actualRowIndex = selectionStartRowIndex + rowIndex;
    let actualColIndex = selectionStartColIndex + colIndex;

    // get data for setting a permission.
    let resourceName = data[resourceNameRowNumber - 1][actualColIndex];
    let resourceId = data[resourceIdRowNumber - 1][actualColIndex];
    let targetRow = data[actualRowIndex];
    let gmail = targetRow[gmailColNumber - 1];
    let permissionLetter = targetRow[actualColIndex];

    log('Processing ' + (rowIndex+1) + '/' + rowCount + ': [' + gmail + '][' + resourceName + '][' + permissionLetter + '] ...');

    let role;
    if ( permissionLetter === 'R' ){
      role = 'reader';
    }
    else if ( permissionLetter === 'W' ){
      role = 'writer';
    }

    let permissionId = Drive.Permissions.getIdForEmail(gmail).id;
    let currentPermission;
    try{
      currentPermission = Drive.Permissions.get(resourceId, permissionId);
    }
    catch {}

    // set permission
    if ( role != null ){
      if ( currentPermission != null ){
        Drive.Permissions.remove(resourceId, permissionId);
      }
      
      Drive.Permissions.insert(
        {
          'role': role,
          'type': 'user',
          'value': gmail
        },
        resourceId,
        {
          'sendNotificationEmails': false,
          'supportsAllDrives': true,
        });
    }
    // delete permission
    else {
      if ( currentPermission != null ){
        Drive.Permissions.remove(resourceId, permissionId);
      }
    }
  }
  catch (e){
    log('Error: ' + e.message);
  }
}
/**
 * Finalizer
 */
function syncPermissionsFinalizer(isFinished) {
  if ( isFinished ){
    log('Done');
  }
  else {
    log('Pausing for long processing time...');
  }
}

/**
 * Outputs a message to a cell for logging.
 */
function log( message ) {
  console.log(message);

  try{
    if ( logRange == null ){
      logRange = SpreadsheetApp.getActiveSheet().getRange(logRangeCell);
    }
    if( logRange != null ){
      logRange.setValue(message); // For now, only the most recent line will be displayed.
      SpreadsheetApp.flush();
    }
  }
  catch(e){
    console.log(e.message);
  }
}




