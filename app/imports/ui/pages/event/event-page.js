import { Template } from 'meteor/templating';
import { Events } from '/imports/api/event/EventCollection';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.Event__Page.helpers({

  /**
   * @returns {*} All of the Stuff documents.
   */
  thisEvent() {
    return Events.find();
  },
  event() {
    return Events.findDoc(FlowRouter.getParam('eventName'));
  },
});

  /**
'click .delete' (event) {
  event.preventDefault();
  if(confirm("Are you sure?")) {
    var selectedPostId = Session.get('selectedPostId');
    Posts.remove(selectedPostId);
  }
}
   */
