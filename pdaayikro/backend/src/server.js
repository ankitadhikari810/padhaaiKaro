const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = Number(process.env.PORT) || 5057;

app.use(cors());
app.use(express.json());

function isoToday() {
  return new Date().toISOString().slice(0, 10);
}

function dayDiff(fromIso, toIso) {
  const from = new Date(`${fromIso}T00:00:00Z`);
  const to = new Date(`${toIso}T00:00:00Z`);
  return Math.round((to - from) / 86400000);
}

function addDays(iso, days) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

async function getOrResetDaily(userId) {
  const today = isoToday();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      streakCount: true,
      streakLastDate: true,
      dailyActiveSeconds: true,
      dailyActiveDate: true,
    },
  });

  if (!user) return null;

  if (user.dailyActiveDate !== today) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        dailyActiveDate: today,
        dailyActiveSeconds: 0,
      },
      select: {
        id: true,
        streakCount: true,
        streakLastDate: true,
        dailyActiveSeconds: true,
        dailyActiveDate: true,
      },
    });
  }

  return user;
}

async function ensureBreakReset(user) {
  const today = isoToday();
  if (!user?.streakLastDate) return { user, resetToZero: false };
  const diff = dayDiff(user.streakLastDate, today);
  if (diff >= 2 && user.streakCount !== 0) {
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { streakCount: 0 },
      select: {
        id: true,
        streakCount: true,
        streakLastDate: true,
        dailyActiveSeconds: true,
        dailyActiveDate: true,
      },
    });
    return { user: updated, resetToZero: true };
  }
  return { user, resetToZero: false };
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

app.post("/api/users", async (req, res) => {
  return res.status(410).json({
    error: "This endpoint is deprecated. Use /api/auth/register instead.",
  });
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      preparationGoal,
      currentClass,
      studyLevel,
      previousPercentage,
    } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res
        .status(400)
        .json({ error: "fullName, email, phone, and password are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const parsedPercentage = Number(previousPercentage);
    if (Number.isNaN(parsedPercentage) || parsedPercentage < 0 || parsedPercentage > 100) {
      return res
        .status(400)
        .json({ error: "previousPercentage must be a number between 0 and 100" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        phone,
        password: passwordHash,
        preparationGoal,
        currentClass,
        studyLevel,
        previousPercentage: parsedPercentage,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        preparationGoal: true,
        currentClass: true,
        studyLevel: true,
        previousPercentage: true,
        streakCount: true,
        streakLastDate: true,
        dailyActiveSeconds: true,
        dailyActiveDate: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      message: "Registration successful",
      user,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Email already registered" });
    }

    return res.status(500).json({ error: "Failed to register user" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        password: true,
        preparationGoal: true,
        currentClass: true,
        studyLevel: true,
        previousPercentage: true,
        streakCount: true,
        streakLastDate: true,
        dailyActiveSeconds: true,
        dailyActiveDate: true,
      },
    });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const { user: normalizedUser } = await ensureBreakReset(user);
    const today = isoToday();
    const freshDaily =
      normalizedUser.dailyActiveDate !== today
        ? await prisma.user.update({
            where: { id: normalizedUser.id },
            data: { dailyActiveDate: today, dailyActiveSeconds: 0 },
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
              preparationGoal: true,
              currentClass: true,
              studyLevel: true,
              previousPercentage: true,
              streakCount: true,
              streakLastDate: true,
              dailyActiveSeconds: true,
              dailyActiveDate: true,
            },
          })
        : {
            id: normalizedUser.id,
            fullName: normalizedUser.fullName,
            email: normalizedUser.email,
            phone: normalizedUser.phone,
            preparationGoal: normalizedUser.preparationGoal,
            currentClass: normalizedUser.currentClass,
            studyLevel: normalizedUser.studyLevel,
            previousPercentage: normalizedUser.previousPercentage,
            streakCount: normalizedUser.streakCount,
            streakLastDate: normalizedUser.streakLastDate,
            dailyActiveSeconds: normalizedUser.dailyActiveSeconds,
            dailyActiveDate: normalizedUser.dailyActiveDate,
          };

    return res.json({
      message: "Login successful",
      user: {
        ...freshDaily,
      },
    });
  } catch (_error) {
    return res.status(500).json({ error: "Failed to login" });
  }
});

app.get("/api/tasks", async (req, res) => {
  const userId = Number(req.query.userId);
  const dueDate = typeof req.query.date === "string" ? req.query.date : null;
  const includeCompleted = String(req.query.includeCompleted || "false") === "true";

  if (!userId) return res.status(400).json({ error: "userId is required" });

  try {
    const where = {
      userId,
      ...(dueDate ? { dueDate } : {}),
      ...(includeCompleted ? {} : { status: { not: "completed" } }),
    };

    const tasks = await prisma.task.findMany({
      where,
      orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
      select: { id: true, userId: true, title: true, dueDate: true, status: true, createdAt: true },
    });

    return res.json(tasks);
  } catch (_error) {
    return res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

app.post("/api/tasks", async (req, res) => {
  const { userId, title, dueDate } = req.body || {};
  const parsedUserId = Number(userId);
  const trimmedTitle = String(title || "").trim();
  const parsedDueDate = String(dueDate || "").trim();

  if (!parsedUserId) return res.status(400).json({ error: "userId is required" });
  if (!trimmedTitle) return res.status(400).json({ error: "title is required" });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(parsedDueDate)) return res.status(400).json({ error: "dueDate must be YYYY-MM-DD" });

  try {
    const task = await prisma.task.create({
      data: { userId: parsedUserId, title: trimmedTitle, dueDate: parsedDueDate },
      select: { id: true, userId: true, title: true, dueDate: true, status: true, createdAt: true },
    });
    return res.status(201).json(task);
  } catch (_error) {
    return res.status(500).json({ error: "Failed to create task" });
  }
});

app.patch("/api/tasks/:id", async (req, res) => {
  const taskId = Number(req.params.id);
  const { userId, action } = req.body || {};
  const parsedUserId = Number(userId);
  if (!taskId) return res.status(400).json({ error: "Invalid task id" });
  if (!parsedUserId) return res.status(400).json({ error: "userId is required" });

  try {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task || task.userId !== parsedUserId) return res.status(404).json({ error: "Task not found" });

    const today = isoToday();
    let data = {};
    if (action === "complete") data = { status: "completed" };
    else if (action === "reopen") data = { status: "pending" };
    else if (action === "shiftTomorrow") data = { dueDate: addDays(task.dueDate || today, 1), status: "pending" };
    else if (action === "shiftToday") data = { dueDate: today, status: "pending" };
    else return res.status(400).json({ error: "Unknown action" });

    const updated = await prisma.task.update({
      where: { id: taskId },
      data,
      select: { id: true, userId: true, title: true, dueDate: true, status: true, createdAt: true },
    });

    return res.json(updated);
  } catch (_error) {
    return res.status(500).json({ error: "Failed to update task" });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  const taskId = Number(req.params.id);
  const userId = Number(req.query.userId);
  if (!taskId) return res.status(400).json({ error: "Invalid task id" });
  if (!userId) return res.status(400).json({ error: "userId is required" });

  try {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task || task.userId !== userId) return res.status(404).json({ error: "Task not found" });
    await prisma.task.delete({ where: { id: taskId } });
    return res.json({ ok: true });
  } catch (_error) {
    return res.status(500).json({ error: "Failed to delete task" });
  }
});

app.get("/api/streak/:userId", async (req, res) => {
  const userId = Number(req.params.userId);
  if (!userId) return res.status(400).json({ error: "Invalid userId" });

  try {
    const daily = await getOrResetDaily(userId);
    if (!daily) return res.status(404).json({ error: "User not found" });

    const { user: normalizedUser, resetToZero } = await ensureBreakReset(daily);
    const today = isoToday();
    const qualifiedToday = (normalizedUser.dailyActiveDate === today ? normalizedUser.dailyActiveSeconds : 0) >= 900;
    const started = Boolean(normalizedUser.streakLastDate) || normalizedUser.streakCount > 0;

    return res.json({
      userId: normalizedUser.id,
      streakCount: normalizedUser.streakCount,
      streakLastDate: normalizedUser.streakLastDate,
      dailyActiveSeconds: normalizedUser.dailyActiveSeconds,
      dailyActiveDate: normalizedUser.dailyActiveDate,
      qualifiedToday,
      started,
      resetToZero,
    });
  } catch (_error) {
    return res.status(500).json({ error: "Failed to fetch streak" });
  }
});

app.post("/api/activity", async (req, res) => {
  const { userId, seconds = 0, source = "general" } = req.body || {};
  const parsedUserId = Number(userId);
  const parsedSeconds = Number(seconds);
  if (!parsedUserId) return res.status(400).json({ error: "userId is required" });
  if (!Number.isFinite(parsedSeconds) || parsedSeconds <= 0) {
    return res.status(400).json({ error: "seconds must be a positive number" });
  }

  try {
    const daily = await getOrResetDaily(parsedUserId);
    if (!daily) return res.status(404).json({ error: "User not found" });

    const { user: normalizedUser, resetToZero } = await ensureBreakReset(daily);
    const today = isoToday();

    const updatedDaily = await prisma.user.update({
      where: { id: parsedUserId },
      data: {
        dailyActiveSeconds: Math.min(86400, normalizedUser.dailyActiveSeconds + Math.floor(parsedSeconds)),
        dailyActiveDate: today,
      },
      select: {
        id: true,
        streakCount: true,
        streakLastDate: true,
        dailyActiveSeconds: true,
        dailyActiveDate: true,
      },
    });

    const qualifiedNow = updatedDaily.dailyActiveSeconds >= 900;
    const alreadyCountedToday = updatedDaily.streakLastDate === today;
    let streakUpdated = false;
    let streakBroke = resetToZero;

    if (qualifiedNow && !alreadyCountedToday) {
      const prev = updatedDaily.streakLastDate;
      let nextCount = updatedDaily.streakCount;

      if (!prev || updatedDaily.streakCount === 0) {
        nextCount = 1;
      } else {
        const diff = dayDiff(prev, today);
        if (diff === 1) nextCount = updatedDaily.streakCount + 1;
        else if (diff >= 2) {
          nextCount = 1;
          streakBroke = true;
        }
      }

      const streakSaved = await prisma.user.update({
        where: { id: parsedUserId },
        data: { streakCount: nextCount, streakLastDate: today },
        select: {
          id: true,
          streakCount: true,
          streakLastDate: true,
          dailyActiveSeconds: true,
          dailyActiveDate: true,
        },
      });

      streakUpdated = true;
      return res.json({
        ok: true,
        source,
        qualifiedToday: true,
        streakUpdated,
        streakBroke,
        ...streakSaved,
      });
    }

    return res.json({
      ok: true,
      source,
      qualifiedToday: qualifiedNow,
      streakUpdated,
      streakBroke,
      ...updatedDaily,
    });
  } catch (_error) {
    return res.status(500).json({ error: "Failed to log activity" });
  }
});

app.get("/api/users", async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        preparationGoal: true,
        currentClass: true,
        studyLevel: true,
        previousPercentage: true,
        streakCount: true,
        streakLastDate: true,
        dailyActiveSeconds: true,
        dailyActiveDate: true,
        createdAt: true,
      },
    });

    return res.json(users);
  } catch (_error) {
    return res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
