// var moment = require('moment');

export default {

    enumerate(arr, limit, oxfordComma) {
        if (arr) {
            if (limit instanceof Spacebars.kw) {
                const options = limit;
                limit = options.hash.limit;
                oxfordComma = options.hash.oxfordComma;
            }

            oxfordComma = oxfordComma === undefined ? true : oxfordComma;
            limit = limit === undefined ? -1 : limit;

            if (arr.length === 1 || limit === 1) {
                return arr[0];
            }

            if (limit !== -1) {
                arr = arr.slice(0, limit);
            }

            const length = arr.length;
            const last = arr.pop();
            let suffix = ' and ';

            if (oxfordComma === true
                || typeof oxfordComma === 'number' && length >= oxfordComma) {
                suffix = `, ${suffix}`;
            }

            return arr.join(', ') + suffix + last;
        }

        return '';
    },

    prettyDate(date) {
        return moment(date).format('LL');
    },

    prettyDateHour(date) {
        return moment(date, "MM/DD/YYYY h:mm a").format('LLL');
    },

    imagePath(id) {
        return Mailer.settings.baseUrl + '/cfs/files/images/' + id;
    },

    prettyType (option) {
      const options = {
        relax: "Relajante",
        decontracting: "Descontracturante",
        sport: "Sport"
      };
      return options[option];
    },

    prettyTherapistType (option) {
      const options = {
        any: "Cualquiera",
        male: "Hombre",
        female: "Mujer",
        same: "Terapeuta anterior"
      }
      return options[option];
    },

    prettyProduct (option) {
      const options = {
        60: "60 min",
        90: "90 min",
      };
      return options[option];
    },

    prettyHourComplete (date) {
      return moment(date, "MM/DD/YYYY h:mm a").format('LLLL');
    }


};
