import { Tags } from '/imports/api/tag/TagCollection';
import { Events } from '/imports/api/event/EventCollection';
import { Profiles } from '/imports/api/profile/ProfileCollection';

Tags.publish();
Events.publish();
Profiles.publish();
