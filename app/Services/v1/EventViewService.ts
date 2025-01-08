import Database from '@ioc:Adonis/Lucid/Database';
import EventView from 'App/Models/Access/EventViews';

export default class EventViewService {
  public async create(record: Record<string, any>): Promise<EventView> {
    let view: EventView = new EventView().fill(record);

    await Database.transaction(async (trx) => {
      view.useTransaction(trx);

      await view.save();
    });

    return view;
  }

  public async searchBySession(session: string): Promise<EventView | null> {
    return EventView.query().where('session', session).first();
  }
}
