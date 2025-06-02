export const mockUsers = [
  { id: 1, name: 'Alice', email: 'alice@test.com', role: 'admin', password:'Test01' },
  { id: 2, name: 'Bob', email: 'bob@test.com', role: 'admin', password:'Test02' },
];

export const mockDataByUser = {
  1: [
    { id: 'e1', type: 'estudio', value: 'Ingeniería' },
    { id: 'd1', type: 'direccion', value: 'Calle Falsa 123' },
  ],
  2: [
    { id: 'e2', type: 'estudio', value: 'Medicina' },
  ],
};

export function getUserData(userId) {
  return mockDataByUser[userId] || [];
}
export function getUserInfo(userId) {
  return mockUsers.find(user => user.id === userId) || null;
}
export function saveUserData(userId, newData) {
  const list = mockDataByUser[userId] || [];
  mockDataByUser[userId] = [...list, { ...newData, id: Date.now().toString() }];
}