const User = require("../../models/User");

module.exports = {
  async getUserBySocialId(social_id) {
    console.log("Searching user by social_id:", social_id);
    return User.findOne({
      social_id: social_id,
    });
  },
  async getUserById(id) {
    return User.findById(id);
  },
  async createUser({ social_id, nickname, email }) {
    try {
      const user = await User.create({
        social_id,
        nickname,
        email,
        picture : "",
        highscore: 0, 
        total_15: 0, // 누적 전체 시도
        total_30: 0,
        correct_15 : 0,
        correct_30 : 0,
      });
      console.log("User created:", user); // 디버깅 로그
      return user;
    } catch (error) {
      console.error("Error creating user:", error); // 에러 확인
      throw error;
    }
  }
  
};
