export const isAdmin = async (req, res, next) => {
  try {
    const user = req.user;

    if (user.role !== "Admin") {
      return res.status(401).send({
        success: false,
        message: "admin only",
      });
    }
    return next();
  } catch (error) {
    next(error);
  }
};
