export const cancellationPolicy = {
  freeCancellationBeforeMinutes: 120,
  partialRefundBeforeMinutes: 30,
  noCancellationWithinMinutes: 30,
  partialRefundPercentage: 75,
  convenienceFeeRefundable: false,
} as const;

export const cancellationReasonLabels = {
  plansChanged: 'Plans changed',
  anotherParking: 'Found another parking option',
  bookedByMistake: 'Booked by mistake',
  vehicleIssue: 'Vehicle issue',
  locationIssue: 'Parking location issue',
  other: 'Other',
} as const;
