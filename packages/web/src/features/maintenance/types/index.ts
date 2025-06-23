// Service types
export const SERVICE_TYPES = [
  // Routine Maintenance
  "oil_change",
  "oil_filter_replacement",
  "air_filter_replacement",
  "cabin_filter_replacement",
  "fuel_filter_replacement",
  "tire_rotation",
  "tire_replacement",
  "general_inspection",
  "multi_point_inspection",
  "windshield_wiper_replacement",

  // Engine & Transmission
  "engine_diagnostics",
  "transmission_service",
  "transmission_fluid_change",
  "differential_service",
  "timing_belt_replacement",
  "timing_chain_replacement",
  "spark_plug_replacement",
  "ignition_coil_replacement",
  "engine_overhaul",
  "valve_adjustment",
  "head_gasket_replacement",

  // Brakes & Suspension
  "brake_replacement",
  "brake_pad_replacement",
  "brake_rotor_replacement",
  "brake_fluid_change",
  "suspension_inspection",
  "shock_absorber_replacement",
  "strut_replacement",
  "wheel_alignment",
  "wheel_balancing",

  // Electrical & Cooling
  "battery_replacement",
  "alternator_replacement",
  "starter_replacement",
  "coolant_flush",
  "radiator_replacement",
  "thermostat_replacement",
  "water_pump_replacement",
  "ac_service",
  "ac_compressor_replacement",
  "ac_recharge",

  // Drivetrain & Power Steering
  "clutch_replacement",
  "cv_joint_replacement",
  "drive_belt_replacement",
  "serpentine_belt_replacement",
  "power_steering_fluid_change",
  "power_steering_pump_replacement",

  // Exhaust & Emissions
  "exhaust_repair",
  "muffler_replacement",
  "catalytic_converter_replacement",
  "emissions_test",
  "oxygen_sensor_replacement",

  // Technology & Software
  "software_update",
  "diagnostic_scan",
  "ecu_programming",

  // Body & Interior
  "light_bulb_replacement",
  "headlight_restoration",
  "window_tinting",
  "paint_touch_up",
] as const;

export type ServiceType = typeof SERVICE_TYPES[number];

// Interface for maintenance entry
export type MaintenanceEntry = {
  uuid: string;
  vehicleUUID: string;
  serviceWorkshopUUID: string;
  customServiceWorkshopName: string | null;
  serviceDate: string;
  serviceTypes: ServiceType[];
  odometer: number | null;
  cost: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  workshop: {
    uuid: string;
    name: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
  } | null;
};

// Interface for creating maintenance entry
export type CreateMaintenanceEntry = {
  vehicleUUID: string;
  serviceWorkshopUUID?: string;
  customServiceWorkshopName?: string;
  serviceDate: string;
  serviceTypes: ServiceType[];
  odometer?: number;
  cost?: number;
  notes?: string;
};

// Interface for maintenance summary from backend
export type MaintenanceSummary = {
  totalEntries: number;
  totalCost: number;
  serviceTypeCounts: Record<string, number>;
  mostCommonService: {
    type: ServiceType;
    count: number;
  } | null;
  lastService: {
    uuid: string;
    serviceDate: string;
    serviceTypes: ServiceType[];
    cost: number | null;
  } | null;
};

// Interface for maintenance history response
export type MaintenanceHistoryResponse = {
  maintenanceHistory: MaintenanceEntry[];
  summary: MaintenanceSummary;
  vehicleInfo: {
    uuid: string;
    make: string;
    model: string;
    year: number;
    licensePlate: string;
  };
};

// Interface for maintenance entry response
export type MaintenanceEntryResponse = {
  maintenanceEntry: MaintenanceEntry;
  message: string;
};

// Service type labels for display
export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  // Routine Maintenance
  oil_change: "Oil Change",
  oil_filter_replacement: "Oil Filter Replacement",
  air_filter_replacement: "Air Filter Replacement",
  cabin_filter_replacement: "Cabin Filter Replacement",
  fuel_filter_replacement: "Fuel Filter Replacement",
  tire_rotation: "Tire Rotation",
  tire_replacement: "Tire Replacement",
  general_inspection: "General Inspection",
  multi_point_inspection: "Multi-Point Inspection",
  windshield_wiper_replacement: "Windshield Wiper Replacement",

  // Engine & Transmission
  engine_diagnostics: "Engine Diagnostics",
  transmission_service: "Transmission Service",
  transmission_fluid_change: "Transmission Fluid Change",
  differential_service: "Differential Service",
  timing_belt_replacement: "Timing Belt Replacement",
  timing_chain_replacement: "Timing Chain Replacement",
  spark_plug_replacement: "Spark Plug Replacement",
  ignition_coil_replacement: "Ignition Coil Replacement",
  engine_overhaul: "Engine Overhaul",
  valve_adjustment: "Valve Adjustment",
  head_gasket_replacement: "Head Gasket Replacement",

  // Brakes & Suspension
  brake_replacement: "Brake Replacement",
  brake_pad_replacement: "Brake Pad Replacement",
  brake_rotor_replacement: "Brake Rotor Replacement",
  brake_fluid_change: "Brake Fluid Change",
  suspension_inspection: "Suspension Inspection",
  shock_absorber_replacement: "Shock Absorber Replacement",
  strut_replacement: "Strut Replacement",
  wheel_alignment: "Wheel Alignment",
  wheel_balancing: "Wheel Balancing",

  // Electrical & Cooling
  battery_replacement: "Battery Replacement",
  alternator_replacement: "Alternator Replacement",
  starter_replacement: "Starter Replacement",
  coolant_flush: "Coolant Flush",
  radiator_replacement: "Radiator Replacement",
  thermostat_replacement: "Thermostat Replacement",
  water_pump_replacement: "Water Pump Replacement",
  ac_service: "A/C Service",
  ac_compressor_replacement: "A/C Compressor Replacement",
  ac_recharge: "A/C Recharge",

  // Drivetrain & Power Steering
  clutch_replacement: "Clutch Replacement",
  cv_joint_replacement: "CV Joint Replacement",
  drive_belt_replacement: "Drive Belt Replacement",
  serpentine_belt_replacement: "Serpentine Belt Replacement",
  power_steering_fluid_change: "Power Steering Fluid Change",
  power_steering_pump_replacement: "Power Steering Pump Replacement",

  // Exhaust & Emissions
  exhaust_repair: "Exhaust Repair",
  muffler_replacement: "Muffler Replacement",
  catalytic_converter_replacement: "Catalytic Converter Replacement",
  emissions_test: "Emissions Test",
  oxygen_sensor_replacement: "Oxygen Sensor Replacement",

  // Technology & Software
  software_update: "Software Update",
  diagnostic_scan: "Diagnostic Scan",
  ecu_programming: "ECU Programming",

  // Body & Interior
  light_bulb_replacement: "Light Bulb Replacement",
  headlight_restoration: "Headlight Restoration",
  window_tinting: "Window Tinting",
  paint_touch_up: "Paint Touch-Up",
};

// Service type categories for better organization
export const SERVICE_TYPE_CATEGORIES = {
  "Routine Maintenance": [
    "oil_change",
    "oil_filter_replacement",
    "air_filter_replacement",
    "cabin_filter_replacement",
    "fuel_filter_replacement",
    "tire_rotation",
    "tire_replacement",
    "general_inspection",
    "multi_point_inspection",
    "windshield_wiper_replacement",
  ],
  "Engine & Transmission": [
    "engine_diagnostics",
    "transmission_service",
    "transmission_fluid_change",
    "differential_service",
    "timing_belt_replacement",
    "timing_chain_replacement",
    "spark_plug_replacement",
    "ignition_coil_replacement",
    "engine_overhaul",
    "valve_adjustment",
    "head_gasket_replacement",
  ],
  "Brakes & Suspension": [
    "brake_replacement",
    "brake_pad_replacement",
    "brake_rotor_replacement",
    "brake_fluid_change",
    "suspension_inspection",
    "shock_absorber_replacement",
    "strut_replacement",
    "wheel_alignment",
    "wheel_balancing",
  ],
  "Electrical & Cooling": [
    "battery_replacement",
    "alternator_replacement",
    "starter_replacement",
    "coolant_flush",
    "radiator_replacement",
    "thermostat_replacement",
    "water_pump_replacement",
    "ac_service",
    "ac_compressor_replacement",
    "ac_recharge",
  ],
  "Drivetrain & Power Steering": [
    "clutch_replacement",
    "cv_joint_replacement",
    "drive_belt_replacement",
    "serpentine_belt_replacement",
    "power_steering_fluid_change",
    "power_steering_pump_replacement",
  ],
  "Exhaust & Emissions": [
    "exhaust_repair",
    "muffler_replacement",
    "catalytic_converter_replacement",
    "emissions_test",
    "oxygen_sensor_replacement",
  ],
  "Technology & Software": [
    "software_update",
    "diagnostic_scan",
    "ecu_programming",
  ],
  "Body & Interior": [
    "light_bulb_replacement",
    "headlight_restoration",
    "window_tinting",
    "paint_touch_up",
  ],
} as const;
