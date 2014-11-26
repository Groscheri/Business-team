$(function () {

    /*
        TO READ :
        Object module contains all public functions we need
        Liste des fonctions utiles :
            - module.calculMeilleureEpargne(_revenu, _type)
            - module.calculNombrePartSurRevenu(_revenu, _nombreParents, _nombreEnfants, _type)
            - module.calculRenteParAge(_epargneParMois, _age)
        Voir les commentaires dans module.js pour plus de détails sur les paramètres et le retour des fonctions.
    */

    // set to false not to display message anymore
    var DEBUG = true;

    // some tests
    function tests () {
        // data de tests
        var type = "madelin";
        var revenu = 100000;
        var nombreParents = 1;
        var nombreEnfants = 3;
        var epargneParMois = 300;
        var age = 35;

        // test calculMeilleureEpargne
        calculMeilleureEpargne(revenu, type);

        // test calculNombrePartSurRevenu
        calculNombrePartSurRevenu (revenu, nombreParents, nombreEnfants, type);
        
        // test calculRenteParAge
        calculRenteParAge(epargneParMois, age);
    }

    // init debug
    var debug = $('#debug');
    if (DEBUG) {
        tests();
    }
    else {
        // on supprime le panel de debug
        debug.parent().remove();
    }

    // utils functions
    function log(_message) {
        if (typeof _message == 'string') {
            var date = new Date();
            var heure = date.getHours();
            var minute = date.getMinutes();
            var seconde = date.getSeconds();
            var dateString = heure + ':' + minute + ':' + seconde;
            debug.append('(' + dateString + ') ' + _message + '<br />');
        }
    }

    function clear() {
        debug.empty();
    }

    function displayError(error, _stack) {
        if (!DEBUG) {
            return;
        }

        // traitement pour la gestion des erreurs (affichage particulier à voir)
        var suffixe = '';
        if (_stack) {
            suffixe = '<br />' + new Error().stack;
        }

        if (error.hasOwnProperty('message')) {
            log('Error : ' + error.message + '' + suffixe);
        }
        else {
            log('Unknown error ! ' + suffixe);
        }
    }

    function getData() {
        return module.data;
    }

    // link modele to view
    function calculMeilleureEpargne (_revenu, _type) {
        var retour = module.calculMeilleureEpargne(_revenu, _type);
        if (retour.state != 'ok') {
            displayError(retour);
        }
        else {
            var epargne = retour.data.epargne;
            // traitement à faire ici pour la vue
            if (DEBUG) {
                log("Revenu : " + _revenu + " / type " + _type + " : épargne => " + epargne);
            }
            
        }
    }

    function calculNombrePartSurRevenu (_revenu, _nombreParents, _nombreEnfants, _type) {
        var retour = module.calculNombrePartSurRevenu (_revenu, _nombreParents, _nombreEnfants, _type);
        if (retour.state != 'ok') {
            displayError(retour);
        }
        else {
            var part = retour.data.part;
            // traitement à faire ici pour la vue
            if (DEBUG) {
                log('Part [Parents : ' + _nombreParents + '/Enfants : ' + _nombreEnfants + '/Type : ' + _type + ']  : ' + part);
            }
        }
    }

    function calculRenteParAge (_epargneParMois, _age) {
        var retour = module.calculRenteParAge(_epargneParMois, _age);
        if (retour.state != 'ok') {
            displayError(retour);
        }
        else {
            var rentes = retour.data.rentes;
            // traitement à faire ici pour la vue
            // format de l'objet rentes
            // [rente1, rente2, ..., renteN]
            // rente1 {
            //     age : 40,
            //     montant : XXXX
            // }
            // ...

            var rentesToStringArray = [];
            for (var i in rentes) {
                var rente = rentes[i];
                rentesToStringArray.push(rente.age + ' => ' + rente.montant);
            }

            if (DEBUG) {
                log('Rente [epargneParMois : ' + _epargneParMois + '/Age : ' + _age + '] : ' + rentesToStringArray.join(' / '));
            }
        }
    }
});