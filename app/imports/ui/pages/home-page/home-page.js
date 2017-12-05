import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
// import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Tags } from '/imports/api/tag/TagCollection';
import { Events } from '/imports/api/event/EventCollection';

const selectedTagsKey = 'selectedTags';
// const events = Events.findDoc(FlowRouter.getParam('username'));

Template.Home_Page.onCreated(function onCreated() {
  this.subscribe(Tags.getPublicationName());
  this.subscribe(Events.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(selectedTagsKey, undefined);
});

Template.Home_Page.helpers({
  profiles() {
    // Initialize selectedTags to all of them if messageFlags is undefined.
    if (!Template.instance().messageFlags.get(selectedTagsKey)) {
      Template.instance().messageFlags.set(selectedTagsKey, _.map(Tags.findAll(), interest => interest.name));
    }
    // Find all profiles with the currently selected interests.
    const allEvents = Events.findAll();
    const selectedTags = Template.instance().messageFlags.get(selectedTagsKey);
    return _.filter(allEvents, profile => _.intersection(profile.interests, selectedTags).length > 0);
  },

  interests() {
    return _.map(Tags.findAll(),
        function makeTagObject(interest) {
          return {
            label: interest.name,
            selected: _.contains(Template.instance().messageFlags.get(selectedTagsKey), interest.name),
          };
        });
  },
});

Template.Home_Page.events({
  'submit .filter-data-form'(event, instance) {
    event.preventDefault();
    const selectedOptions = _.filter(event.target.Tags.selectedOptions, (option) => option.selected);
    instance.messageFlags.set(selectedTagsKey, _.map(selectedOptions, (option) => option.value));
  },
});

