import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

const initialState = {
  todos: [],
  error: null,
  loading: false,
};

// ✅ Fetch Todos
export const fetchTodos = createAsyncThunk(
  'todo/getTodos',
  async (_, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    try {
      // Yahan '/api' prefix add kiya hai
      const res = await axios.get('/api/todos', { // <-- CHANGE: /api/todos
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch todos');
    }
  }
);

// ✅ Add Todo
export const addTodo = createAsyncThunk(
  'todo/addTodo',
  async (todoText, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    try {
      // Yahan '/api' prefix add kiya hai
      const res = await axios.post(
        '/api/todos', // <-- CHANGE: /api/todos
        { text: todoText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to add todo');
    }
  }
);

// ✅ Delete Todo
export const deleteTodo = createAsyncThunk(
  'todos/delete',
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    try {
      // Yahan '/api' prefix add kiya hai
      await axios.delete(`/api/todos/${id}`, { // <-- CHANGE: /api/todos/${id}
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete todo');
    }
  }
);

// ✅ Slice (No changes here)
const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.todos.push(action.payload);
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((todo) => todo._id !== action.payload);
      });
  },
});

export default todoSlice.reducer;
