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
    companyType: {
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

Agents.attachSchema(AgentsSchema);

export {Agents};
