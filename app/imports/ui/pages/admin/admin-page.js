import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Tags } from '/imports/api/tag/TagCollection';

const selectedTagsKey = 'selectedTags';


Template.Admin_Page.onCreated(function onCreated() {
  this.subscribe(Tags.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(selectedTagsKey, undefined);
});

Template.Admin_Page.helpers({
  profiles() {
    // Initialize selectedTags to all of them if messageFlags is undefined.
    if (!Template.instance().messageFlags.get(selectedTagsKey)) {
      Template.instance().messageFlags.set(selectedTagsKey, _.map(Tags.findAll(), tag => tag.name));
    }
    // Find all profiles with the currently selected tags.
    const allProfiles = Profiles.findAll();
    const selectedTags = Template.instance().messageFlags.get(selectedTagsKey);
    return _.filter(allProfiles, profile => _.intersection(profile.tags, selectedTags).length > 0);
  },

  tags() {
    return _.map(Tags.findAll(),
        function makeTagObject(tag) {
          return {
            label: tag.name,
            selected: _.contains(Template.instance().messageFlags.get(selectedTagsKey), tag.name),
          };
        });
  },
});

Template.Admin_Page.events({
  'submit .filter-data-form'(event, instance) {
    event.preventDefault();
    const selectedOptions = _.filter(event.target.Tags.selectedOptions, (option) => option.selected);
    instance.messageFlags.set(selectedTagsKey, _.map(selectedOptions, (option) => option.value));
  },
});

