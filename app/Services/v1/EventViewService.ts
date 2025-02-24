import EventView from 'App/Models/Access/EventViews';

export default class EventViewService {
  public async searchBySession(session: string): Promise<EventView | null> {
    return EventView.query().where('session', session).first();
  }
}
