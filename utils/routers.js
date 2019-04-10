class Routers {

  constructor(routers) {
    this.routers = routers;
  }

  find (id) {
    return this.routers.filter(function (value, index) {
      return value.id === id;
    }).pop();
  }

  delete (idx) {
    return this.routers.filter(function (value, index) {
      return parseInt(idx) !== index;
    });
  }

  add (route) {
    this.routers.push(route);
    return this.routers;
  }

  get () {
    return this.routers;
  }

}

module.exports = Routers;
