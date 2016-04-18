(function() {

  // global used to track whether the ticket has been updated and needs to be saved
  var updated = false;

  // array of ids for custom fields that are managed by the sidebar app
  var fields = new Array(31833198, 31865117);

  return {
    requests: {
      updateViaAPI: function() {

        // build the url for the api call
        var ticket = this.ticket();
        var subdomain = this.setting('subdomain');
        var urlString = 'https://'+subdomain+'.zendesk.com/api/v2/tickets/'+ticket.id()+'.json';

        // build the payload for the ticket update
        var customFields = [];
        for (var i = 0; i < fields.length; i++) {
          var cfVal = ticket.customField('custom_field_' + fields[i]);
          if (cfVal == 'yes'){
            cfVal= true;
          } else {
            cfVal= false;
          }
          customFields.push({'id':fields[i],'value':cfVal}); 
        }
        var ccs = ticket.collaborators();
        var payload = JSON.stringify({
                    "ticket": 
                      {
                        "comment": 
                          {
                            "public": false, 
                            "body": "This ticket was updated via the Eng sidebar"
                          }, 
                        "subject": ticket.subject(), 
                        "custom_fields": customFields,
                        "collaborators":ccs
                      }
                  });

        // set the headers, pulling the basic auth info from the app settings
        var headers = {
                    "Content-Type":"application/json", 
                    "Authorization": "Basic {{setting.credentials}}"
                  };

        // make this a secure call so that basic auth info is not exposed in client browser
        return {
          url: urlString,
          type: 'PUT',
          dataType: 'json',
          secure: true,
          data: payload,
          headers: headers
        };
      }
    },

    events: {
      'app.activated':                        'initialize',      
      'change #ticket-subject':               'updateTicketSubject', 
      'change #cc-add':                       'updateTicketCC', 
      'click input[type="checkbox"]':         'updateTicketCheckboxes',
      'ticket.subject.changed':               'updateSidebarSubject',
      'ticket.custom_field_31833198.changed': 'updateSidebarCheckboxes',
      'ticket.custom_field_31865117.changed': 'updateSidebarCheckboxes',
      'click #update':                        'updateTicket',
      'click #addmecc':                       'addmecc',
      'click #removemecc':                    'removemecc',
      'updateViaAPI.fail':                    'api_fail',
      'updateViaAPI.done':                    'api_success'
    },

    api_fail: function(data){
      console.log('api call failed');
      console.log(data);
    },

    api_success: function(data){ 
      console.log('api call succeeded');
      console.log(data);
    },

    // if ticket form values have been updated via sidebar, make api call to actually update the ticket
    updateTicket: function(){
      if (updated){
        this.ajax('updateViaAPI');
      }
    },

    // pre-populate sidebar fields with value from ticket
    initialize: function(data) {
      if (data.firstLoad) {
        this.switchTo('ticket');
        var ticket = this.ticket();
        this.$('#ticket-subject').val(ticket.subject());
        for (var i=0; i<fields.length; i++) {
          if (ticket.customField('custom_field_' + fields[i]) == 'yes') {
            this.$('#custom_field_' + fields[i]).prop('checked', true);
          }
        }
      }
    },

    // make sure all ticket checkboxes match sidebard checkboxes
    updateTicketCheckboxes: function(event) {
      updated=true;
      var id = event.target.id;
      var target = this.$(event.target);
      var ticket = this.ticket();
      if (target.prop('checked')){
        ticket.customField(id,'yes');
      } else {
        ticket.customField(id,'no');
      }
    },

    // make sure that ticket subject matches sidebar subject field
    updateTicketSubject: function(event){
      updated=true;
      var ticket = this.ticket();
      ticket.subject(this.$('#ticket-subject').val());
    },

    // make sure ticket cc is updated if user is entered into cc field of sidebar
    updateTicketCC: function(event){
      updated=true;
      var ticket = this.ticket();
      var addCC = this.$('#cc-add');
      ticket.collaborators().add({email:addCC.val()});
      addCC.val('');
    },

    // make sure sidebar checkboxes match ticket
    updateSidebarCheckboxes: function() {
      var ticket = this.ticket();
      this.$('#custom_field_31833198').prop('checked', this.isChecked(ticket.customField('custom_field_31833198')));
      this.$('#custom_field_31865117').prop('checked', this.isChecked(ticket.customField('custom_field_31865117')));
    },

    // add current user to ticket cc
    addmecc: function(){
      var user = this.currentUser();
      var email = user.email();
      var ticket = this.ticket();
      ticket.collaborators().add({email:email});
      updated = true;
    },

    // remove current user from ticket cc
    removemecc: function(){
      var user = this.currentUser();
      var email = user.email();
      var ticket = this.ticket();
      ticket.collaborators().remove({email:email});
      updated = true;
    },

    // make sidebar subject field match ticket
    updateSidebarSubject: function(){
      var ticket = this.ticket();
      this.$('#ticket-subject').val(ticket.subject());
    },

    // determine if ticket field is checked
    isChecked: function(val){
      if (val == 'yes') {
        return true;
      }
      else{
        return false;
      }
    },
  };

}());