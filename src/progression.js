export function shouldOfferBonusRound(bestCrossed, bonusRoundUsed) {
  return bestCrossed && !bonusRoundUsed;
}
