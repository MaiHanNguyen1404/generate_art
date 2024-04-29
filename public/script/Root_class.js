// Create a class for the root 
export class Root {
    constructor (x,y){
        this.x = x;
        this.y = y;
        this.ctx = ctx;

        this.speedX = 2;
        this.speedY = 2;

        this.size = 5;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        this.size +=0.1;

        if (this.size < 100){
            ctx.fillStyle = 'black';
            ctx.fillRect (this.x, this.y, this.size, this.size);
            requestAnimationFrame (this.update.bind(this))
        }
    }
}