// Closure

const counter = (function () {
  let count = 0;
  return function () {
    count += 1;
    return count;
  };
})();

class uniqueId {
  constructor() {
    // Variable "count" is from outer lexical environment of an anonymous function,
    // returned by closure "counter()". is incremented and new value is returned to be used as unique ID
    this.id = counter();
  }
}

export default class User extends uniqueId {
  constructor({ id, name, username, email, address, phone, website, company }) {
    super();
    this.name = name;
    this.username = username;
    this.email = email;
    this.address = address;
    this.phone = phone;
    this.website = website;
    this.company = company;
  }
  // Method 1 - getter is invoked by u1.lastName
  get lastName() {
    return this.name.split(' ').pop();
  }
  // Method 2 - is invoked by u1.toString() and returns "name (e-mail)"
  toString() {
    return `${this.name} (${this.email})`;
  }
  // Method 3 - static method applied to a class and can be used to calculate distance
  // between 2 users which are instances of that class: user.distance(u1, u2) returns distance in meters
  static distance(user1, user2) {
    const lat1 = user1.address.geo.lat;
    const lon1 = user1.address.geo.lng;
    const lat2 = user2.address.geo.lat;
    const lon2 = user2.address.geo.lng;
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // in metres
    return d;
  }
}
