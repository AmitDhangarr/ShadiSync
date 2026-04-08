import JWT from "jsonwebtoken";
import dotenv from "dotenv";

class JWTAuthentication {
  token = null;
  secret = null;
  payload = {};

  constructor() {
    this.setConfiguration();
  }

  setConfiguration() {
    dotenv.config({ path: "./.env" });
    this.secret = process.env.SECRET;
  }

  setToken(payload) {
    return JWT.sign({ payload: payload }, this.secret);
  }

  getToken(token) {
    return JWT.verify(token, this.secret);
  }
}

const JwtToken = new JWTAuthentication();

export default JwtToken;
