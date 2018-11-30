module.exports = class Timer {

    constructor(hours = 0, minutes = 0, seconds = 0) {
        this.step = 2;
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
        this.callbackDecrease = null;
        this.callbackStop = null;
    }

    decrease(timer = this) {
        if(timer.seconds >= timer.step) {
            timer.seconds -= timer.step;
        }
        else {
            if(timer.minutes != 0) {
                timer.seconds = timer.seconds + 60 - timer.step;
                timer.minutes--;;
            }
            else {
                if(timer.hours != 0) {
                    timer.seconds = timer.seconds + 60 - timer.step;
                    timer.minutes = 59;
                    timer.hours--;
                }
                else {
                    timer.set0();
                    timer.stop();
                }
            }
        }

        if(typeof timer.callbackDecrease === 'function') {
            timer.callbackDecrease();
        }
    }

    set0() {
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
    }

    getStr() {
        return ('0'+this.hours).slice(-2) + ':' + ('0'+this.minutes).slice(-2) + ':' + ('0'+this.seconds).slice(-2);
    }

    start() {
        this.interval = setInterval(
            this.decrease.bind(null, this),
            this.step * 1000
        );
    }

    stop() {
        clearInterval(this.interval);

        if(typeof this.callbackStop === 'function') {
            this.callbackStop();
        }
    }
}