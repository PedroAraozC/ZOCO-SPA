import mockData from "./mockData.json";

const STORAGE_KEY_USERS = "mockUsers";
const STORAGE_KEY_USER_DATA = "mockUserData";

function loadFromSessionStorage(key, fallback) {
  const stored = sessionStorage.getItem(key);
  return stored ? JSON.parse(stored) : fallback;
}

function saveToSessionStorage(key, data) {
  sessionStorage.setItem(key, JSON.stringify(data));
}

// Inicialización
let mockUsers = loadFromSessionStorage(STORAGE_KEY_USERS, [...mockData.users]);
let mockDataByUser = loadFromSessionStorage(STORAGE_KEY_USER_DATA, {
  ...mockData.userData,
});

function persist() {
  saveToSessionStorage(STORAGE_KEY_USERS, mockUsers);
  saveToSessionStorage(STORAGE_KEY_USER_DATA, mockDataByUser);
}

// ========== FUNCIONES DE AUTENTICACIÓN ==========
export function loginUser(email, password) {
  const users = getAllUsers();
  return (
    users.find((u) => u.email === email && u.password === password) || null
  );
}

// ========== FUNCIONES DE DATOS ==========
export function getUserData(userId) {
  return mockDataByUser[userId] || [];
}

export function getUserInfo(userId) {
  return mockUsers.find((user) => user.id === userId) || null;
}

export function saveUserData(userId, newData) {
  if (!mockDataByUser[userId]) {
    mockDataByUser[userId] = [];
  }

  const list = mockDataByUser[userId];
  const newEntry = {
    ...newData,
    id: newData.id || `${newData.type[0]}${Date.now()}`,
  };

  const index = list.findIndex((item) => item.id === newData.id);

  if (index !== -1) {
    list[index] = newEntry;
  } else {
    list.push(newEntry);
  }

  persist();
  return newEntry;
}

export function deleteUserData(userId, dataId) {
  if (!mockDataByUser[userId]) return false;

  const list = mockDataByUser[userId];
  const index = list.findIndex((item) => item.id === dataId);
  if (index !== -1) {
    list.splice(index, 1);
    persist();
    return true;
  }

  return false;
}

export function updateUserProfile(userId, updatedData) {
  const userIndex = mockUsers.findIndex((user) => user.id === userId);
  if (userIndex === -1) return false;

  Object.assign(mockUsers[userIndex], updatedData, {
    id: mockUsers[userIndex].id,
    // password: mockUsers[userIndex].password,
  });

  persist();
  return mockUsers[userIndex];
}

export function createUser(userData) {
  const newId = Math.max(...mockUsers.map((u) => u.id), 0) + 1;
  const newUser = {
    id: newId,
    name: userData.name || "",
    email: userData.email || "",
    role: userData.role || "user",
    password: userData.password || "default123",
  };

  mockUsers.push(newUser);
  mockDataByUser[newId] = [];

  persist();
  return newUser;
}

export function deleteUser(userId) {
  const userIndex = mockUsers.findIndex((user) => user.id === userId);
  if (userIndex === -1) return false;

  mockUsers.splice(userIndex, 1);
  delete mockDataByUser[userId];

  persist();
  return true;
}

export function getDataDescription(item) {
  if (item.type === "estudio") {
    return `${item.data.degree} - ${item.data.institution}`;
  } else if (item.type === "direccion") {
    return `${item.data.street}, ${item.data.city}`;
  }
  return item.value || "Sin descripción";
}

export function getAllUsers() {
  return [...mockUsers];
}

export function getUserStats() {
  return {
    totalUsers: mockUsers.length,
    usersWithData: Object.keys(mockDataByUser).length,
    totalDataEntries: Object.values(mockDataByUser).reduce(
      (sum, arr) => sum + arr.length,
      0
    ),
  };
}

export function validateDataIntegrity() {
  const issues = [];
  Object.keys(mockDataByUser).forEach((userId) => {
    const userExists = mockUsers.some((user) => user.id === parseInt(userId));
    if (!userExists) {
      issues.push(`Datos encontrados para usuario inexistente: ${userId}`);
    }
  });
  return issues;
}

export function resetToInitialData() {
  mockUsers = [...mockData.users];
  mockDataByUser = { ...mockData.userData };
  persist();
}
