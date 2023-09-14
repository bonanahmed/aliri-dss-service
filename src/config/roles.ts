const allRoles = {
  user: [] as string[],
  admin: ["getUsers", "manageUsers"],
};

const roles = Object.keys(allRoles) as string[];
const roleRights = new Map<string, string[]>(Object.entries(allRoles));

export { roles, roleRights };
