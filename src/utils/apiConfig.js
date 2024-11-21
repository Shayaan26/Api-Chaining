export const API_CONFIGS = {
    'Get User': {
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/users/',
      requestFields: ['id'],
      responseFields: ['id', 'name', 'username', 'email', 'phone', 'website'],
    },
    'Update User': {
      method: 'PUT',
      url: 'https://jsonplaceholder.typicode.com/users/',
      requestFields: ['id', 'name', 'username', 'email', 'phone', 'website'],
      responseFields: ['id', 'name', 'username', 'email', 'phone', 'website'],
    },
  };