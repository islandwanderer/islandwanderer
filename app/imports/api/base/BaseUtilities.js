import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Tags } from '/imports/api/tag/TagCollection';

export function removeAllEntities() {
  Profiles.removeAll();
  Tags.removeAll();
}
