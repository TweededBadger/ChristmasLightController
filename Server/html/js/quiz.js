var Quiz = function () {
    this.sounds;
    this.currentquestion;
    this.questionholder = $("#questionText");
    this.answerholder = $("#answerButtons");
    this.selectedAnswer = 0;
    this.allowSelection = false;
    this.userstatus;
    this.setupListeners();

}

Quiz.prototype.deselectall = function () {
    var self = this;
    $(".qbutton").removeClass('active');
    $(".qbutton").removeClass("btn-success");
    $(".qbutton").removeClass("btn-warning");

}
Quiz.prototype.setupListeners = function () {
    var self = this;
 this.answerholder.delegate("button", "click", function (event) {
     event.stopPropagation(); event.preventDefault();
 //this.answerholder.on("button", "click", function () {
   // $("#answerButtons button").live("click", function () {
        console.log(self.allowSelection);
        if (self.allowSelection) {
            sounds.playsound("click");
            self.selectedAnswer = $(this).data('aid');
            self.deselectall();

            $(self).trigger( "selectedanswer", self.selectedAnswer);

            $(this).addClass('active');
        }
    });
}
Quiz.prototype.answer = function (data) {
    var self = this;
    //console.log(data);
    //console.log(self.currentQuestion);

    if (data.id == self.currentQuestion.id) {
        $(".answer .ab" + data.aid).addClass("btn-success");
        if (data.aid != self.selectedAnswer) {
            console.log("WRONG ANSWER!!")
            var tb = ".answer .ab" + self.selectedAnswer;
            console.log(tb);
            $(tb).addClass("btn-danger");
            sounds.playsound("wrong");
        } else {
            sounds.playsound("correct");
        }
    }

    self.allowSelection = false;

}

Quiz.prototype.reset = function () {
    var self = this;
    self.selectedAnswer = 0;
}
Quiz.prototype.newQuestion = function (qdata) {
    var self = this;

    if (self.userstatus.data.quizlives == 0) {
        this.questionholder.html("Oh well. Better luck next time!");
        this.answerholder.html("");
    } else {
        self.currentQuestion = qdata;
        self.deselectall();
        console.log(qdata);
        self.selectedAnswer = 0;
        self.allowSelection = true;
        //this.questionholder.html(qdata.question);
        this.questionholder.html("");
        var qtext = "";
        for (var i = 1; i < 5; i++) {
            var q = qdata["a" + i];
            qtext += '<div class="answer"><button type="button" class="qbutton btn btn-default ab' + i + '" data-aid=' + i + '>' + q + '</button></div>';
        }
        this.answerholder.html(qtext);

        $("#timebar").css("width", $(".progress").width());

        $("#timebar").animate({
            width: 0
        },self.currentQuestion.timelimit,"linear",function() {
            console.log("TIMES UP");
            self.allowSelection = false;
            sounds.stopsound("ticktock")
        });


        sounds.playsound("ticktock")

    }
}

Quiz.prototype.checkUserStatus = function (data) {
    var self = this;
    console.log("checkUserStatus");
    console.log(data);
    self.userstatus = data;
    var livestr = "";
    for (var i = 0; i < self.userstatus.data.quizlives; i++) {
        livestr += '<span class="glyphicon glyphicon-heart"></span> ';
    }
    for (var j = 0; j < 3-self.userstatus.data.quizlives; j++) {
        livestr += '<span class="glyphicon glyphicon-heart-empty"></span> ';
    }
    $("#livesholder").html(livestr);


}





