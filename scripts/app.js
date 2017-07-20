// Initialize Firebase
var config = {
    apiKey: "AIzaSyDFDqdnF8RcyL7JkkH6ufVspweM4wLbhK4",
    authDomain: "jsr-database.firebaseapp.com",
    databaseURL: "https://jsr-database.firebaseio.com",
    projectId: "jsr-database",
    storageBucket: "jsr-database.appspot.com",
    messagingSenderId: "40677579376"
};

firebase.initializeApp(config);

$(document).ready(function() {

    function clearMessages() {
        var ul = $("#comments");
        ul.children().remove();
    }

    $('#messageForm').submit(function(event) {
        var messageAppReference = firebase.database();
        event.preventDefault();
        var message = $('#message').val();
        if (message == "") {
            return;
        }
        clearMessages();
        $('#message').val('');
        var messageReference = messageAppReference.ref('messages');
        messageReference.push({
            message: message,
            votes: 0
        });
    });

    $("#comments").on("click", ".delete_comment", function(){
        var messageAppReference = firebase.database();
        var comment = $(this).closest("li");
        var comment_id = comment.attr("id");
        clearMessages();
        deleteMessage(comment_id);
        // comment.remove();
    });

    function getMessages() {
        var messageAppReference = firebase.database();
        var messageReference = messageAppReference.ref("messages");
        messageReference.on('value', function(results) {
            results.forEach(function(message){
                var messageTxt = message.val().message;
                var tempLi = "<li id='" + message.getKey() + "'>" + messageTxt + "<a class='delete_comment'>x</a></li>";
                $("#comments").append(tempLi);
            });
        });
    }

    function updateMessage(id, votes, message) {
        var messageAppReference = firebase.database();
        var messageReference = messageAppReference.ref("messages").child(id);
        messageReference.update({
            message: message,
            votes: votes
        });
    }

    function deleteMessage(id) {
        var messageAppReference = firebase.database();
        var messageReference = messageAppReference.ref("messages/").child(id);
        messageReference.remove();
    }

    getMessages();

});