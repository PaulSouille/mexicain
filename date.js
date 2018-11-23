module.exports = {
    getJoursFeries: function (an) {
        var JourAn = new Date(an, "00", "01");
        var FeteTravail = new Date(an, "04", "01");
        var Victoire1945 = new Date(an, "04", "08");
        var FeteNationale = new Date(an,"06", "14");
        var Assomption = new Date(an, "07", "15");
        var Toussaint = new Date(an, "10", "01");
        var Armistice = new Date(an, "10", "11");
        var Noel = new Date(an, "11", "25");

        var G = an%19;
        var C = Math.floor(an/100);
        var H = (C - Math.floor(C/4) - Math.floor((8*C+13)/25) + 19*G + 15)%30;
        var I = H - Math.floor(H/28)*(1 - Math.floor(H/28)*Math.floor(29/(H + 1))*Math.floor((21 - G)/11));
        var J = (an*1 + Math.floor(an/4) + I + 2 - C + Math.floor(C/4))%7;
        var L = I - J;

        var MoisPaques = 3 + Math.floor((L + 40)/44);
        var JourPaques = L + 28 - 31*Math.floor(MoisPaques/4);

        var LundiPaques = new Date(an, MoisPaques-1, JourPaques+1);
        var Ascension = new Date(an, MoisPaques-1, JourPaques+39);
        var LundiPentecote = new Date(an, MoisPaques-1, JourPaques+50);

        return new Array(JourAn, LundiPaques, FeteTravail, Victoire1945, Ascension, LundiPentecote, FeteNationale, Assomption, Toussaint, Armistice, Noel);
    },

    etreJourOuvre: function(date) {
        var joursFeries = this.getJoursFeries(date.getFullYear());
        var joursFeriesStr = joursFeries.map(this.getFrString);
    
        return date.getDay() != 6 && date.getDay() != 0 && joursFeriesStr.indexOf(this.getFrString(date)) == -1;
    },

    getFrString : function(date) {
        if(date != "" && date instanceof Date) {
            return date.toLocaleDateString("fr-FR");
        }
    }, 

    etreJourEpsi : function (searchedDate) {
        var joursEpsi = this.getJoursEpsi();

        return typeof joursEpsi.find(function(obj) {
            return obj.Date == searchedDate.toLocaleDateString();
        }) !== 'undefined'
    },

    getJoursEpsi : function() {
        const File = require('./File');

        var csv = File.getFileContent('files/joursEpsi.csv');
        return File.csvToArray(csv);
    }
}