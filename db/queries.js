const pool = require("./pool");

async function createUser(
  firstName,
  lastName,
  email,
  password
) {
  await pool.query(
    `
      INSERT INTO users
      (
        first_name,
        last_name,
        email,
        password
      )
      VALUES
      ($1,$2,$3,$4)
    `,
    [firstName, lastName, email, password]
  );
}
async function getUserByEmail(email) {
    const{rows} = await pool.query(
        `
        SELECT * FROM users
        WHERE email = $1`,
        [email]
    );
    return rows[0];
    
}
async function getUserById(id) {

  const { rows } =
    await pool.query(
      `
        SELECT * FROM users
        WHERE id = $1
      `,
      [id]
    );

  return rows[0];
}
async function becomeMember(userId) {

  await pool.query(
    `
      UPDATE users
      SET membership_status = true
      WHERE id = $1
    `,
    [userId]
  );

}
async function createMessage(
  title,
  message,
  userId
) {

  await pool.query(
    `
      INSERT INTO messages
      (
        title,
        message_text,
        user_id
      )
      VALUES
      ($1,$2,$3)
    `,
    [
      title,
      message,
      userId
    ]
  );

}
async function becomeAdmin(
  userId
) {

  await pool.query(
    `
      UPDATE users
      SET is_admin = true
      WHERE id = $1
    `,
    [userId]
  );

}
async function deleteMessage(
  messageId
) {

  await pool.query(
    `
      DELETE FROM messages
      WHERE id = $1
    `,
    [messageId]
  );

}
async function getAllMessages() {

  const { rows } =
    await pool.query(
      `
        SELECT
          messages.id,
          messages.title,
          messages.message_text,
          messages.created_at,

          users.first_name,
          users.last_name,
          users.membership_status

        FROM messages

        JOIN users
        ON messages.user_id = users.id

        ORDER BY messages.created_at DESC
      `
    );

  return rows;

}

module.exports = {
  getAllMessages,deleteMessage,createUser,becomeAdmin,createMessage,getUserByEmail,getUserById,becomeMember,
};