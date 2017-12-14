import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Tagss } from '/imports/api/tag/TagCollection';
import { Roles } from 'meteor/alanning:roles';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Events } from '/imports/api/event/EventCollection';

const selectedTagssKey = 'selectedTagss';


Template.Admin_Page.onCreated(function onCreated() {
  this.subscribe(Events.getPublicationName());
  //this.subscribe(Tagss.getPublicationName());
  //this.subscribe(Profiles.getPublicationName());
  //this.messageFlags = new ReactiveDict();
  //this.messageFlags.set(selectedTagssKey, undefined);
});

Template.Admin_Page.helpers({
  profiles() {
    // Initialize selectedTagss to all of them if messageFlags is undefined.
    if (!Template.instance().messageFlags.get(selectedTagssKey)) {
      Template.instance().messageFlags.set(selectedTagssKey, _.map(Tagss.findAll(), tag => tag.name));
    }
    // Find all profiles with the currently selected tags.
    const allProfiles = Profiles.findAll();
    const selectedTagss = Template.instance().messageFlags.get(selectedTagssKey);
    return _.filter(allProfiles, profile => _.intersection(profile.tags, selectedTagss).length > 0);
  },

  tags() {
    return _.map(Tagss.findAll(),
        function makeTagsObject(tag) {
          return {
            label: tag.name,
            selected: _.contains(Template.instance().messageFlags.get(selectedTagssKey), tag.name),
          };
        });
  },
});

Template.Admin_Page.events({
  'submit .filter-data-form'(event, instance) {
    event.preventDefault();
    const selectedOptions = _.filter(event.target.Tagss.selectedOptions, (option) => option.selected);
    instance.messageFlags.set(selectedTagssKey, _.map(selectedOptions, (option) => option.value));
  },
});

