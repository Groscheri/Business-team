
// perp => salarié
// madelin => professionnel indépendant
var types = ["perp", "madelin"];
var revenues = [20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 150000, 200000];
var assiettePerp = [3703,3703,3703,4500,5400,6300,7200,8100,9000,13790,18790];
var assietteMadelin = [3755,3755,4368,6868,9368,11868,14368,16868,19368,31868,44368];

function calculMeilleureEpargne (_revenuAnnuelNet, _type) {
    if ($.inArray(_type, types) === -1) {
        return { state : 'error', message : 'Type inconnu'};
    }

    if ($.inArray(_revenuAnnuelNet, revenues) === -1) {
        return { state : 'error', message : 'Revenu incorrect'};
    }

    var data = (type === 'perp') ? assiettePerp : assietteMadelin;

    for (var i in revenues) {
        if (revenues[i] === _revenuAnnuelNet) {
            return {
                state : 'ok',
                data : {
                    epargne : Math.round(data[i]/12)
                }
            };
        }
    }

    return {
        state : 'error',
        message : 'impossible to get there'
    };
}
