const { PrismaClient } = require("@prisma/client");
const { faker, GitModule } = require("@faker-js/faker");

const prisma = new PrismaClient();

async function LikeSeeder() {
    console.log("Post like seeding started...");

    const users = await prisma.user.findMany({ select: { id: true } });
    const posts = await prisma.post.findMany({ select: { id: true } });

    if (users.length === 0 || posts.length === 0) {
        console.log("No users or posts found. Seed users and posts first.");
        return;
    }

    for (let i = 0; i < 5; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        const post = posts[Math.floor(Math.random() * posts.length)];

        try {
            await prisma.postLike.create({
                data: {
                    userId: user.id,
                    postId: post.id,
                },
            });
        } catch (error) {
            console.error("Failed to create postLike:", error.message);
        }
    }

    console.log("Post like seeding done.");
}

module.exports = { LikeSeeder };