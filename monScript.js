/////////////////////////////////////////////////////////////////
//-------------------Définition des classes -------------------//
/////////////////////////////////////////////////////////////////
class Pizza {
	constructor(nom, ingredients, tarif) {
		this.nom = nom;
		this.ingredients = ingredients;
		this.tarif = tarif;
	}
}



/////////////////////////////////////////////////////////////////
//----------------get/déclaration des éléments-----------------//
/////////////////////////////////////////////////////////////////
const ingredientButtons = document.getElementsByClassName("ingredient");
const aufourButton = document.getElementById("aufour");
const poubelleButton = document.getElementById("poubelle");
const creditDiv = document.getElementById("credit");
const commandeDiv = document.getElementById("commande");
const preparationDiv = document.getElementById("preparation");
const cuissonProgressBarDiv = document.getElementById("myBar");
const progresBarDiv = document.getElementById("progressBar");
const fourUpgradeButton = document.getElementById("fourUpgradeButton");

const classiquePizza = new Pizza("classique", ["Pâte", "Sauce", "Mozzarella"], 5);
const pepperoniPizza = new Pizza("pepperoni", ["Pâte", "Sauce", "Mozzarella", "Pepperoni"], 6);
const royalPizza = new Pizza("royal", ["Pâte", "Sauce", "Mozzarella", "Olives", "Jambon"], 6);

const menu = [classiquePizza, pepperoniPizza, royalPizza];



//Initialiser le tableau de préparation, le crédit et la commande
let preparationTab = [];
let credit = parseInt(getCookie("credit"));
let vitesseDeCuisson = parseInt(getCookie("vitesseDeCuisson"));
let pizzaCommande = menu[Math.floor(Math.random()*menu.length)];

creditDiv.innerHTML = "Crédit : " + credit + "euros";
commandeDiv.innerHTML = "Commande : " + pizzaCommande.nom;
/////////////////////////////////////////////////////////////////
//--------------fin get/déclaration des éléments---------------//
/////////////////////////////////////////////////////////////////





/////////////////////////////////////////////////////////////////
//-----------------------les fonctions-------------------------//
/////////////////////////////////////////////////////////////////
function isPreparationCorrect(preparationArray, commandeArray){
	if(preparationArray.length == commandeArray.length){
		for (element of preparationArray){
			if(commandeArray.indexOf(element) == -1){
				return false;
			}
		}
		return true;
	}else{
		return false;
	}
}

function cuisson(pizzaCommande,vitesseDeCuisson){
	let width = 0;
	aufourButton.disabled = true; //évider de passer un deuxième pizza au four quand la four est occupée

	intervalID = setInterval(function(){
		if(width<100){
			width+=vitesseDeCuisson;
			cuissonProgressBarDiv.style.width = width + '%';
		}else{
			clearInterval(intervalID);
			console.log("Cuisson terminé!!!")
			credit = credit + pizzaCommande.tarif;  //mettre à jour la variable crédit
			creditDiv.innerHTML = "Crédit : " + credit + "euros"; //mettre à jour le Div de crédit
			aufourButton.disabled = false;
			cuissonProgressBarDiv.style.width = "0%";
		}
	}, 100-vitesseDeCuisson*10)
}

function setCookie(cname, cvalue, exdays){
	let d = new Date();
	d.setTime(d.getTime()+(exdays*24*60*60*1000));
	let expires = "expires="+d.toUTCString();
	document.cookie = cname+"="+cvalue+";"+expires+";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function sauvegarde(){
	setInterval(function(){
		setCookie("credit", credit, 2);
		setCookie("vitesseDeCuisson", vitesseDeCuisson,2);
	},5000);
}
/////////////////////////////////////////////////////////////////
//---------------------fin des fonctions-----------------------//
/////////////////////////////////////////////////////////////////

sauvegarde();

//Cela permet d'ajouter les ingredients en cliquant les boutons
//et les affichier dans la liste de préparation
for(let i =0;i<ingredientButtons.length;i++)
{
	ingredientButtons[i].addEventListener("click",function(){
		const ingredientName = ingredientButtons[i].innerHTML;
		preparationTab.push(ingredientName);
		preparationString = "";

		for (const ingredient of preparationTab) {
			preparationString = preparationString + " " + ingredient;
		}
		preparationDiv.innerHTML = preparationString;
	})
}

//Quand on sert le plat au client...
aufourButton.addEventListener("click",function(){
	console.log("Au four!");

	//On vérifie si le joueur a fait correctement le pizza qu'on a commandé
	if(isPreparationCorrect(preparationTab, pizzaCommande.ingredients)){

		console.log("Préparation est correcte!");
		cuisson(pizzaCommande, vitesseDeCuisson);
		//la mise à jour de la variable crédit et le Div crédit est effectuée dans la fonction cuisson()

	}else{
		console.log("T'as fait la merde! Boulet!")
		credit = credit - pizzaCommande.tarif*0.5;
		creditDiv.innerHTML = "Crédit : " + credit + "euros";
	}

	//Un pizza est servi, on met à jour la commande, le crédit et vider le tableau de préparation
	preparationTab.length = 0;
	preparationDiv.innerHTML = "";

	pizzaCommande = menu[Math.floor(Math.random()*menu.length)];
	commandeDiv.innerHTML = 'Commande: ' + pizzaCommande.nom;
})

//On peut jeter au poubelle la préparation si elle est errorée
poubelleButton.addEventListener("click", function(){
	console.log("poubelle!");
	preparationTab.length = 0;
	preparationDiv.innerHTML = "";
})

fourUpgradeButton.addEventListener("click", function(){
	console.log("fourUpgradeButton");
	if(vitesseDeCuisson<=8)
	{
		if(credit>=50){
			vitesseDeCuisson++;
			credit-=50;
			creditDiv.innerHTML = "Crédit : " + credit + "euros";
		}else{
			let notificationDiv = document.getElementById("notification");
			notification.innerHTML = "Votre crédit n'est pas suiffisant!"
			if(notificationDiv.style.display == "none"){
				notificationDiv.style.display = "initial";
				setTimeout(function(){notificationDiv.style.display = "none";},1500);
			}
		}
	}else{
		notification.innerHTML = "La vitesse est au maximum!";
	}
})

