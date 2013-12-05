var events = require( "events" );

var constants = require("./constants");
events.EventEmitter.call(this);

var sqlite3 = require('sqlite3').verbose();

var questions = new Array();



var Quiz = function() {
    var self = this;
    this.currentQuestion;
    self.autoquiz = false;

    Quiz.prototype.init = function() {
        self.getQuestions();
    }
    Quiz.prototype.startAutoQuiz = function() {
        if (!self.autoquiz) {
            self.autoquiz = true;
            self.startQuestionTimer();
        }
    }
    self.startQuestionTimer = function() {
        if (self.autoquiz) {
            var q = self.getRandomQuestion();
            self.emit("newquestion",q);
            setTimeout(self.timeup,constants.QUESTIONTIMELIMIT+1000);
        }
    }
    self.timeup = function()  {
        console.log("TIMES UP");
        self.emit("questiontimeup");
        setTimeout(self.startQuestionTimer,3000);
    }



    Quiz.prototype.getRandomQuestion = function() {
        if (questions.length >0) {
            var q = new Question();
            q.asked = true;
            while(q.asked) {
                q = questions[Math.floor(Math.random()*questions.length)];
            }
            q.asked = true;
            console.log(q);
            self.currentQuestion = q;

            q.timelimit = constants.QUESTIONTIMELIMIT;


            return q;
        } else {
            return false;
        }
    }
    Quiz.prototype.getQuestions = function() {
        var db = new sqlite3.Database('questions.db');
        db.serialize(function() {
            db.each("SELECT id, question,answer_1, answer_2, answer_3 , answer_4 , answer_number FROM questions", function(err, row) {
                //console.log(row.id + ": " + row.question);
                var q = new Question();
                q.question = row.question;
                q.a1 = row.answer_1;
                q.a2 = row.answer_2;
                q.a3 = row.answer_3;
                q.a4 = row.answer_4;
                q.aid = row.answer_number;
                q.id = row.id;
                questions.push(q);
            },function(){
                console.log(questions.length);
                self.emit("gotquestions");
            });
            db.close();
//    db.each("SELECT COUNT(id) as count FROM questions", function(err, row) {
//        console.log(row.count);
//    });

        });

    }

}

Quiz.prototype = new events.EventEmitter;
module.exports = Quiz;

Question = function() {
    this.question = '';
    this.id = 0;
    this.a1 = '';
    this.a2 = '';
    this.a3 = '';
    this.a4 = '';
    this.asked = false;
    this.aid = 0;
}
