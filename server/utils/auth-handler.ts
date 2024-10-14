import type { EventHandler, EventHandlerRequest } from "h3";
import { checkIsAuthed } from "../auth";

export const authEventHandler = <T extends EventHandlerRequest, D>(
  handler: EventHandler<T, D>,
): EventHandler<T, D> =>
  eventHandler<T>(async (evt) => {
    await checkIsAuthed(evt);
    // do something before the route handler
    const response = await handler(evt);
    // do something after the route handler
    return response;
  });
