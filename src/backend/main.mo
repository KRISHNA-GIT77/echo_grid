import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Text "mo:core/Text";

actor {
  module Profile {
    public func compare(profile1 : Profile, profile2 : Profile) : Order.Order {
      Text.compare(profile1.name, profile2.name);
    };
  };

  module IncidentReport {
    public func compare(report1 : IncidentReport, report2 : IncidentReport) : Order.Order {
      Nat.compare(report1.id, report2.id);
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type IncidentType = {
    #earthquake;
    #flood;
    #lightning;
    #fire;
  };

  type Severity = {
    #low;
    #medium;
    #high;
    #critical;
  };

  type Location = {
    latitude : Float;
    longitude : Float;
  };

  type Profile = {
    name : Text;
    phoneNumber : Text;
    city : Text;
  };

  type IncidentReport = {
    id : Nat;
    incidentType : IncidentType;
    severity : Severity;
    description : Text;
    location : Location;
    timestamp : Time.Time;
    userId : Principal;
    userName : Text;
  };

  let profiles = Map.empty<Principal, Profile>();
  let reports = Map.empty<Nat, IncidentReport>();

  var nextReportId = 0;

  public shared ({ caller }) func saveCallerUserProfile(profile : Profile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can do that.");
    };
    profiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?Profile {
    profiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?Profile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    profiles.get(user);
  };

  public shared ({ caller }) func createReport(incidentType : IncidentType, severity : Severity, description : Text, latitude : Float, longitude : Float) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can do that.");
    };

    let userProfile = switch (profiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) { profile };
    };

    let id = nextReportId;
    nextReportId += 1;

    let report : IncidentReport = {
      id;
      incidentType;
      severity;
      description;
      location = { latitude; longitude };
      timestamp = Time.now();
      userId = caller;
      userName = userProfile.name;
    };

    reports.add(id, report);
    id;
  };

  public query ({ caller }) func getReport(reportId : Nat) : async IncidentReport {
    switch (reports.get(reportId)) {
      case (null) { Runtime.trap("Report not found") };
      case (?report) { report };
    };
  };

  public query ({ caller }) func getReportsByType(incidentType : IncidentType) : async [IncidentReport] {
    reports.values().toArray().filter(func(report) { report.incidentType == incidentType }).sort();
  };

  public shared ({ caller }) func deleteReport(reportId : Nat) : async () {
    let report = switch (reports.get(reportId)) {
      case (null) { Runtime.trap("Report not found") };
      case (?report) { report };
    };

    if (caller != report.userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only the report owner or an admin can do that.");
    };

    reports.remove(reportId);
  };

  public query ({ caller }) func getReportsNearLocation(latitude : Float, longitude : Float, radius : Float) : async [IncidentReport] {
    func distance(lat1 : Float, lon1 : Float, lat2 : Float, lon2 : Float) : Float {
      let diffLat = lat1 - lat2;
      let diffLon = lon1 - lon2;
      Float.sqrt(diffLat * diffLat + diffLon * diffLon);
    };
    reports.values().toArray().filter(func(report) { distance(report.location.latitude, report.location.longitude, latitude, longitude) <= radius }).sort();
  };

  public query ({ caller }) func getAllReports() : async [IncidentReport] {
    reports.values().toArray().sort();
  };
};
