var Sounds = function() {
    this.addedsounds = new Object();

    this.registerSound("ticktock",true);
    this.registerSound("click");
    this.registerSound("correct");
    this.registerSound("wrong");
    this.registerSound("death");
    this.registerSound("phone");

}



Sounds.prototype.registerSound = function(filename,loop) {
    var self = this;
    var sound = new Howl({
        urls:['./sounds/'+filename+'.mp3', './sounds/'+filename+'.ogg', './sounds/'+filename+'.wav']
    });
    sound.loop(loop);

    self.addedsounds[filename] = sound;
}

Sounds.prototype.playsound = function(name,loop) {
    var self = this;
    var sound = self.addedsounds[name];
    if (sound) {
        sound.play();
        return true;
    }


}
Sounds.prototype.stopsound = function(name,loop) {
    var self = this;
    var sound = self.addedsounds[name];
    if (sound) {
        sound.stop();
    }
}