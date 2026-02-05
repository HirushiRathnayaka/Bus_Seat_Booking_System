export const setAdminCreds = (username, password) => {
  localStorage.setItem("adminUser", username);
  localStorage.setItem("adminPass", password);
};

export const getAdminCreds = () => ({
  username: localStorage.getItem("adminUser"),
  password: localStorage.getItem("adminPass"),
});

export const adminLogout = () => {
  localStorage.removeItem("adminUser");
  localStorage.removeItem("adminPass");
};
