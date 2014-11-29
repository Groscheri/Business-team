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

    /*
        DATA :
            - types
            - revenus 
            - epargneParMois
            - ages
            - assiettePerp
            - assietteMadelin
            - perp
            - madelin
            - rente
    */

    // set to false not to display message anymore
    var DEBUG = false;

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


    /* INIT */
    var type = "";
    var revenu = 0;
    var nombreParents = 0;
    var nombreEnfants = -1;
    var epargneParMois = 0;
    var age = 0;

    // init type
    $('#type_perp').on('click', function () {
        type = 'perp';
        calculMeilleureEpargne(revenu, type);
        calculNombrePartSurRevenu(revenu, nombreParents, nombreEnfants, type);
		
		$('#type_madelin').removeClass('keysSelected');
		$(this).addClass('keysSelected');
    });

    $('#type_madelin').on('click', function () {
        type = 'madelin';
        calculMeilleureEpargne(revenu, type);
        calculNombrePartSurRevenu(revenu, nombreParents, nombreEnfants, type);
		
		$('#type_perp').removeClass('keysSelected');
		$(this).addClass('keysSelected');
    });

    // init foyer
    $('.foyer_parent').each(function () {
        $(this).on('click', function () {
            try {
                nombreParents = parseInt($(this).data('value'));
                calculNombrePartSurRevenu(revenu, nombreParents, nombreEnfants, type);
				$('.foyer_parent').each(function () {
					$(this).removeClass('keysSelected');
				});
				$(this).addClass('keysSelected');
            }
            catch (e) {

            }
        });
    });

    $('.foyer_enfant').each(function () {
        $(this).on('click', function () {
            try {
                nombreEnfants = parseInt($(this).data('value'));
                calculNombrePartSurRevenu(revenu, nombreParents, nombreEnfants, type);
				$('.foyer_enfant').each(function () {
					$(this).removeClass('keysSelected');
				});
				$(this).addClass('keysSelected');
            }
            catch (e) {

            }
        });
    });

    $('#debug').on('click', function () {
        alert('parents : ' + nombreParents + ' / enfants : ' + nombreEnfants);
    });

    // init sliders
    $('#inputEpargne').rangeslider({
        polyfill : false,
        rangeClass: 'rangeslider',
        fillClass: 'rangeslider__fill',
        handleClass: 'rangeslider__handle',

        onInit: function() {},
        onSlide: function(position, value) { 
            // value est la valeur qui nous intéresse
            var revenus = getData().revenus;
            if (revenus.hasOwnProperty(value)) {
                revenu = revenus[value];
                $('#revenu_value').html('<b>' + formate(revenu.toString()) + '</b>');
                calculMeilleureEpargne(revenu, type);
                calculNombrePartSurRevenu(revenu, nombreParents, nombreEnfants, type);
            }
        },
        onSlideEnd: function(position, value) {}
    });

    $('#inputEpargneParMois').rangeslider({
        polyfill : false,
        rangeClass: 'rangeslider',
        fillClass: 'rangeslider__fill',
        handleClass: 'rangeslider__handle',

        onInit: function() {},
        onSlide: function(position, value) { 
            // value est la valeur qui nous intéresse
            var _epargneParMois = getData().epargneParMois;
            if (_epargneParMois.hasOwnProperty(value)) {
                epargneParMois = _epargneParMois[value];
                $('#epargneParMois_value').html('<b>' + formate(epargneParMois.toString()) + '</b>');
                calculRenteParAge (epargneParMois, age);
            }
        },
        onSlideEnd: function(position, value) {}
    });

    // init age
    $('.age').each(function () {
        $(this).on('click', function () {
            try {
                age = parseInt($(this).data('value'));
                calculRenteParAge (epargneParMois, age);
				$('.age').each(function () {
					$(this).removeClass('keysSelected');
				});
				$(this).addClass('keysSelected');
            }
            catch (e) {

            }
        });
    });








    /* UTILS */
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
        if (_revenu == 0 || _type == '') {
            return;
        }

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
            var meilleureEpargne = $('#meilleureEpargne');
            meilleureEpargne.show();
            meilleureEpargne.html('Vous pouvez épargner <strong>' + formate(epargne.toString()) + '€</strong> par mois !');
        }
    }

    function calculNombrePartSurRevenu (_revenu, _nombreParents, _nombreEnfants, _type) {
        if (_revenu == 0 || _nombreParents == 0 || _nombreEnfants == -1 || _type == "") {
            return;
        }

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
            var economieImpot = $('#economieImpot');
            economieImpot.show();
            economieImpot.html('Votre économie d\'impôts maximale dès la 1<sup>ère</sup> année pourrait atteindre : <strong>' + formate(part.toString()) + '€</strong>');
        }
    }

    function calculRenteParAge (_epargneParMois, _age) {
        if (_epargneParMois == 0 || _age == 0) {
            return;
        }

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

            var renteDOM = $('#rente');
            var html = 'Si vous épargnez <strong>' + formate(_epargneParMois.toString()) + '€</strong> par mois à partir de <strong>' + _age + ' ans</strong>, vous allez gagner tous les mois un complément de ressource à vie de :';
            html += '<table class="table table-bordered" style="text-align:center;">';
            html += '<tr>';
            for (var i in rentes) {
                var rente = rentes[i];
                html += '<td>' + rente.age + '</td>';
            }
            html += '</tr>';

            html += '<tr>';
            for (var i in rentes) {
                var rente = rentes[i];
                html += '<td>' + formate(rente.montant.toString()) + '€</td>';
            }
            html += '</tr>';

            html += '</table>';
            renteDOM.show();
            renteDOM.html(html);

            // debug
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
	
	//Formate les nombres au format monetaire
	function formate(valeur){
 
		if (isNaN(valeur.split(' ').join(''))){
			return false;
		}
		 
		var valeurformate =new Array()
		var tempval=valeur.split('.')
		valeur=tempval[0].split(' ').join('')
		valeur=valeur.split('').reverse() 
		 
		var i=0
		while(i<valeur.length){
		 
		 valeurformate.push( (valeur[i+2]?valeur[i+2]:'') + (valeur[i+1]?valeur[i+1]:'') + valeur[i] );
		 i=i+3;
		}
		 
		valeurformate=valeurformate.reverse().join(' ') +( tempval[1]?tempval[1].length>0?'.'+tempval[1]:'':'');
		return valeurformate
	}

});
