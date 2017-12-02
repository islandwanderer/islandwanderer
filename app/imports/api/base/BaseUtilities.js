import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Events } from '/imports/api/event/EventCollection';
import { Tags } from '/imports/api/tag/TagCollection';

export function removeAllEntities() {
  Profiles.removeAll();
  Events.removeAll();
  Tags.removeAll();
}
