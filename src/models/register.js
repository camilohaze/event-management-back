class Register {
  username;
  password;
  firstName;
  lastName;
  phone;

  constructor(username, password, firstName, lastName, phone) {
    this.username = username;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
  }
}

module.exports = Register;
