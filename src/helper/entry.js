export default function FormatEntry(ent) {
  let newEntry = {}
  if (ent != undefined && ent != null) {
    newEntry.id = ent.id
    newEntry.grantorName = ent.grantorName
    newEntry.grantorPosition = ent.grantorPosition
    newEntry.granteeName = ent.granteeName
    newEntry.granteePosition = ent.granteePosition
    newEntry.travelDeparture = ent.travelDeparture
    newEntry.travelDestination = ent.travelDestination
    newEntry.travelVehicle = ent.travelVehicle
    newEntry.travelType = ent.travelType
    newEntry.travelReason = ent.travelReason
    newEntry.travelArrival = ent.travelArrival
    newEntry.travelArrivalDate = ent.travelArrivalDate
    newEntry.travelDate = ent.travelDate
    newEntry.travelDateBack = ent.travelDateBack
    newEntry.travelLength = ent.travelLength
    newEntry.travelLengthType = ent.travelLengthType
    newEntry.guarantorName = ent.guarantorName
    newEntry.otherInfo = ent.otherInfo
    newEntry.numPrefix = ent.numPrefix
    newEntry.numMiddle = ent.numMiddle
    newEntry.numPostfix = ent.numPostfix
    newEntry.numYear = ent.numYear
    newEntry.numCombined = ent.numPrefix + ent.numMiddle + ent.numPostfix + ent.numYear
    newEntry.userId = ent.userId
    newEntry.empty = ''
  }

  return newEntry
}

export function FormatPDFName(ent) {
  if (ent != undefined && ent != null) {
    return `${ent.numPrefix}${ent.numPostfix}${ent.numYear}.pdf`
  }
  return ''
}

export function FormatPosition(pos) {
  let newPos = {}
  newPos.id = pos ? pos.id : ''
  newPos.positionCode = pos ? pos.positionCode : ''
  newPos.positionName = pos ? pos.positionName : ''

  return newPos
}

export function FormatTravelType(trav) {
  let newType = {}
  newType.id = trav ? trav.id : ''
  newType.travelName = trav ? trav.travelName : ''

  return newType
}