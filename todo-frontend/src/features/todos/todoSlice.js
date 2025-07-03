import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

const initialState = {
  todos: [],
  error: null,
  loading: false,
};

// ✅ Fetch Todos
export const fetchTodos = createAsyncThunk(
  'todo/getTodos',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.user.token;

    try {
      const res = await axios.get('http://localhost:5000/api/todos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// ✅ Add Todo
export const addTodo = createAsyncThunk(
  'todo/addTodo',
  async (todoText, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.user.token;

    try {
      const res = await axios.post(
        'http://localhost:5000/api/todos',
        { text: todoText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// ✅ Delete Todo
export const deleteTodo = createAsyncThunk(
  'todos/delete',
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.user.token;

    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Failed to delete todo'
      );
    }
  }
);

// ✅ Slice
export const todoSlice = createSlice({
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
  }
});

export default todoSlice.reducer;
