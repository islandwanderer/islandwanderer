import { Accounts } from 'meteor/accounts-base';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import {Roles} from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';

/* eslint-disable no-console */

/* Create a profile document for this user if none exists already. */
Accounts.validateNewUser(function validate(user) {
  if (user) {
    const username = user.services.cas.id;
    Roles.addUsersToRoles(Meteor.user(), 'user');
    if (!Profiles.isDefined(username)) {
      Profiles.define({ username });
    }
  }

  // All UH users are valid for BowFolios.
  return true;
});

