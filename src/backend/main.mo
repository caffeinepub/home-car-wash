import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Array "mo:core/Array";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Custom Types
  type WashType = {
    #basic;
    #standard;
    #premium;
  };

  type AppointmentStatus = {
    #pending;
    #completed;
    #cancelled;
  };

  type Vehicle = {
    id : Nat;
    owner : Principal;
    make : Text;
    model : Text;
    licensePlate : Text;
  };

  type WashAppointment = {
    id : Nat;
    owner : Principal;
    vehicleId : Nat;
    washType : WashType;
    scheduledDate : Text;
    scheduledTime : Text;
    address : Text;
    status : AppointmentStatus;
    createdAt : Int;
  };

  type WashStats = {
    totalWashes : Nat;
    upcomingWashes : Nat;
    completedWashes : Nat;
    cancelledWashes : Nat;
  };

  public type UserProfile = {
    name : Text;
  };

  // Comparison modules
  module Vehicle {
    public func compare(v1 : Vehicle, v2 : Vehicle) : Order.Order {
      Nat.compare(v1.id, v2.id);
    };
  };

  module WashAppointment {
    public func compare(a1 : WashAppointment, a2 : WashAppointment) : Order.Order {
      Nat.compare(a1.id, a2.id);
    };
  };

  let vehicles = Map.empty<Nat, Vehicle>();
  let appointments = Map.empty<Nat, WashAppointment>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var vehicleIdCounter = 0;
  var appointmentIdCounter = 0;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Vehicle Management
  public shared ({ caller }) func addVehicle(make : Text, model : Text, licensePlate : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can add vehicles");
    };

    vehicleIdCounter += 1;
    let vehicle : Vehicle = {
      id = vehicleIdCounter;
      owner = caller;
      make;
      model;
      licensePlate;
    };
    vehicles.add(vehicle.id, vehicle);
    vehicle.id;
  };

  public query ({ caller }) func listMyVehicles() : async [Vehicle] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can list vehicles");
    };
    vehicles.values().filter(
      func(v) { v.owner == caller }
    ).toArray().sort();
  };

  public shared ({ caller }) func deleteVehicle(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can delete vehicles");
    };

    switch (vehicles.get(id)) {
      case (null) { Runtime.trap("Vehicle not found") };
      case (?vehicle) {
        if (vehicle.owner != caller) {
          Runtime.trap("You can only delete your own vehicles");
        };
        vehicles.remove(id);
      };
    };
  };

  // Appointments
  public shared ({ caller }) func bookWash(
    vehicleId : Nat,
    washType : WashType,
    scheduledDate : Text,
    scheduledTime : Text,
    address : Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can book washes");
    };

    switch (vehicles.get(vehicleId)) {
      case (null) { Runtime.trap("Vehicle does not exist!") };
      case (?vehicle) {
        if (vehicle.owner != caller) {
          Runtime.trap("You can only book washes for your own vehicles");
        };

        appointmentIdCounter += 1;
        let appointment : WashAppointment = {
          id = appointmentIdCounter;
          owner = caller;
          vehicleId;
          washType;
          scheduledDate;
          scheduledTime;
          address;
          status = #pending;
          createdAt = Time.now();
        };
        appointments.add(appointment.id, appointment);
        appointment.id;
      };
    };
  };

  public query ({ caller }) func getMyAppointments() : async [WashAppointment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can view appointments");
    };
    appointments.values().filter(
      func(a) { a.owner == caller }
    ).toArray().sort();
  };

  public query ({ caller }) func getMyUpcomingAppointments() : async [WashAppointment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can view appointments");
    };
    appointments.values().filter(
      func(a) { a.owner == caller and a.status == #pending }
    ).toArray().sort();
  };

  public query ({ caller }) func getMyPastAppointments() : async [WashAppointment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can view appointments");
    };
    appointments.values().filter(
      func(a) { 
        a.owner == caller and (a.status == #completed or a.status == #cancelled)
      }
    ).toArray().sort();
  };

  public shared ({ caller }) func cancelAppointment(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can cancel appointments");
    };

    switch (appointments.get(id)) {
      case (null) { Runtime.trap("Appointment not found") };
      case (?appointment) {
        if (appointment.owner != caller) {
          Runtime.trap("You can only cancel your own appointments");
        };
        if (appointment.status != #pending) {
          Runtime.trap("Can only cancel pending appointments");
        };
        let updated : WashAppointment = { appointment with status = #cancelled };
        appointments.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func updateAppointmentStatus(id : Nat, status : AppointmentStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can update appointment status");
    };

    switch (appointments.get(id)) {
      case (null) { Runtime.trap("Appointment not found") };
      case (?appointment) {
        let updated : WashAppointment = { appointment with status = status };
        appointments.add(id, updated);
      };
    };
  };

  public query ({ caller }) func getMyWashStats() : async WashStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can view stats");
    };

    let myAppointments = appointments.values().filter(
      func(a) { a.owner == caller }
    );

    var totalWashes = 0;
    var upcomingWashes = 0;
    var completedWashes = 0;
    var cancelledWashes = 0;

    for (appointment in myAppointments) {
      totalWashes += 1;
      switch (appointment.status) {
        case (#pending) { upcomingWashes += 1 };
        case (#completed) { completedWashes += 1 };
        case (#cancelled) { cancelledWashes += 1 };
      };
    };

    {
      totalWashes;
      upcomingWashes;
      completedWashes;
      cancelledWashes;
    };
  };

  public query ({ caller }) func getAllAppointments() : async [WashAppointment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can view all appointments");
    };
    appointments.values().toArray().sort();
  };
};
