export default class Vertex {
    constructor(_x, _y) {
        this.x = _x;
        this.y = _y;

        this.move = this.move.bind(this);
    }

    move(direction, unit) {
        switch(direction) {
            case "up":
                this.y -= unit;
                break;
            case "down":
                this.y += unit;
                break;
            case "left":
                this.x -= unit;
                break;
            case "right":
                this.x += unit;
                break;
            default:
                console.log("Vertex::move::invalid direction");
                break;
        }
    }
}
