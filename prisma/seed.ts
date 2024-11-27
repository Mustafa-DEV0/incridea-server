import { hash } from "bcryptjs";

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const main = async () => {
  const college = await db.college.create({
    data: {
      name: "NMAM Institute of Technology",
      type: "ENGINEERING",
    },
  });
  const user = await db.user.create({
    data: {
      email: "test@incridea.in",
      name: "Test",
      password: await hash("asdfghjkl;'", 12),
      isVerified: true,
      role: "ADMIN",
      College: {
        connect: {
          id: college.id,
        },
      },
    },
  });

  const branch = await db.branch.create({
    data: {
      name: "CSE",
      details: "Computer Science and Engineering",
    },
  });

  const branchRep = await db.branchRep.create({
    data: {
      Branch: {
        connect: {
          id: branch.id,
        },
      },
      User: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  const event = await db.event.create({
    data: {
      name: "Test Event",
      category: "CORE",
      description: "Test Event Description",
      fees: 100,
      maxTeams: 10,
      minTeamSize: 2,
      maxTeamSize: 3,
      eventType: "INDIVIDUAL_MULTIPLE_ENTRY",
      image: "",
      published: true,
      venue: "Sadananda",
      Rounds: {
        create: {
          roundNo: 1,
        },
      },
      Branch: {
        connect: {
          id: branch.id,
        },
      },
    },
  });

  await db.organizer.create({
    data: {
      Event: {
        connect: {
          id: event.id,
        },
      },
      User: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  const teamMembers = [
    await db.user.create({
      data: {
        email: "user1@incridea.in",
        name: "User 1",
        password: await hash("asdfghjkl;'", 12),
        isVerified: true,
        role: "PARTICIPANT",
        collegeId: college.id,
      },
    }),
    await db.user.create({
      data: {
        email: "user2@incridea.in",
        name: "User 2",
        password: await hash("asdfghjkl;'", 12),
        isVerified: true,
        role: "PARTICIPANT",
        collegeId: college.id,
      },
    }),
  ];

  const team = await db.team.create({
    data: {
      name: "Test team",
      attended: false,
      confirmed: true,
      EventPaymentOrder: {
        create: {
          orderId: "",
          amount: 100,
          status: "SUCCESS",
          paymentData: { name: "Razorpay" },
        },
      },
      Event: {
        connect: {
          id: event.id,
        },
      },
      TeamMembers: {
        createMany: {
          data: Array.from(teamMembers, (member) => ({
            userId: member.id,
          })),
        },
      },
    },
  });
};

main().finally(() => {
  console.log("done");
});
