"use strict";

var connection =                                                                    //Préparation d'une variable réceptionnant notre HUB
    new signalR                                                                     //Appel de SignalR pour la création de l'objet du Hub
    .HubConnectionBuilder()                                                         //Appel du Builder pour préparation de l'objet du Hub
    .withUrl('/chatHub')                                                            //Assignation de infos nécessaire à la génération du Hub, ici c'est l'URL correspondant au endpoint défini dans le startup.cs
    .build();                                                                       //génération de l'objet du Hub avec les informations enregistrées

var cpt = 0;
document.getElementById("compteur").innerHTML = cpt;
document.getElementById("sendButton").disabled = true;

document.getElementById("sendButton")                                               //Selectionne l'objet qui sera soumis à un évènement
    .addEventListener("click", function (event) {                                   //Définition du type d'évènement déclencheur "click" dans notre cas, et de la fonction à appliquer lors de l'évènement
        var user = document.getElementById("userInput").value;                      //récupération de la valeur du pseudo
        var message = document.getElementById("messageInput").value;                //récupération de la valeur du pseudo
        connection.invoke("SendMessage", user, message)                             //On défini l'action que devra faire notre Hub lors de l'évènement
                                                                                    //"SendMessage" est le nom de la méthode du Hub à déclencher, par la suite il se doit d'être accompagné des différents paramètres nécessaire au fonctionnement de la méthode 
            .then(function () {
                connection.invoke("GetNotification");
            })
            .catch(function (err) {                                                 //la fonction catch permet de réceptionner une erreur JS et de définir une fonction avec les informations de celle-ci
            console.error(err.toString());                                          //Equivalant au console.log mais sous format d'erreur
            });

        event.preventDefault();                                                     //event est le paramètre passer dans notre fonction de l'évènement qui a pour but de récupérer les informations concernant celui-ci
                                                                                    //preventDefault() est une fonction de l'évènement spécifiant au navigateur de ne pas utiliser les comportement par défaut de l'objet de l'évènement
});

connection.start().then(function () {
    console.log("Connecté!");
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    console.error(err.toString());
})

connection.on("ReceiveMessage", function (user, message) {
    var msg = message
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    var layoutMsg = user + " : " + msg;
    var msgLI = document.createElement("li");
    msgLI.textContent = layoutMsg;
    document.getElementById("messagesList").appendChild(msgLI);
})

connection.on("CountMessage", function () {
    cpt++;
    document.getElementById("compteur").innerHTML = cpt;
})

//un HUB SignalR en JS contient les méthodes :
//start() : établis la connection avec le Hub de notre ASP grace à l'URL donnée lors de la génération
//invoke(nomMéthodeHub: string, paramMethodeHub: any, paramMethodeHub: any, ... ) : appel une méthode asynchrone de notre Hub et envois les paramètres nécessaire à son fonctionnement
//on(nomEvenement: string, fonction: function): 