const User = require("../../models/User");

module.exports = {
  async getUserBySocialId(social_id) {
    return User.findOne({
      social_id: social_id,
    });
  },
  async getUserById(id) {
    return User.findById(id);
  },
  async createUser({ social_id, nickname, email }) {
    return User.create({
      social_id,
      nickname,
      email,
    });
  },
  async updateUser({ social_id, nickname, email }) {
    return User.updateOne({ social_id }, { nickname, email });
  },
};
