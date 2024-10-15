export class GoalAlreadyCompletedPerDay extends Error {
  constructor() {
    super("Goal Already Completed this Day!");
  }
}
