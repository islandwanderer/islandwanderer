import SimpleSchema from 'simpl-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { Tags } from '/imports/api/tag/TagCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Tracker } from 'meteor/tracker';

/** @module Profile */

/**
 * Profiles provide portfolio data for a user.
 * @extends module:Base~BaseCollection
 */
class ProfileCollection extends BaseCollection {

  /**
   * Creates the Profile collection.
   */
  constructor() {
    super('Profile', new SimpleSchema({
      username: { type: String },
      // Remainder are optional
      firstName: { type: String, optional: true },
      lastName: { type: String, optional: true },
      bio: { type: String, optional: true },
      tags: { type: Array, optional: true },
      'tags.$': { type: String },
      title: { type: String, optional: true },
      picture: { type: SimpleSchema.RegEx.Url, optional: true },
      github: { type: SimpleSchema.RegEx.Url, optional: true },
      facebook: { type: SimpleSchema.RegEx.Url, optional: true },
      instagram: { type: SimpleSchema.RegEx.Url, optional: true },
    }, { tracker: Tracker }));
  }

  /**
   * Defines a new Profile.
   * @example
   * Profiles.define({ firstName: 'Philip',
   *                   lastName: 'Johnson',
   *                   username: 'johnson',
   *                   bio: 'I have been a professor of computer science at UH since 1990.',
   *                   tags: ['Application Development', 'Software Engineering', 'Databases'],
   *                   title: 'Professor of Information and Computer Sciences',
   *                   picture: 'http://philipmjohnson.org/headshot.jpg',
   *                   github: 'https://github.com/philipmjohnson',
   *                   facebook: 'https://facebook.com/philipmjohnson',
   *                   instagram: 'https://instagram.com/philipmjohnson' });
   * @param { Object } description Object with required key username.
   * Remaining keys are optional.
   * Username must be unique for all users. It should be the UH email account.
   * Tags is an array of defined tag names.
   * @throws { Meteor.Error } If a user with the supplied username already exists, or
   * if one or more tags are not defined, or if github, facebook, and instagram are not URLs.
   * @returns The newly created docID.
   */
  define({ firstName = '', lastName = '', username, bio = '', tags = [], picture = '', title = '', github = '',
      facebook = '', instagram = '' }) {
    // make sure required fields are OK.
    const checkPattern = { firstName: String, lastName: String, username: String, bio: String, picture: String,
      title: String };
    check({ firstName, lastName, username, bio, picture, title }, checkPattern);

    if (this.find({ username }).count() > 0) {
      throw new Meteor.Error(`${username} is previously defined in another Profile`);
    }

    // Throw an error if any of the passed Tag names are not defined.
    Tags.assertNames(tags);

    // Throw an error if there are duplicates in the passed tag names.
    if (tags.length !== _.uniq(tags).length) {
      throw new Meteor.Error(`${tags} contains duplicates`);
    }

    return this._collection.insert({ firstName, lastName, username, bio, tags, picture, title, github,
      facebook, instagram });
  }

  /**
   * Returns an object representing the Profile docID in a format acceptable to define().
   * @param docID The docID of a Profile.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const firstName = doc.firstName;
    const lastName = doc.lastName;
    const username = doc.username;
    const bio = doc.bio;
    const tags = doc.tags;
    const picture = doc.picture;
    const title = doc.title;
    const github = doc.github;
    const facebook = doc.facebook;
    const instagram = doc.instagram;
    return { firstName, lastName, username, bio, tags, picture, title, github, facebook, instagram };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Profiles = new ProfileCollection();
