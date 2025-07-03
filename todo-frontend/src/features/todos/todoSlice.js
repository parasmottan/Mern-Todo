
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
      const res = await axios.get('/todos', {
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
      const res = await axios.post(
        '/todos',
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
      await axios.delete(`/todos/${id}`, {
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

// ✅ Todo Slice
const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
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

      // add
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

      // delete
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((todo) => todo._id !== action.payload);
      });
  },
});

export default todoSlice.reducer;
