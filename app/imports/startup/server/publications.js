import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Messages } from '/imports/api/message/MessageCollection';
import { Events } from '/imports/api/event/EventCollection';

Profiles.publish();
Messages.publish();
Events.publish();
