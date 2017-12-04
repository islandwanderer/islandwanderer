import { Interests } from '/imports/api/interest/InterestCollection';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Messages } from '/imports/api/message/MessageCollection';
import { Events } from '/imports/api/event/EventCollection';

Interests.publish();
Profiles.publish();
Messages.publish();
Events.publish();
