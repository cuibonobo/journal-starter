import { EventList, IEvent, IEventHandler } from "ste-events";
import { IArgs } from "./interfaces";

export default class EventManager<T> {
  private instance: T;
  private eventList = new EventList<T, IArgs>();

  constructor(instance: T) {
    this.instance = instance;
  }

  public getEvent = (name: string): IEvent<T, IArgs> => {
    return this.eventList.get(name).asEvent();
  }

  public dispatchEvent = async (name: string, args?: IArgs): Promise<void> => {
    if (args === undefined) {
      args = {args: [], kwargs: {}};
    }
    console.debug("dispatchEvent", name, args);
    this.eventList.get(name).dispatchAsync(this.instance, args);
  };

  public subscribe = (name: string, handler: IEventHandler<T, IArgs>) => {
    return this.eventList.get(name).subscribe(handler);
  };
}
