// scripts/services/shared/actor-service.js
export class ActorService {
  static getActingActor() {
    return canvas.tokens?.controlled?.[0]?.actor ?? game.user.character ?? null;
  }
}
