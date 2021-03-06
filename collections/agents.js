class AgentsCollection extends Mongo.Collection {
    update(selector, modifier, options, callback) {
        const {$set, $unset} = modifier;
        if (!$unset) {
            $set.completedProfile = true;
            modifier.$set = $set;
        }
        return super.update(selector, modifier, options, callback);
    }
}

const Agents = new AgentsCollection('agents');

Agents.allow({
    insert: () => true,
    update: function (userId, doc) {
        return Roles.userIsInRole(userId, ['admin']) || userId === doc.userId;
    },
    remove: function (userId) {
        // just admins can delete
        return Roles.userIsInRole(userId, ['admin']);
    }
});

// Address schema
const CompanySchema = new SimpleSchema({
    name: {
        type: String
    },
    type: {
        type: String
    },
    phone: {
        type: String
    },
    zip: {
        type: String,
        regEx: SimpleSchema.RegEx.ZipCode
    },
    address: {
        type: String
    }
});

const PersonSchema = new SimpleSchema({
    fullname: {
        type: String
    },
    personalPhone: {
        type: String
    },
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        unique: true
    }

});

const AgentsSchema = new SimpleSchema({
    agent: {
        type: PersonSchema
    },
    company: {
        type: CompanySchema
    },
    points: {
        type: Number,
        defaultValue: 0,
        autoform: {
            omit: false
        }
    },
    reward: {
        type: String,
        optional: true,
        defaultValue: 'N/A',
        autoform: {
            omit: false
        }
    },

    createdAt: {
        type: Date,
        autoValue: function () {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date()};
            } else {
                this.unset();  // Prevent user from supplying their own value
            }
        },
        denyUpdate: true,
        autoform: {
            omit: true
        }
    },
    userId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        optional: true,
        autoform: {
            omit: true
        }
    },
    status: {
        type: Boolean,
        defaultValue: false,
        autoform: {
            omit: true
        }
    },
    completedProfile: {
        type: Boolean,
        defaultValue: false,
        autoform: {
            omit: true
        }
    }
});

// Add translations to labels
for (const prop in AgentsSchema._schema) {
    AgentsSchema._schema[prop].label = function () {
        return TAPi18n.__(`schemas.agents.${prop}`, null);
    };
}

AgentsSchema._schema['agent'].label = function () {
    return TAPi18n.__(`schemas.agents.agentLabel`, null);
};
AgentsSchema._schema['company'].label = function () {
    return TAPi18n.__(`schemas.agents.companyLabel`, null);
};
AgentsSchema._schema['points'].label = function () {
    return TAPi18n.__(`schemas.agents.agent.points`, null);
};
AgentsSchema._schema['reward'].label = function () {
    return TAPi18n.__(`schemas.agents.agent.reward`, null);
};

Agents.attachSchema(AgentsSchema);

export {Agents, AgentsSchema};
