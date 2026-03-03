# Home Car Wash App

## Current State
New project with no existing code.

## Requested Changes (Diff)

### Add
- Home car wash booking and management app
- Users can add their vehicles (make, model, license plate)
- Users can schedule a wash appointment (date, time, address, wash type)
- Wash types: Basic, Standard, Premium (with descriptions and prices)
- View upcoming and past wash appointments
- Mark appointments as completed or cancel them
- Simple dashboard showing wash stats (total washes, upcoming, completed)
- Admin can manage all appointments and mark them complete

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend:
   - Data types: Vehicle (id, owner, make, model, licensePlate), WashAppointment (id, owner, vehicleId, washType, date, time, address, status, createdAt)
   - WashType variants: Basic, Standard, Premium
   - Status variants: Pending, Completed, Cancelled
   - CRUD for vehicles: addVehicle, getMyVehicles, deleteVehicle
   - CRUD for appointments: bookAppointment, getMyAppointments, getAllAppointments (admin), updateAppointmentStatus, cancelAppointment
   - Simple stats: getMyStats (total, upcoming, completed counts)

2. Frontend:
   - Landing/Dashboard page with wash stats cards
   - Vehicles page: list vehicles, add vehicle form
   - Book Wash page: select vehicle, wash type, date/time, address
   - Appointments page: tabs for upcoming / past, status badge, cancel action
   - Clean, modern design with car-washing theme
