"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = FormatEntry;
exports.FormatPDFName = FormatPDFName;
exports.FormatPosition = FormatPosition;
exports.FormatTravelType = FormatTravelType;

function FormatEntry(ent) {
  var newEntry = {};

  if (ent != undefined && ent != null) {
    newEntry.id = ent.id;
    newEntry.grantorName = ent.grantorName;
    newEntry.granteeName = ent.granteeName;
    newEntry.granteePosition = ent.granteePosition;
    newEntry.travelDeparture = ent.travelDeparture;
    newEntry.travelDestination = ent.travelDestination;
    newEntry.travelType = ent.travelType;
    newEntry.travelReason = ent.travelReason;
    newEntry.travelArrival = ent.travelArrival;
    newEntry.travelArrivalDate = ent.travelArrivalDate;
    newEntry.travelDate = ent.travelDate;
    newEntry.travelLength = ent.travelLength;
    newEntry.travelLengthType = ent.travelLengthType;
    newEntry.guarantorName = ent.guarantorName;
    newEntry.otherInfo = ent.otherInfo;
    newEntry.numPrefix = ent.numPrefix;
    newEntry.numMiddle = ent.numMiddle;
    newEntry.numPostfix = ent.numPostfix;
    newEntry.numYear = ent.numYear;
    newEntry.numCombined = ent.numCombined == undefined || ent.numCombined == "" ? ent.numPrefix + ent.numMiddle + ent.numPostfix + ent.numYear : ent.numCombined;
    newEntry.userId = ent.userId;
    newEntry.empty = '';
  }

  return newEntry;
}

function FormatPDFName(ent) {
  if (ent != undefined && ent != null) {
    return "".concat(ent.numPrefix).concat(ent.numPostfix).concat(ent.numYear, ".pdf");
  }

  return '';
}

function FormatPosition(pos) {
  var newPos = {};
  newPos.id = pos ? pos.id : '';
  newPos.positionCode = pos ? pos.positionCode : '';
  newPos.positionName = pos ? pos.positionName : '';
  return newPos;
}

function FormatTravelType(trav) {
  var newType = {};
  newType.id = trav ? trav.id : '';
  newType.travelName = trav ? trav.travelName : '';
  return newType;
}
//# sourceMappingURL=entry.js.map