module.exports = {
    template: require('social.html'),
    data: function() {
        return {
	    targetUsername: ""
	}
    },
    props: ['show', 'data', 'context', 'externalchange', 'messages'],
    created: function() {
	Vue.nextTick(this.setTypeAhead);
    },
    methods: {
	setTypeAhead: function() {
	    var substringMatcher = function(strs) {
		return function findMatches(q, cb) {
                    var matches, substringRegex;
		    
                    //an array that will be populated with substring matches
                    matches = [];
		
                    // regex used to determine if a string contains the substring `q`
                    substrRegex = new RegExp(q, 'i');
		    
                    // iterate through the pool of strings and for any string that
                    // contains the substring `q`, add it to the `matches` array
                    $.each(strs, function(i, str) {
			if (substrRegex.test(str)) {
                            matches.push(str);
			}
                    });
		    
                    cb(matches);
		};
            };
	    var usernames = this.usernames;
	    // remove our username
	    usernames.splice(usernames.indexOf(this.context.username), 1);
	    console.log("TYPEAHEAD:");
	    console.log(usernames);
	    $('#friend-name-input')
		.typeahead(
		    {
			hint: true,
			highlight: true,
			minLength: 1
		    },
		    {
			name: 'usernames',
			source: substringMatcher(usernames)
		    });
	},
	
	showMessage: function(title, body) {
	    this.messages.push({
		title: title,
		body: body,
		show: true
	    });
	},
	
	sendInitialFollowRequest: function(name) {
	    console.log("sending follow request to " + name);
	    this.context.sendInitialFollowRequest(name)
		.thenApply(success => {
		    this.targetUsername = "";
		    this.showMessage("Follow request sent!", "");
		    this.externalchange++;
		});
	},

	acceptAndReciprocate: function(req) {
	    this.context.sendReplyFollowRequest(req, true, true)
		.thenApply(success => {
		    this.showMessage("Follow request reciprocated!", "");
		    this.externalchange++;
		});
	},
	
        accept: function(req) {
	    this.context.sendReplyFollowRequest(req, true, false)
		.thenApply(success => {
		    this.showMessage("Follow request accepted!", "");
		    this.externalchange++;
		});
	},
	
        reject: function(req) {
	    this.context.sendReplyFollowRequest(req, false, false)
		.thenApply(success => {
		    this.showMessage("Follow request rejected!", "");
		    this.externalchange++;
		});
	},

	removeFollower: function(username) {
	    this.context.removeFollower(username)
		.thenApply(success => {
		    this.showMessage("Removed follower " + username, "");
		    this.externalchange++;
		});
	},
	
        unfollow: function(username) {
	    this.context.unfollow(username)
		.thenApply(success => {
		    this.showMessage("Stopped following " + username, "");
		    this.externalchange++;
		});
	},
	
        close: function () {
            this.show = false;
        }
    },
    computed: {
	usernames: function() {
	    return this.context.network.usernames.toArray([]);
	}
    }
}