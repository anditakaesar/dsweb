"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = FormatEntry;

function FormatEntry(ent) {
  var newEntry = {};
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
  newEntry.guarantorName = ent.guarantorName;
  newEntry.otherInfo = ent.otherInfo;
  newEntry.numPrefix = ent.numPrefix;
  newEntry.numMiddle = ent.numMiddle;
  newEntry.numPostfix = ent.numPostfix;
  newEntry.numYear = ent.numYear;
  newEntry.numCombined = ent.numCombined == undefined || ent.numCombined == "" ? ent.numPrefix + ent.numMiddle + ent.numPostfix + ent.numYear : ent.numCombined;
  newEntry.userId = ent.userId;
  newEntry.empty = '';
  return newEntry;
}
//# sourceMappingURL=entry.js.map