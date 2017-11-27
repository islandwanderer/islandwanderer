import { Interests } from '/imports/api/interest/InterestCollection';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Messages } from '/imports/api/message/MessageCollection';

Interests.publish();
Profiles.publish();
Messages.publish();

