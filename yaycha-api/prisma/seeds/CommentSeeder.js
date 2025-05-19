const { PrismaClient } = require("@prisma/client");
const { faker, GitModule } = require("@faker-js/faker");
const content = require("../../routers/content");

const prisma = new PrismaClient();
async function CommentSeeder() {
   const users = await prisma.user.findMany({ select: { id: true } });
   const posts = await prisma.post.findMany({ select: { id: true } });

   if (users.length === 0 || posts.length === 0) {
      console.log(" No users or posts found. Seed users and posts first.");
      return;
   }

   const data = [];

   for (let i = 0; i < 40; i++) {
      const userId = users[Math.floor(Math.random() * users.length)].id;
      const postId = posts[Math.floor(Math.random() * posts.length)].id;

      data.push({
         content: faker.lorem.paragraph(),
         userId,
         postId,
      });
   }

   console.log("Comment seeding started...");

   try {
      for (const comment of data) {
         await prisma.comment.create({ data: comment });
      }
   } catch (err) {
      console.error(" Failed to seed comments:", err);
   }

   console.log("Comment seeding done.");
}

module.exports = { CommentSeeder };