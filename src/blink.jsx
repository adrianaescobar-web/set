const {Board, Led } = require('johnny-five');

let startBoard = () => {
    const board=Board();
    try {
       board.on('ready', () => {
        let led = new Led(13);
        led.blink(1500);
        }); 
    } catch (error) {
        console.log(error);
    }
    
}

export default startBoard;

