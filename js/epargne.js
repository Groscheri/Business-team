var module = (function () {

    /*
    Data
    */

    // perp => salarié
    // madelin => professionnel indépendant
    var types = ["perp", "madelin"];
    var revenues = [20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 150000, 200000];
    var assiettePerp = [3703,3703,3703,4500,5400,6300,7200,8100,9000,13790,18790];
    var assietteMadelin = [3755,3755,4368,6868,9368,11868,14368,16868,19368,31868,44368];

    /*
     part => rente
    */
    var perp = {
        1 : [700,577,1111,1350,1620,1890,2226,3321,3690,5654,8456],
        1.5 : [234,518,1111,1350,1620,1890,2226,3321,3690,5654,8456],
        2 : [0,658,518,630,874,1890,2160,2430,2700,4137,7704],
        2.5 : [0,306,518,630,756,1615,2160,2430,2700,4137,7704],
        3 : [0,232,309,630,756,882,2160,2430,2700,4137,7704],
        4 : [0,0,306,304,756,882,1008,2272,2700,4137,7704],
        5 : [0,0,204,248,297,605,1008,1134,2188,4137,7704]
    };
    var madelin = {
        1 : [572,1065,1310,2060,2810,3560,5257,6916,7941,13066,19966],
        1.5 : [566,526,1310,2060,2810,3560,5257,6916,7941,13066,19966],
        2 : [150,548,611,961,2390,3560,4310,5060,5810,10353,18191],
        2.5 : [0,112,611,961,1564,3514,5464,6366,5810,10353,18191],
        3 : [0,310,583,961,1311,2689,4310,5060,5810,10353,18191],
        4 : [0,0,361,551,1311,1661,2989,4939,5810,10353,18191],
        5 : [0,0,312,527,519,1507,2011,3289,5239,10353,18191]
    };

    /*
    Public function
    */

    /*
    Calcul du nombre de part sur revenu (économie d'impôt maximale atteint dès la première année)
    @param _revenuAnnuelNet revenu annuel net du foyer fiscal
    @param _nombreParents nombre de parents dans le foyer fiscal (1 ou 2)
    @param _nombreEnfants nombre d'enfants dans le foyer fiscal (0 ou plus)
    @param _type "perp" pour salarié ou "madelin" pour professionnel indépendant
    @return object with state : 'ok' or 'error'
    if 'error', object contains 'message' property which can help you debuging
    if 'ok', object contains 'data' object with 'epargne' property
    */
    var calculNombrePartSurRevenu = function (_revenuAnnuelNet, _nombreParents, _nombreEnfants, _type) {

        if (typeof _type != 'string') {
            return { state : 'error', message : 'Le type de personne doit être une chaine de caractère.'};
        }

        if (typeof _revenuAnnuelNet != 'number') {
            return { state : 'error', message : 'Le revenu doit être un nombre.'};
        }

        if ($.inArray(_type, types) === -1) {
            return { state : 'error', message : 'Type inconnu.'};
        }

        var index = $.inArray(_revenuAnnuelNet, revenues);

        if (index === -1) {
            return { state : 'error', message : 'Revenu incorrect.'};
        }

        var retour = calculPointsFoyerFiscal(_nombreParents, _nombreEnfants);
        if (retour.state != 'ok') {
            return retour;
        }
        var points = retour.data.points;

        var data = (_type === 'perp') ? perp : madelin;
        if (!data.hasOwnProperty(points)) {
            return { state : 'error', message : 'Le calcul des points n\'a pas renvoyé un nombre de points traitable. Points reçus : ' + points + '.'};
        }
        
        return {
            state : 'ok',
            data : {
                part : data[points][index]
            }
        };
    }

    /*
    Calcul de la meilleure épargne en fonction du revenu annuel net et du type de personne
    @param _revenuAnnuelNet valeur entre 20.000 et 100.000 par palier de 10.000 et 150.000 et 200.000
    @param _type "perp" pour salarié ou "madelin" pour professionnel indépendant
    @return object with state : 'ok' or 'error'
    if 'error', object contains 'message' property which can help you debuging
    if 'ok', object contains 'data' object with 'epargne' property
    */
    var calculMeilleureEpargne = function (_revenuAnnuelNet, _type) {

        if (typeof _revenuAnnuelNet != 'number') {
            return { state : 'error', message : 'Le revenu doit être un nombre.'};
        }

        if (typeof _type != 'string') {
            return { state : 'error', message : 'Le type de personne doit être une chaine de caractère.'};
        }

        if ($.inArray(_type, types) === -1) {
            return { state : 'error', message : 'Type inconnu.'};
        }

        if ($.inArray(_revenuAnnuelNet, revenues) === -1) {
            return { state : 'error', message : 'Revenu incorrect.'};
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

    /*
    Private functions
    */

    function calculPointsFoyerFiscal (_nombreParents, _nombreEnfants) {
        if (typeof _nombreParents != 'number' || typeof _nombreEnfants != 'number') {
            return { state : 'error', message : 'Les paramètres doivent être des nombres.'};
        }

        if (_nombreParents < 1 || _nombreParents > 2) {
            return { state : 'error', message : 'Il ne peut y avoir qu\'un ou deux parent(s). Nombre reçu : ' + _nombreParents + '.'};
        }

        if (_nombreEnfants < 0) {
            return { state : 'error', message : 'Le nombre d\'enfants ne peut pas être négatif. Nombre reçu : ' + _nombreEnfants + '.'};
        }

        // 0 => 0
        // 1 => 0.5
        // 2 => 1
        // 3 => 2
        // 4 et + => 3
        var pointsParents = _nombreParents;
        var pointsEnfants = 0;

        if (_nombreEnfants == 1) {
            pointsEnfants = 0.5;
        }
        else if (_nombreEnfants > 1 && _nombreEnfants < 5) {
            pointsEnfants = _nombreEnfants - 1;
        }
        else if (_nombreEnfants >= 5) {
            pointsEnfants = 3;
        }
        else {
            pointsEnfants = 0;
        }

        var points = pointsEnfants + pointsParents;

        return {
            state : 'ok',
            data : {
                points : points
            }
        }
    }

    function obtenirIndexParRevenu (_revenu) {
        return $.inArray(_revenu, revenues);
    }

    /*
    return public functions
    */

    return {
        calculMeilleureEpargne : calculMeilleureEpargne,
        calculNombrePartSurRevenu : calculNombrePartSurRevenu
    }

})();


