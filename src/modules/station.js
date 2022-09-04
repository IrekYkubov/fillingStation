import { Column } from './column';
import { RenderStation } from './renderStation';
export class Station {
  #queue = [];
  #filling = [];
  #ready = [];
  constructor(typeStation, renderApp = null) {
    this.typeStation = typeStation;
    this.renderApp = renderApp;
    this.renderStation = null;
  }

  get filling() {
    return this.#filling;
  }

  get queue() {
    return this.#queue;
  }
  init() {
    this.startGenerate();
    setInterval(() => {
      this.checkQueueToFilling();
    }, 2000);
  }
  startGenerate() {
    for (const optionStation of this.typeStation) {
      optionStation.count ? optionStation.count : optionStation.count = 1;
      for (let i = 0; i < optionStation.count; i++) {
        optionStation.speed ? optionStation.speed : optionStation.speed = 5;
        console.log(optionStation);
        this.#filling.push(new Column(optionStation.type, optionStation.speed));
      }
    }
    if (this.renderApp) {
      this.renderStation = new RenderStation(this.renderApp, this);
    }
  }
  checkQueueToFilling() {
    if (this.#queue.length) {
      for (let i = 0; i < this.#queue.length; i++) {
        for (let j = 0; j < this.#filling.length; j++) {
          if (!this.#filling[j].car &&
            this.#queue[i].typeFuel === this.#filling[j].type) {
            this.#filling[j].car = this.#queue.splice(i, 1)[0];
            this.fillingGo(this.#filling[j]);
            this.renderStation.renderStation();
            break;
          }
        }
      }
    }
  }
  fillingGo(column) {
    const car = column.car;
    const needPetrol = car.needPetrol;
    let nowTank = car.nowTank;
    const timerid = setInterval(() => {
      nowTank += column.speed;
      if (nowTank >= car.maxTank) {
        clearInterval(timerid);
        const total = car.nowTank - needPetrol;
        car.fillUp();
        column.car = null;
        this.leaveClient({car, total});
      }
    }, 1000);
    console.log(`Заправляем ${JSON.stringify(column)}`);
  }
  leaveClient({car, total}) {
    this.#ready.push(car);
    this.renderStation.renderStation();
  }
  addCarQueue(car) {
    this.#queue.push(car);
    this.renderStation.renderStation();
  }
}
