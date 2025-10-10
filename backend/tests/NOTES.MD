UserService.ts
| Method                            | Description                               | Typical use case               |
| --------------------------------- | ----------------------------------------- | ------------------------------ |
| `createUser(data)`                | Create user record (with hashed password) | Registration, admin adds users |
| `getUserByEmail(email)`           | Find by unique email                      | Login, checks before register  |
| `getUserById(id)`                 | Load profile data                         | Auth middleware, dashboard     |
| `getAllUsers()`                   | List all users (with roles)               | Admin page                     |
| `updateUser(id, data)`            | Update profile info                       | Change name/email/etc.         |
| `updateUserRole(id, roleId)`      | Change user role                          | Admin privileges               |
| `deleteUser(id)`                  | Soft or hard delete                       | Account removal                |
| `assignRole(userId, roleName)`    | Link role via relation                    | Dynamic role assignment        |
| `changePassword(id, newPassword)` | Hash new password and store               | Reset or manual change         |


AuthService.ts
| Method                             | Description                | Typical use case                |
| ---------------------------------- | -------------------------- | ------------------------------- |
| `register(email, password, name?)` | Hash password, create user | Signup flow                     |
| `login(email, password)`           | Verify credentials         | Login flow                      |
| `logout(session)`                  | Invalidate cookie/session  | Logout endpoint                 |
| `verifySession(cookie)`            | Check session validity     | Middleware for protected routes |
| `refreshSession(oldSession)`       | Extend session duration    | “Remember me” behavior          |
