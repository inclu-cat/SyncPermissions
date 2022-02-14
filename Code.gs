//
// SyncPermissions
// A tiny tool to synchronize permissions
//

const gmailColNumber = 1;
const resourceFirstColNumber = 2;
const resourceIdRowNumber = 4;
const dataFirstRowNumber = 6;
const logRangeCell = 'D1';

let data;
let rowCount;
let colCount;
let logRange;

/**
 * On click Run button
 */
function onClickRun() {
  let ui = SpreadsheetApp.getUi();
  let response = ui.alert('Do you want to execute?', ui.ButtonSet.OK_CANCEL);

  if (response === ui.Button.OK) {
    syncPermissions()
  }
}
/**
 * Sync permissions
 */
function syncPermissions() {
  // detect how many cells to process
  loadData();
  if ( rowCount <= 0 || colCount <= 0 ){
    return;
  }
  // execute via LongRun
  executeLongRun("syncPermissionsMain", rowCount * colCount, null, "syncPermissionsInit", "syncPermissionsFinalizer");
}
/**
 * Loads data
 */
function loadData() {
  logRange = SpreadsheetApp.getActiveSheet().getRange(logRangeCell); // should be first
  log('Loading the data...');

  let sheet = SpreadsheetApp.getActiveSheet();
  data = sheet.getDataRange().getValues();
  rowCount = data.length - dataFirstRowNumber + 1;
  if ( rowCount <= 0 ) {
    console.log('no data to process');
    return;
  }
  colCount = data[0].length - resourceFirstColNumber + 1;
  if ( colCount <= 0 ){
    console.log('no data to process');
    return;
  }
}

/**
 * Initializer
 */
function syncPermissionsInit() {
  // LongRun.instance.setMaxExecutionSeconds(10); // for test

  loadData();
}

/**
 * A function executed for each cell.
 */
function syncPermissionsMain(index) {
  if ( rowCount <= 0 || colCount <= 0 ){
    return;
  }

  let rowIndex = Math.trunc(index / colCount);
  let colIndex = index % colCount;

  // get data for setting a permission.
  let resourceId = data[resourceIdRowNumber - 1][colIndex + resourceFirstColNumber - 1];
  let targetRow = data[rowIndex + dataFirstRowNumber - 1];
  let gmail = targetRow[gmailColNumber - 1];
  let permissionLetter = targetRow[colIndex + resourceFirstColNumber - 1];

  log('Processing ' + (rowIndex+1) + '/' + rowCount + ':' + gmail + ' ' + Math.trunc((colIndex+1)/colCount*100) + '% ...');

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
      Drive.Permissions.update(
        {
          'role': role,
        },
        resourceId,
        permissionId
      );
    }
    else {
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
  }
  // delete permission
  else {
    if ( currentPermission != null ){
      Drive.Permissions.remove(resourceId, permissionId);
    }
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
  logRange.setValue(message); // For now, only the most recent line will be displayed.
  SpreadsheetApp.flush();
}
