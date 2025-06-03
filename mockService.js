export let mockUsers = [
  {
    id: 1,
    name: "Alice",
    email: "alice@test.com",
    role: "user",
    password: "Test01",
  },
  {
    id: 2,
    name: "Bob",
    email: "bob@test.com",
    role: "admin",
    password: "Test02",
  },
];

export const mockDataByUser = {
  1: [
    {
      id: "e1",
      type: "estudio",
      data: {
        institution: "Universidad Nacional de Tucumán",
        degree: "Ingeniería en Sistemas",
        startDate: "2018-03-01",
        endDate: "2022-12-15",
        status: "completado",
      },
    },
    {
      id: "d1",
      type: "direccion",
      data: {
        street: "Calle Falsa 123, Piso 2",
        city: "San Miguel de Tucumán",
        province: "Tucumán",
        zipCode: "4000",
        country: "Argentina",
        addressType: "personal",
      },
    },
  ],
  2: [
    {
      id: "e2",
      type: "estudio",
      data: {
        institution: "Universidad de Buenos Aires",
        degree: "Medicina",
        startDate: "2016-03-01",
        endDate: "2022-12-15",
        status: "completado",
      },
    },
  ],
};

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

  // Actualizar la referencia para asegurar reactividad
  mockDataByUser[userId] = [...list];
  
  console.log('Datos guardados para usuario', userId, newEntry);
  return newEntry;
}

export function deleteUserData(userId, dataId) {
  if (!mockDataByUser[userId]) {
    return false;
  }
  
  const list = mockDataByUser[userId];
  const filteredList = list.filter((item) => item.id !== dataId);
  
  // Actualizar la referencia para asegurar reactividad
  mockDataByUser[userId] = filteredList;
  
  console.log('Dato eliminado para usuario', userId, 'ID:', dataId);
  return true;
}

export function updateUserProfile(userId, updatedData) {
  const userIndex = mockUsers.findIndex((user) => user.id === userId);
  if (userIndex === -1) {
    console.error('Usuario no encontrado:', userId);
    return false;
  }

  console.log('Actualizando perfil de usuario:', userId, updatedData);

  // Crear nuevo objeto para asegurar reactividad
  const updatedUser = {
    ...mockUsers[userIndex],
    ...updatedData,
    id: mockUsers[userIndex].id, // Preservar ID original
    password: mockUsers[userIndex].password, // Preservar password original
  };
  
  mockUsers[userIndex] = updatedUser;
  
  // Crear nueva referencia del array para asegurar reactividad
  mockUsers = [...mockUsers];
  
  console.log('Usuario actualizado:', updatedUser);
  return true;
}

// Nueva función para crear un usuario
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
  mockUsers = [...mockUsers]; // Crear nueva referencia
  
  // Inicializar datos vacíos para el nuevo usuario
  mockDataByUser[newId] = [];
  
  console.log('Nuevo usuario creado:', newUser);
  return newUser;
}

// Nueva función para eliminar un usuario
export function deleteUser(userId) {
  const userIndex = mockUsers.findIndex((user) => user.id === userId);
  if (userIndex === -1) {
    return false;
  }
  
  // Eliminar usuario del array
  mockUsers.splice(userIndex, 1);
  mockUsers = [...mockUsers]; // Crear nueva referencia
  
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

// Función utilitaria para obtener todos los usuarios
export function getAllUsers() {
  return [...mockUsers];
}

// Función utilitaria para obtener estadísticas
export function getUserStats() {
  return {
    totalUsers: mockUsers.length,
    usersWithData: Object.keys(mockDataByUser).length,
    totalDataEntries: Object.values(mockDataByUser).reduce((sum, arr) => sum + arr.length, 0)
  };
}

// Función para validar integridad de datos
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