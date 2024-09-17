export class GoalAlreadyCompleted extends Error {
  constructor() {
    super("Goal Already Completed this Week!");
  }
}
