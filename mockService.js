import mockData from './mockData.json';

// Cargar datos desde JSON
let mockUsers = [...mockData.users];
let mockDataByUser = { ...mockData.userData };

export function getUserData(userId) {
  return mockDataByUser[userId] || [];
}

export function getUserInfo(userId) {
  return mockUsers.find((user) => user.id === userId) || null;
}

export function saveUserData(userId, newData) {
  // Asegurar que el usuario existe en mockDataByUser
  if (!mockDataByUser[userId]) {
    mockDataByUser[userId] = [];
  }
  
  const list = mockDataByUser[userId];
  const newEntry = {
    ...newData,
    id: newData.id || `${newData.type.substring(0, 1)}${Date.now()}`,
  };

  if (newData.id) {
    // Actualizar entrada existente
    const index = list.findIndex((item) => item.id === newData.id);
    if (index !== -1) {
      list[index] = newEntry;
    } else {
      // Si no existe, agregar como nueva entrada
      list.push(newEntry);
    }
  } else {
    // Agregar nueva entrada
    list.push(newEntry);
  }

  console.log('Datos guardados para usuario', userId, newEntry);
  return newEntry;
}

export function deleteUserData(userId, dataId) {
  if (!mockDataByUser[userId]) {
    return false;
  }
  
  const list = mockDataByUser[userId];
  const index = list.findIndex((item) => item.id === dataId);
  
  if (index !== -1) {
    list.splice(index, 1);
    console.log('Dato eliminado para usuario', userId, 'ID:', dataId);
    return true;
  }
  
  return false;
}

export function updateUserProfile(userId, updatedData) {
  const userIndex = mockUsers.findIndex((user) => user.id === userId);
  if (userIndex === -1) {
    console.error('Usuario no encontrado:', userId);
    return false;
  }

  console.log('Actualizando perfil de usuario:', userId, updatedData);

  // Actualizar directamente el objeto en el array
  Object.assign(mockUsers[userIndex], updatedData, {
    id: mockUsers[userIndex].id, // Preservar ID original
    password: mockUsers[userIndex].password, // Preservar password original
  });
  
  console.log('Usuario actualizado:', mockUsers[userIndex]);
  return mockUsers[userIndex];
}

export function createUser(userData) {
  const newId = Math.max(...mockUsers.map(u => u.id), 0) + 1;
  const newUser = {
    id: newId,
    name: userData.name || '',
    email: userData.email || '',
    role: userData.role || 'user',
    password: userData.password || 'default123',
  };
  
  mockUsers.push(newUser);
  
  // Inicializar datos vacíos para el nuevo usuario
  mockDataByUser[newId] = [];
  
  console.log('Nuevo usuario creado:', newUser);
  return newUser;
}

export function deleteUser(userId) {
  const userIndex = mockUsers.findIndex((user) => user.id === userId);
  if (userIndex === -1) {
    return false;
  }
  
  // Eliminar usuario del array
  mockUsers.splice(userIndex, 1);
  
  // Eliminar datos asociados al usuario
  delete mockDataByUser[userId];
  
  console.log('Usuario eliminado:', userId);
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
    totalDataEntries: Object.values(mockDataByUser).reduce((sum, arr) => sum + arr.length, 0)
  };
}

export function validateDataIntegrity() {
  const issues = [];
  
  // Verificar que todos los usuarios en mockDataByUser existen en mockUsers
  Object.keys(mockDataByUser).forEach(userId => {
    const userExists = mockUsers.some(user => user.id === parseInt(userId));
    if (!userExists) {
      issues.push(`Datos encontrados para usuario inexistente: ${userId}`);
    }
  });
  
  return issues;
}

// Función para resetear datos desde JSON
export function resetToInitialData() {
  mockUsers = [...mockData.users];
  mockDataByUser = { ...mockData.userData };
  console.log('Datos reseteados a valores iniciales del JSON');
}