/**
 * This is a script for migrating the database to the current schema.
 *
 * @author Matthias Bräuer
 */
var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGO_URL;

console.log(`---------------------- Migration on ${new Date().toUTCString()} ----------------------`);

if (!url) {
    console.log('Environment variable MONGO_URL must be set.\n\n');
} else {
    MongoClient.connect(url, function (err, db) {
        if (!err) {
            var dbName = url.split('/').reverse()[0];
            var collection = db.db(dbName).collection('therapists');

            updateTherapistFields(db, collection);
        } else {
            console.log('Could not establish connection.\n\n');
        }
    });
}

/**
 * Remove, create and update field of every document in collection.
 *
 * @param db
 * @param collection
 */
var updateTherapistFields = (db, collection) => {
    collection.find().toArray(function (err, items) {
        if (err) {
            console.log(`Could not fetch "therapists" database connection due to error: ${err}.`);
        }

        console.log('Updating therapists...');

        var elementCount = 0;

        items.forEach((item) => {
            var mot = item.mot;

            if (!mot) {
                mot = item.hasCar ? 'car' : 'other';
            }

            collection.updateOne({_id: item._id}, {
                $set: {
                    experienceTypes: getAllowedExperienceTypes(item.experienceTypes),
                    birthday: getParsedDate(item.birthday, item._id),
                    /** 'car' and 'other' are copied from {@see Therapists} */
                    mot: mot,
                    spaExperience: item.spaExperience || null
                },
                $unset: {
                    herbs: 1,
                    smartphone: 1,
                    languages: 1,
                    hasCar: 1,
                    zone: 1,
                    contactTime: 1,
                    jobStatus: 1
                }
            }, (err) => {
                if (err) {
                    closeDbConnection(db);
                } else {
                    elementCount++;

                    if (elementCount === items.length) {
                        console.log('\nSuccessfully migrated database.');

                        closeDbConnection(db);
                    }
                }
            });
        });
    });
};

/**
 * Remove all unnecessary experience type from given array
 * and returns new array with allowed values.
 *
 * @param experienceTypes
 * @returns {*}
 */
var getAllowedExperienceTypes = (experienceTypes) => {
    return experienceTypes.filter(type => ['a', 'b', 'c', 'd', 'e', 'f']
        .some(allowedType => type === allowedType));
};

/**
 * Parse the given date string to a Date object. If date string is
 * already a Date object or is null it is not parsed.
 *
 * @param id - The item id to which the date string belongs to. Used for logging errors.
 * @param dateString
 * @returns {*}
 */
var getParsedDate = (dateString, id) => {
    if (dateString instanceof Date || dateString == null) return dateString;

    dateString = dateString.toLowerCase()
        .replace(/ de /g, ' ')
        .replace(/del/g, ' ')
        .replace('enero', 'jan')
        .replace('ene', 'jan')
        .replace('dic', 'dec')
        .replace('abril', 'apr')
        .replace('ago', 'aug')
        .replace('agosto', 'aug')
        .replace(/-/g, '/');

    var splitDate = dateString.split('/');

    if (splitDate.length === 3) {
        var temp = splitDate[0];
        splitDate[0] = splitDate[1];
        splitDate[1] = temp;

        dateString = splitDate.join('/');
    }

    if (new Date(dateString).toDateString() === 'Invalid Date') {
        console.log(`Could not parse date string: "${dateString}" for item with id: ${id}.`);

        return null;
    }

    return new Date(dateString);
};

var closeDbConnection = (db) => {
    console.log('\nClosing database connection.');

    db.close()
        .catch((err) => console.log(`Could not close database connection due to error: ${err}.`))
        .then(() => console.log('Database connection closed.\n\n'));
};
