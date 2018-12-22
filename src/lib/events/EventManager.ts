import { EventList, IEvent, IEventHandler } from "ste-events";
import { IArgs, IBaseJson } from "../interfaces";

export default class EventManager<TCaller> {
  private instance: TCaller;
  private eventList: EventList<TCaller, IArgs>;

  constructor(instance: TCaller) {
    this.instance = instance;
    this.eventList = new EventList<TCaller, IArgs>();
  }

  public getEvent = (name: string): IEvent<TCaller, IArgs> => {
    return this.eventList.get(name).asEvent();
  }

  public dispatchEvent = async (name: string, args?: IArgs): Promise<void> => {
    if (args === undefined) {
      args = {args: [], kwargs: {}};
    }
    console.debug("dispatchEvent", name, args);
    this.eventList.get(name).dispatchAsync(this.instance, args);
  };

  public on<TEventType extends (c: TCaller, a: IBaseJson)=>void>(handler: TEventType) {
    return this.eventList.get(handler.name).subscribe(handler);
  }

  public subscribe = (name: string, handler: IEventHandler<TCaller, IArgs>) => {
    return this.eventList.get(name).subscribe(handler);
  };
}
