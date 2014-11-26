function calculMeilleureEpargne (_revenu, _type) {
    var retour = module.calculMeilleureEpargne(_revenu, _type);
    if (retour.state != 'ok') {
        displayError(retour);
    }
    else {
        var epargne = retour.data.epargne;
        // traitement à faire ici pour la vue
        //alert("Revenu : " + revenu + " / type " + type + " : épargne => " + epargne);
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
        //alert('Part [Parents : ' + nombreParents + '/Enfants : ' + nombreEnfants + '/Type : ' + type + ']  : ' + part);
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

        /*var rentesToStringArray = [];
        for (var i in rentes) {
            var rente = rentes[i];
            rentesToStringArray.push(rente.age + ' => ' + rente.montant);
        }

        alert('Rente [epargneParMois : ' + epargneParMois + '/Age : ' + age + '] : ' + rentesToStringArray.join(' / '));*/
    }
}

// utils functions
function getData() {
    return module.data;
}