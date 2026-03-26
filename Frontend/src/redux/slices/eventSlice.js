import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { eventService, eventRegistrationService, eventApprovalService, eventCategoryService, eventVenueService } from "@/services/event.service";
import { toast } from "sonner";

// ─── Events ──────────────────────────────────────────────────────────────────
export const fetchEvents = createAsyncThunk("events/fetchAll", async (params = {}, { rejectWithValue }) => {
  try { return await eventService.getAll(params); }
  catch (error) { return rejectWithValue(error.response?.data?.message || "Failed to fetch events"); }
});
export const createEvent = createAsyncThunk("events/create", async (data, { rejectWithValue }) => {
  try {
    const res = await eventService.create(data);
    toast.success("Event created successfully");
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to create event";
    toast.error(msg);
    return rejectWithValue(msg);
  }
});
export const updateEvent = createAsyncThunk("events/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await eventService.update(id, data);
    toast.success("Event updated successfully");
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to update event";
    toast.error(msg);
    return rejectWithValue(msg);
  }
});
export const deleteEvent = createAsyncThunk("events/delete", async (id, { rejectWithValue }) => {
  try {
    await eventService.remove(id);
    toast.success("Event deleted successfully");
    return id;
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to delete event";
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

// ─── Categories ──────────────────────────────────────────────────────────────
export const fetchEventCategories = createAsyncThunk("categories/fetchAll", async (params = {}, { rejectWithValue }) => {
  try { return await eventCategoryService.getAll(params); }
  catch (error) { return rejectWithValue(error.response?.data?.message || "Failed to fetch categories"); }
});
export const createEventCategory = createAsyncThunk("categories/create", async (data, { rejectWithValue }) => {
  try {
    const res = await eventCategoryService.create(data);
    toast.success("Category created");
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to create category";
    toast.error(msg);
    return rejectWithValue(msg);
  }
});
export const updateEventCategory = createAsyncThunk("categories/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await eventCategoryService.update(id, data);
    toast.success("Category updated");
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to update category";
    toast.error(msg);
    return rejectWithValue(msg);
  }
});
export const deleteEventCategory = createAsyncThunk("categories/delete", async (id, { rejectWithValue }) => {
  try {
    await eventCategoryService.remove(id);
    toast.success("Category deleted");
    return id;
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to delete category";
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

// ─── Venues ──────────────────────────────────────────────────────────────────
export const fetchEventVenues = createAsyncThunk("venues/fetchAll", async (params = {}, { rejectWithValue }) => {
  try { return await eventVenueService.getAll(params); }
  catch (error) { return rejectWithValue(error.response?.data?.message || "Failed to fetch venues"); }
});
export const createEventVenue = createAsyncThunk("venues/create", async (data, { rejectWithValue }) => {
  try {
    const res = await eventVenueService.create(data);
    toast.success("Venue created");
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to create venue";
    toast.error(msg);
    return rejectWithValue(msg);
  }
});
export const updateEventVenue = createAsyncThunk("venues/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await eventVenueService.update(id, data);
    toast.success("Venue updated");
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to update venue";
    toast.error(msg);
    return rejectWithValue(msg);
  }
});
export const deleteEventVenue = createAsyncThunk("venues/delete", async (id, { rejectWithValue }) => {
  try {
    await eventVenueService.remove(id);
    toast.success("Venue deleted");
    return id;
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to delete venue";
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

// ─── Registrations ───────────────────────────────────────────────────────────
export const fetchRegistrations = createAsyncThunk("registrations/fetchAll", async (params = {}, { rejectWithValue }) => {
  try { return await eventRegistrationService.getAll(params); }
  catch (error) { return rejectWithValue(error.response?.data?.message || "Failed to fetch registrations"); }
});
export const fetchMyRegistrations = createAsyncThunk("registrations/fetchMine", async (params = {}, { rejectWithValue }) => {
  try { return await eventRegistrationService.getMine(params); }
  catch (error) { return rejectWithValue(error.response?.data?.message || "Failed to fetch your registrations"); }
});
export const registerForEvent = createAsyncThunk("registrations/create", async (data, { rejectWithValue }) => {
  try {
    const res = await eventRegistrationService.register(data);
    toast.success("Registered for event successfully");
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to register";
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

// ─── Approvals ───────────────────────────────────────────────────────────────
export const fetchApprovals = createAsyncThunk("approvals/fetchAll", async (params = {}, { rejectWithValue }) => {
  try { return await eventApprovalService.getAll(params); }
  catch (error) { return rejectWithValue(error.response?.data?.message || "Failed to fetch approvals"); }
});
export const approveEvent = createAsyncThunk("approvals/approve", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await eventApprovalService.update(id, data);
    toast.success("Event approval updated");
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to update approval";
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

// ─── Selector helper (also exported for Landing StatsSection) ──────────────
export const selectEventsTotal = (state) => state.events.events.total;

// ─── Slice ─────────────────────────────────────────────────────────────────────
const makeResState = () => ({ list: [], total: 0, isLoading: false, error: null });

const eventSlice = createSlice({
  name: "events",
  initialState: {
    events:        makeResState(),
    categories:    makeResState(),
    venues:        makeResState(),
    registrations: makeResState(),
    approvals:     makeResState(),
  },
  reducers: {},
  extraReducers: (builder) => {
    // ── Events ──
    builder
      .addCase(fetchEvents.pending, (state) => { state.events.isLoading = true; state.events.error = null; })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.events.isLoading = false;
        state.events.list = action.payload?.data || [];
        state.events.total = action.payload?.total || 0;
      })
      .addCase(fetchEvents.rejected, (state, action) => { state.events.isLoading = false; state.events.error = action.payload; })
      .addCase(createEvent.fulfilled, (state, action) => { if (action.payload) state.events.list.unshift(action.payload); })
      .addCase(updateEvent.fulfilled, (state, action) => {
        if (action.payload) {
          const idx = state.events.list.findIndex(e => e._id === action.payload._id);
          if (idx !== -1) state.events.list[idx] = action.payload;
        }
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events.list = state.events.list.filter(e => e._id !== action.payload);
      });

    // ── Categories ──
    builder
      .addCase(fetchEventCategories.pending, (state) => { state.categories.isLoading = true; state.categories.error = null; })
      .addCase(fetchEventCategories.fulfilled, (state, action) => {
        state.categories.isLoading = false;
        state.categories.list = action.payload?.data || [];
        state.categories.total = action.payload?.total || 0;
      })
      .addCase(fetchEventCategories.rejected, (state, action) => { state.categories.isLoading = false; state.categories.error = action.payload; })
      .addCase(createEventCategory.fulfilled, (state, action) => { if (action.payload) state.categories.list.unshift(action.payload); })
      .addCase(updateEventCategory.fulfilled, (state, action) => {
        if (action.payload) {
          const idx = state.categories.list.findIndex(e => e._id === action.payload._id);
          if (idx !== -1) state.categories.list[idx] = action.payload;
        }
      })
      .addCase(deleteEventCategory.fulfilled, (state, action) => {
        state.categories.list = state.categories.list.filter(e => e._id !== action.payload);
      });

    // ── Venues ──
    builder
      .addCase(fetchEventVenues.pending, (state) => { state.venues.isLoading = true; state.venues.error = null; })
      .addCase(fetchEventVenues.fulfilled, (state, action) => {
        state.venues.isLoading = false;
        state.venues.list = action.payload?.data || [];
        state.venues.total = action.payload?.total || 0;
      })
      .addCase(fetchEventVenues.rejected, (state, action) => { state.venues.isLoading = false; state.venues.error = action.payload; })
      .addCase(createEventVenue.fulfilled, (state, action) => { if (action.payload) state.venues.list.unshift(action.payload); })
      .addCase(updateEventVenue.fulfilled, (state, action) => {
        if (action.payload) {
          const idx = state.venues.list.findIndex(e => e._id === action.payload._id);
          if (idx !== -1) state.venues.list[idx] = action.payload;
        }
      })
      .addCase(deleteEventVenue.fulfilled, (state, action) => {
        state.venues.list = state.venues.list.filter(e => e._id !== action.payload);
      });

    // ── Registrations ──
    builder
      .addCase(fetchRegistrations.pending, (state) => { state.registrations.isLoading = true; state.registrations.error = null; })
      .addCase(fetchRegistrations.fulfilled, (state, action) => {
        state.registrations.isLoading = false;
        state.registrations.list = action.payload?.data || [];
        state.registrations.total = action.payload?.total || 0;
      })
      .addCase(fetchRegistrations.rejected, (state, action) => { state.registrations.isLoading = false; state.registrations.error = action.payload; })
      
      .addCase(fetchMyRegistrations.pending, (state) => { state.registrations.isLoading = true; state.registrations.error = null; })
      .addCase(fetchMyRegistrations.fulfilled, (state, action) => {
        state.registrations.isLoading = false;
        // The student /me endpoint returns { success, data } where data is the list
        state.registrations.list = action.payload?.data || [];
        state.registrations.total = action.payload?.data?.length || 0;
      })
      .addCase(fetchMyRegistrations.rejected, (state, action) => { state.registrations.isLoading = false; state.registrations.error = action.payload; })
      
      .addCase(registerForEvent.fulfilled, (state, action) => { if (action.payload) state.registrations.list.unshift(action.payload); });

    // ── Approvals ──
    builder
      .addCase(fetchApprovals.pending, (state) => { state.approvals.isLoading = true; state.approvals.error = null; })
      .addCase(fetchApprovals.fulfilled, (state, action) => {
        state.approvals.isLoading = false;
        state.approvals.list = action.payload?.data || [];
        state.approvals.total = action.payload?.total || 0;
      })
      .addCase(fetchApprovals.rejected, (state, action) => { state.approvals.isLoading = false; state.approvals.error = action.payload; })
      .addCase(approveEvent.fulfilled, (state, action) => {
        if (action.payload) {
          const idx = state.approvals.list.findIndex(e => e._id === action.payload._id);
          if (idx !== -1) state.approvals.list[idx] = action.payload;
        }
      });
  },
});

export const selectEvents          = state => state.events.events;
export const selectEventsLoading   = state => state.events.events.isLoading;
export const selectEventCategories = state => state.events.categories;
export const selectEventVenues     = state => state.events.venues;
export const selectRegistrations   = state => state.events.registrations;
export const selectApprovals       = state => state.events.approvals;

export default eventSlice.reducer;
