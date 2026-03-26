import { 
  fetchEvents, createEvent, updateEvent, deleteEvent, selectEvents,
  fetchEventCategories, createEventCategory, updateEventCategory, deleteEventCategory, selectEventCategories,
  fetchEventVenues, createEventVenue, updateEventVenue, deleteEventVenue, selectEventVenues,
  fetchRegistrations, fetchMyRegistrations, registerForEvent, selectRegistrations,
  fetchApprovals, approveEvent, selectApprovals
} from "./slices/eventSlice";

import {
  fetchColleges, createCollege, updateCollege, deleteCollege, selectColleges,
  fetchBranches, createBranch, updateBranch, deleteBranch, selectBranches,
  fetchDepartments, createDepartment, updateDepartment, deleteDepartment, selectDepartments,
  fetchBatches, createBatch, updateBatch, deleteBatch, selectBatches,
  fetchUsers, updateUser, selectUsers,
  fetchStudents, createStudent, updateStudent, deleteStudent, selectStudents,
  fetchFaculty, createFaculty, updateFaculty, deleteFaculty, selectFaculty,
  fetchHods, createHod, updateHod, deleteHod, selectHods,
  fetchAdmins, createAdmin, updateAdmin, deleteAdmin, selectAdmins,
  fetchAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement, selectAnnouncements,
  fetchNotifications, selectNotifications,
  fetchAttendance, createAttendance, selectAttendance,
  fetchCertificates, createCertificate, deleteCertificate, selectCertificates,
  fetchActivityLogs, selectActivityLogs,
  fetchQueries, createQuery, selectQueries
} from "./slices/coreSlice";

/**
 * Resource Registry — maps a resource name (string) to its Redux actions and selectors.
 * This allows CrudPage to be fully Redux-aware by just knowing its resource name.
 */
export const resourceRegistry = {
  "events": {
    fetch: fetchEvents,
    create: createEvent,
    update: updateEvent,
    delete: deleteEvent,
    selector: selectEvents
  },
  "event-categories": {
    fetch: fetchEventCategories,
    create: createEventCategory,
    update: updateEventCategory,
    delete: deleteEventCategory,
    selector: selectEventCategories
  },
  "event-venues": {
    fetch: fetchEventVenues,
    create: createEventVenue,
    update: updateEventVenue,
    delete: deleteEventVenue,
    selector: selectEventVenues
  },
  "event-registrations": {
    fetch: fetchRegistrations,
    create: registerForEvent,
    selector: selectRegistrations
  },
  "event-registrations/me": {
    fetch: fetchMyRegistrations, 
    selector: selectRegistrations
  },
  "event-approvals": {
    fetch: fetchApprovals,
    update: approveEvent, // Approvals use approve (post/put)
    selector: selectApprovals
  },
  "colleges": {
    fetch: fetchColleges,
    create: createCollege,
    update: updateCollege,
    delete: deleteCollege,
    selector: selectColleges
  },
  "branches": {
    fetch: fetchBranches,
    create: createBranch,
    update: updateBranch,
    delete: deleteBranch,
    selector: selectBranches
  },
  "departments": {
    fetch: fetchDepartments,
    create: createDepartment,
    update: updateDepartment,
    delete: deleteDepartment,
    selector: selectDepartments
  },
  "batches": {
    fetch: fetchBatches,
    create: createBatch,
    update: updateBatch,
    delete: deleteBatch,
    selector: selectBatches
  },
  "users": {
    fetch: fetchUsers,
    update: updateUser,
    selector: selectUsers
  },
  "students": {
    fetch: fetchStudents,
    create: createStudent,
    update: updateStudent,
    delete: deleteStudent,
    selector: selectStudents
  },
  "faculty": {
    fetch: fetchFaculty,
    create: createFaculty,
    update: updateFaculty,
    delete: deleteFaculty,
    selector: selectFaculty
  },
  "hods": {
    fetch: fetchHods,
    create: createHod,
    update: updateHod,
    delete: deleteHod,
    selector: selectHods
  },
  "admins": {
    fetch: fetchAdmins,
    create: createAdmin,
    update: updateAdmin,
    delete: deleteAdmin,
    selector: selectAdmins
  },
  "announcements": {
    fetch: fetchAnnouncements,
    create: createAnnouncement,
    update: updateAnnouncement,
    delete: deleteAnnouncement,
    selector: selectAnnouncements
  },
  "notifications": {
    fetch: fetchNotifications,
    selector: selectNotifications
  },
  "attendance": {
    fetch: fetchAttendance,
    create: createAttendance,
    selector: selectAttendance
  },
  "attendance/me": {
    fetch: fetchAttendance,
    selector: selectAttendance
  },
  "certificates": {
    fetch: fetchCertificates,
    create: createCertificate,
    delete: deleteCertificate,
    selector: selectCertificates
  },
  "activity-logs": {
    fetch: fetchActivityLogs,
    selector: selectActivityLogs
  },
  "queries": {
    fetch: fetchQueries,
    create: createQuery,
    selector: selectQueries
  }
};
