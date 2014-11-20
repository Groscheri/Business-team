var chart1, chart2;
var r1 = 0, r2 = 0, r3 = 0;
var profil_first_selected = false;
var profil_salarie = 0;
var points = 0;
var indice_part = 0;
//Revenus nets annuels
var data1 = Array('20 000 €', '30 000 €', '40 000 €', '50 000 €', '60 000 €', '70 000 €', '80 000 €', '90 000 €', '100 000 €', '150 000 €', '200 000 €' );
var data3 = Array(100,200,300,400,500,800,1000);

/*Estimation rente*/
var rente = Array( /*Pour (100,200,300,400,500,800,1000) euros*/
	/*30*/Array(231,463,694,926,1157,1852,2315),
	/*35*/Array(185,370,555,740,924,1479,1849),
	/*40*/Array(145,289,434,578,723,1156,1445),
	/*45*/Array(109,219,328,438,547,876,1095),
	/*50*/Array(79,158,237,315,395,631,789),
	/*55*/Array(52,104,156,208,261,417,521)
);
var perp = Array( /*Pour (20 000,30 000,40 000,50 000,60 000,70 000,80 000,90 000,100 000,150 000,200 000) euros*/
	/*1   part*/Array(700,577,1111,1350,1620,1890,2226,3321,3690,5654,8456),
	/*1.5 part*/Array(234,518,1111,1350,1620,1890,2226,3321,3690,5654,8456),
	/*2   part*/Array(0,658,518,630,874,1890,2160,2430,2700,4137,7704),
	/*2.5 part*/Array(0,306,518,630,756,1615,2160,2430,2700,4137,7704),
	/*3   part*/Array(0,232,309,630,756,882,2160,2430,2700,4137,7704),
	/*4   part*/Array(0,0,306,304,756,882,1008,2272,2700,4137,7704),
	/*5   part*/Array(0,0,204,248,297,605,1008,1134,2188,4137,7704)
);
var madelin = Array( /*Pour (20 000,30 000,40 000,50 000,60 000,70 000,80 000,90 000,100 000,150 000,200 000) euros*/
	/*1   part*/Array(572,1065,1310,2060,2810,3560,5257,6916,7941,13066,19966),
	/*1.5 part*/Array(566,526,1310,2060,2810,3560,5257,6916,7941,13066,19966),
	/*2   part*/Array(150,548,611,961,2390,3560,4310,5060,5810,10353,18191),
	/*2.5 part*/Array(0,112,611,961,1564,3514,5464,6366,5810,10353,18191),
	/*3   part*/Array(0,310,583,961,1311,2689,4310,5060,5810,10353,18191),
	/*4   part*/Array(0,0,361,551,1311,1661,2989,4939,5810,10353,18191),
	/*5   part*/Array(0,0,312,527,519,1507,2011,3289,5239,10353,18191)
);
var assiettePerp    = Array(3703,3703,3703,4500,5400,6300,7200,8100,9000,13790,18790);
var assietteMadelin = Array(3755,3755,4368,6868,9368,11868,14368,16868,19368,31868,44368);



var myiframe = window.parent.document.getElementById("simulateur");

$(document).ready(function () {
    /*plugin reglettes*/
    $("#data1-slider").slider({
        min: 0,
        max: 10,
        range: "min",
        value: 0,
        animate: true,
        orientation: "horizontal",
        slide: function (event, ui) { if ($(".etape2").hasClass('active')) { $("#amount1").html($('#data1-label span').eq(ui.value).text()); } },
        change: function (event, ui) {
            r1 = ui.value;
            if ($(".etape2").hasClass('active')) {
                $("#amount1").html($('#data1-label span').eq(ui.value).text()); 
                $(".etape3").addClass('active');
                if (profil_salarie > 0) { var testons = Math.round((assiettePerp[r1] / 12)); }
                else { var testons = Math.round((assietteMadelin[r1] / 12)); }
                var myindice = 0;
                for (m = 0; parseInt(testons) >= parseInt(data3[m]); m++) { myindice = m; }
                $("#data3-slider").slider("option", "value", myindice);

                getResult()
            }
        }
    });
    for (var i in data1)
        $('#data1-label').append('<span>' + data1[i] + '</span>');
    $('#amount1').html(data1[0]);

    $("#data3-slider").slider({
        min: 0,
        max: 6,
        range: "min",
        value: 0,
        animate: true,
        slide: function (event, ui) {
            if ($(".etape4").hasClass('active')) {
                $(".etape5").addClass('active');
                $("#amount3, #amout3bis").html($('#data3-label span').eq(ui.value).text()/*ui.value*/);
            } 
        },
        //slide: function( event, ui ) { r3 = ui.value; getResult() },
        change: function (event, ui) {
            //if ($(".etape4").hasClass('active')) {
                r3 = ui.value; 
                getResult();
                $("#amount3").html($('#data3-label span').eq(ui.value).text()); 
                $("#amout3bis").html($('#data3-label span').eq(ui.value).text());
            //} 
        }
    });

    $('#data3-slider a.ui-slider-handle').click(function () { if ($(".etape4").hasClass('active')) { $(".etape5").addClass('active'); } })

    for (var i = 0; i <= 6; i++)
        $('#data3-label').append('<span>' + data3[i] + ' €' + '</span>');
    $('#amount3').html(data3[0] + ' €');

    /****************************************************************************************/
    /****************************************************************************************/
    /*Events clicks*/
    $(".foyer #adultes div.picto").click(function () {

        if ($('.etape3').hasClass('active')) {

            $(".foyer #adultes div.picto").removeClass('actif');

            var nb_adultes = $(this).index() + 1;

            for (i = 1; i <= nb_adultes - 1; i++) {
                $(".foyer #adultes div.picto:eq(" + (i - 1) + ")").addClass('actif');
            }


            if ($(".foyer #adultes div.picto.actif").length > 0) $('.etape4').addClass('active');
            else $('.etape4').removeClass('active');
            comptepoints();
        }
    });

    $(".foyer #enfants div.picto").click(function () {


        if ($('.etape3').hasClass('active')) {
            var nb_enfants = $(this).index() + 1;

            if ($(this).index() == 0 && nb_enfants == 1 && $(".foyer #enfants div.picto.actif").length == 1) {
                $(this).removeClass('actif');
                nb_enfants = 0;
            }

            $(".foyer #enfants div.picto").removeClass('actif');

            for (i = 1; i <= nb_enfants; i++) {
                $(".foyer #enfants div.picto:eq(" + (i - 1) + ")").addClass('actif');
            }


            //$(this).toggleClass('actif');
            comptepoints();

        }
    });

    $(".tranchage > div").click(function () {

        if ($('.etape4').hasClass('active')) {

            $(".tranchage2").show(300);
            $(myiframe).css('height', 1470);

            $(".tranchage-btn").hide();
            $(".etape .cta").show();
            $('#main').css('padding-bottom', 0);
            var indice = ($(".tranchage > div").index($(this)));
            /**/
            if (indice > 2) {
                for (i = 0; i < $(".tranchage2 tr").length; i++) {
                    $(".tranchage2 tr").eq(i).find("td").eq(1).toggleClass('hide', true);
                    $(".tranchage2 tr").eq(i).find("td").eq(2).toggleClass('hide', true);
                    $(".tranchage2 tr").eq(i).find("td").eq(5).toggleClass('hide', false);
                    $(".tranchage2 tr").eq(i).find("td").eq(6).toggleClass('hide', false);
                }
            }
            else {
                for (i = 0; i < $(".tranchage2 tr").length; i++) {
                    $(".tranchage2 tr").eq(i).find("td").eq(1).toggleClass('hide', false);
                    $(".tranchage2 tr").eq(i).find("td").eq(2).toggleClass('hide', false);
                    $(".tranchage2 tr").eq(i).find("td").eq(5).toggleClass('hide', true);
                    $(".tranchage2 tr").eq(i).find("td").eq(6).toggleClass('hide', true);
                }
            }
            if (indice == ($(".tranchage > div").length - 1)) { $('.axafred_btn_sim p span').show(); } else { $('.axafred_btn_sim p span').hide(); }
            for (i = 0; i < $(".tranchage > div").length; i++) {
                if (i < indice + 1) {
                    for (j = 0; j < $(".tranchage2 tr").length; j++) {
                        $(".tranchage2 tr").eq(j).find("td").eq(i).toggleClass('gris', true);
                    }
                } else {
                    for (j = 0; j < $(".tranchage2 tr").length; j++) {
                        $(".tranchage2 tr").eq(j).find("td").eq(i).toggleClass('gris', false);
                    }
                }
            }
            /**/
            $(".tranchage > div").toggleClass('actif', false); $(this).toggleClass('actif', true);


            $('input[name="ta"]').val($('div.tranchage .actif>.age').html());


            var complementRetraite = "";
            switch ($('div.tranchage .actif>.age').html()) {
                default: //case "30-35":
                    $('input[name="cr1"]').val((rente.length >= 0 ? rente[0][r3] : ""));
                    $('input[name="cr2"]').val((rente.length >= 1 ? rente[1][r3] : ""));
                    $('input[name="cr3"]').val((rente.length >= 2 ? rente[2][r3] : ""));
                    $('input[name="cr4"]').val((rente.length >= 3 ? rente[3][r3] : ""));
                    break;
                case "35-40":
                    $('input[name="cr2"]').val((rente.length >= 1 ? rente[1][r3] : ""));
                    $('input[name="cr3"]').val((rente.length >= 2 ? rente[2][r3] : ""));
                    $('input[name="cr4"]').val((rente.length >= 3 ? rente[3][r3] : ""));
                    break;
                case "40-45":
                    $('input[name="cr3"]').val((rente.length >= 2 ? rente[2][r3] : ""));
                    $('input[name="cr4"]').val((rente.length >= 3 ? rente[3][r3] : ""));
                    break;
                case "45-50":
                    $('input[name="cr4"]').val((rente.length >= 3 ? rente[3][r3] : ""));
                    $('input[name="cr5"]').val((rente.length >= 4 ? rente[4][r3] : ""));
                    $('input[name="cr6"]').val((rente.length >= 5 ? rente[5][r3] : ""));
                    break;
                case "50-55":
                    $('input[name="cr5"]').val((rente.length >= 4 ? rente[4][r3] : ""));
                    $('input[name="cr6"]').val((rente.length >= 5 ? rente[5][r3] : ""));
                    break;
            }

        }

    });

    $(".profil>a").click(function () {
        $(".profil>a").toggleClass('active', false); $(this).toggleClass('active', true);
        changeProfil();
        $(".sous-reglette").slideUp(300); $(".sous-reglette." + $(this).attr('cible')).stop(true, false).slideDown(300);
    });

    $(".atouts ul li[cible]").click(function () {
        var cible = $(this).attr('cible');
        $(this).parent().find('li').toggleClass("actif", false);
        $(this).toggleClass("actif", true);
        $(this).parent().parent().find('.content > div').fadeOut(300);
        $(this).parent().parent().find('.content > .' + $(this).attr('cible')).fadeIn(300, "easeOutExpo");

        if (window.location != parent.location) {
            $('html, body', window.parent.document).animate({ scrollTop: $(this).parent().offset().top + $('iframe', window.parent.document).offset().top + 40 }, 500, "easeOutBack");
        } else {
            $('html, body').animate({ scrollTop: $(this).parent().offset().top + 40 }, 500, "easeOutBack");
        }
    });

    /*******************************************************************/
    if (window.location != parent.location) {
        $(".etape:not('.etape5')").click(function () {
            $('html, body', window.parent.document).animate({ scrollTop: $(this).offset().top + $('iframe', window.parent.document).offset().top - 25 }, 500, "easeOutBack");
            /*Mise a jour des values du systeme de tags*/
            if ($(this).hasClass('etape5')) {
                parent.tc_vars["etape_process"] = 'Simulateur_confirmation';
            }
        });
    } else {
        //$('body').css('padding','50px 0 50px 0');
        $(".etape").click(function () {
            $('html, body').animate({ scrollTop: $(this).offset().top - 25 }, 500, "easeOutBack");
        });
    }

    $(".sous-reglette").hide(0);
    $(".tranchage2").hide(0);
    /*$(".etape").hide(0);	$(".etape1").show(300);*/
    $(".etape1").addClass('active');


    comptepoints(); //getResult();
    resizeIframe();
    mobiletablet();
    $('body').click(function () {
        resizeIframe();
    });

    var from;

//    $('.cta a').click(function () {
    //    })

});
/*******************************************************************/
function buttonClick(queryString, from) {

    var ic = GetURLParameter('ic', queryString);
    var ca = GetURLParameter('ca', queryString);
    var pdva = GetURLParameter('pdva', queryString);
    var ia = GetURLParameter('ia', queryString);
    var user = GetURLParameter('user', queryString);
    var tc = GetURLParameter('tc', queryString);

    if (ic) {
        $('form.formulaireSimulateur').append("<input type='hidden' name='ic' value='" + ic + "'/>");
    }
    if (ca) {
        $('form.formulaireSimulateur').append("<input type='hidden' name='ca' value='" + ca + "'/>");
    }
    if (pdva) {
        $('form.formulaireSimulateur').append("<input type='hidden' name='pdva' value='" + pdva + "'/>");
    }
    if (ia) {
        $('form.formulaireSimulateur').append("<input type='hidden' name='ia' value='" + ia + "'/>");
    }
    if (user) {
        $('form.formulaireSimulateur').append("<input type='hidden' name='user' value='" + user + "'/>");
    }
    if (tc) {
        $('form.formulaireSimulateur').append("<input type='hidden' name='tc' value='" + tc + "'/>");
    }

    if (from == "simulateur") {
        try {
            launchTcEvents(this, 'CLICK', { 'LABEL': 'Retraite::simulateur::recevoir_gratuitement_ma_simulation_par_mail', 'XTCLICK_EVENT': 'C', 'XTCLICK_S2': '38', 'XTCLICK_TYPE': 'A' });
        }
        catch (e) {
            console.log(e);
        }
    }
    else {
        try {
            launchTcEvents(this, 'CLICK', { 'LABEL': 'Retraite::simulateur::faire_mon_bilan_retraite_avec_conseiller', 'XTCLICK_EVENT': 'C', 'XTCLICK_S2': '38', 'XTCLICK_TYPE': 'A' });
        }
        catch (e) {
            console.log(e);
        }
    }

    $('input[name="from"]').val(from);
    
    setTimeout(function(){
        $('form.formulaireSimulateur').submit();
    }, 500);
}

function GetURLParameter(sParam, queryString) {
    var sParameters = encodeURI(queryString);
    var sURLVariables = sParameters.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].substring(0, sURLVariables[i].indexOf('='));
        if (sParameterName == sParam) {
            var result = sURLVariables[i].substring(sURLVariables[i].indexOf('=') + 1);
            return decodeURIComponent(decodeURIComponent(result));
        }
    }
    return "";
}

function getResult(){

    var epargneSuggeree = "";

    if (profil_salarie > 0) {
        var nbpart_sur_revenus = perp[indice_part][r1];  /**/
        epargneSuggeree = Math.round((assiettePerp[r1] / 12));
        $('.epargnefoyer .montant').html(epargneSuggeree + ' €'); /**/
    }
    else {
        var nbpart_sur_revenus = madelin[indice_part][r1];  /**/
        epargneSuggeree = Math.round((assietteMadelin[r1] / 12));
        $('.epargnefoyer .montant').html(epargneSuggeree + ' €'); /**/
    }
	
	if(profil_salarie>0){ $('.tranchage2 .madelin').hide(100); $('.tranchage2 .perp').show(100); }
	else{ $('.tranchage2 .perp').hide(100); $('.tranchage2 .madelin').show(100); }


	for (i = 0; i < rente.length; i++) { $('.tranchage2 tr:eq(1) td').eq(i + 1).find('span').html(rente[i][r3] + ' €'); }
	
	if (profil_salarie == "1") $('input[name="tp"]').val('salarie');
	else $('input[name="tp"]').val('pro');
	
	
	var revenuNet = $("#amount1").html();
	var epargneMensuelle = $("#amount3").html();
	var economieImpot = nbpart_sur_revenus;
	if (economieImpot == "") economieImpot = "0";
	
	$('.cta .economie > span').html( economieImpot+' €');


	$('input[name="na"]').val($(".foyer #adultes div.actif").length);
	$('input[name="ne"]').val($(".foyer #enfants div.actif").length);
	$('input[name="rn"]').val(revenuNet.replace(/\s/g, "").replace(/€/g, ''));
	$('input[name="em"]').val(epargneMensuelle.replace(/\s/g, "").replace(/€/g, ''));
	$('input[name="ei"]').val(economieImpot);
	$('input[name="es"]').val(epargneSuggeree);
	
}

function comptepoints(){
	points = 0;
		if( $(".foyer #enfants div.actif").length == 0 ){ var enfantspoints = 0; }
		if( $(".foyer #enfants div.actif").length == 1 ){ var enfantspoints = 0.5; }
		if( $(".foyer #enfants div.actif").length == 2 ){ var enfantspoints = 1; }
		if( $(".foyer #enfants div.actif").length == 3 ){ var enfantspoints = 2; }
		if( $(".foyer #enfants div.actif").length == 4 ){ var enfantspoints = 3; }
	for(i=0; i<$(".foyer #adultes div.actif").length ; i++){
		points += parseFloat( $(".foyer #adultes div.actif").eq(i).attr('points') );
	}
	points += enfantspoints;
	$(".foyer #adultes span").html( $(".foyer #adultes div.actif").length +' Adulte(s)' );
	if($(".foyer #enfants div.actif").length > 3)
		$(".foyer #enfants span").html( $(".foyer #enfants div.actif").length +' Enfant(s) et plus' );
	else
		$(".foyer #enfants span").html( $(".foyer #enfants div.actif").length +' Enfant(s)' );
	
	
	
	
	
	if(points == 1) indice_part = 0;
	if(points == 1.5) indice_part = 1;
	if(points == 2) indice_part = 2;
	if(points == 2.5) indice_part = 3;
	if(points == 3) indice_part = 4;
	if(points == 4) indice_part = 5;
	if(points == 5) indice_part = 6;
		
	getResult();
}

function changeProfil(){
	profil_salarie = parseFloat($(".profil .active").attr("profilsalarie"));

	if (!profil_first_selected) {
        try {
            launchTcEvents(this, 'CLICK', { 'LABEL': 'Retraite::simulateur_entree', 'XTCLICK_EVENT': 'F', 'XTCLICK_S2': '38', 'XTCLICK_TYPE': '' });
        }
        catch (e) {
            console.log(e);
        }
	}

	profil_first_selected = true;

	getResult();
	//$(".etape2").show(300);
	//$(".etape2,.etape3,.etape4,.etape5").addClass('active');
	$(".etape2").addClass('active');
}

function resizeIframe(){
	
	if( window.location != parent.location ){
		var myiframe = window.parent.document.getElementById("simulateur");
		//setTimeout(function(){ $(myiframe).height($("body").height());},300);
		console.log($("body").height());
		setTimeout(function(){ 
			$(myiframe).stop(false,true,true).animate({height: $("body").height()}, 300);
		},500);
	}	
}

function mobiletablet(){
		
	if( window.location != parent.location ){
		if($('html, body', window.parent.document).width()<1025){
		  $("#main .slide .data .ui-slider").hide(0);
			$("#main .slide .amount").toggleClass("tablet",true);
			$("#main .slide").prepend('<span class="before"></span><span class="after"></span>');
			
			$("#main .slide .before").click(function(){
				var monslider = $(this).parent().find('.ui-slider');
				if($(monslider).slider("value")-1 >= $( monslider ).slider( "option", "min" ) ){ $( monslider ).slider("value",$( monslider ).slider("value")-1); }
			});
			$("#main .slide .after").click(function(){
				var monslider = $(this).parent().find('.ui-slider');
				if($(monslider).slider("value")+1 <= $( monslider ).slider( "option", "max" ) ){ $( monslider ).slider("value",$( monslider ).slider("value")+1); }
				
				if ($(this).parent().hasClass('epargnemois')) $(".etape5").addClass('active');
				
			});
		}
		//
	}else{
		if($('html, body').width()<1025) {
			$("#main .slide .data .ui-slider").hide(0);
			$("#main .slide .amount").toggleClass("tablet",true);
			$("#main .slide").prepend('<span class="before"></span><span class="after"></span>');
			
			$("#main .slide .before").click(function(){
				var monslider = $(this).parent().find('.ui-slider');
				if($(monslider).slider("value")-1 >= $( monslider ).slider( "option", "min" ) ){ $( monslider ).slider("value",$( monslider ).slider("value")-1); }
			});
			$("#main .slide .after").click(function(){
				var monslider = $(this).parent().find('.ui-slider');
				if($(monslider).slider("value")+1 <= $( monslider ).slider( "option", "max" ) ){ $( monslider ).slider("value",$( monslider ).slider("value")+1); }
			});
			
			
		}
	}
				
	
}