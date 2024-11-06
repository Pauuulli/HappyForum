import type {
  EventHandler,
  EventHandlerRequest,
  EventHandlerResponse,
  H3Event,
} from "h3";
import { checkIsAuthed } from "../auth";

export const authEventHandler = <
  T extends EventHandlerRequest = EventHandlerRequest,
  D extends EventHandlerResponse = EventHandlerResponse,
>(
  // handler: EventHandler<T, D>,
  handler: (evt: H3Event<T>, userId: string) => D,
): EventHandler<T, D> =>
  eventHandler<T>(async (evt) => {
    const result = await checkIsAuthed(evt);
    if(!result.isAuthed) throw createError({statusCode: 401});
    // do something before the route handler
    const response = await handler(evt, result.userId);
    // do something after the route handler
    return response;
  });
