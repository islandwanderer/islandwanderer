import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Events } from '/imports/api/event/EventCollection';

export function removeAllEntities() {
  Profiles.removeAll();
  Events.removeAll();
}
